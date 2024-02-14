const { Server } = require("socket.io");
const { userJoin, getRoomUsers, userLeave, userLeaveById } = require("./utils/user");

module.exports = (server) => {
	const io = new Server(server, {
		cors: {
			origin: ["http://localhost:3001", "http://localhost:3000"], // 필요한 경우 CORS 설정
			credentials: true,
		},
		path: "/socket", // 클라이언트와 동일한 경로를 설정
	});

	const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]; // 색상 배열

	io.on("connection", (socket) => {
		const broadcastToRoomExceptMe = (event, data, givenRoomId) => {
			const roomId = givenRoomId || Array.from(socket.rooms).find((r) => r !== socket.id); // socket.id를 제외한 첫 번째 방 ID를 찾음
			if (roomId) {
				socket.to(roomId).emit(event, data);
			}
		};

		const broadcastToRoomIncludeMe = (event, data, givenRoomId) => {
			const roomId = givenRoomId || Array.from(socket.rooms).find((r) => r !== socket.id); // socket.id를 제외한 첫 번째 방 ID를 찾음
			if (roomId) {
				io.to(roomId).emit(event, data);
			}
		};

		socket.on("room-joined", (data) => {
			const { roomId, user } = data;
			if (user.id) {
				const roomUser = userJoin(socket.id, user, roomId);
				socket.join(roomUser.roomId);
				const roomUsers = getRoomUsers(roomUser.roomId);
				console.log("roomUsers", roomUsers);
				// socket.broadcast.to(roomUser.roomId).emit("message", {
				// 	message: `${roomUser.nick} 님이 입장하셨습니다.`,
				// });
				broadcastToRoomExceptMe("message", { message: `${roomUser.nick} 님이 입장하셨습니다.` }, roomUser.roomId);
				console.log(`${roomUser.nick} 님이 입장하셨습니다.`, roomUser);
				console.log("roomJoined:", roomUsers);
				// io.to(roomUser.roomId).emit("room-users-changed", { roomUsers: roomUsers });
				broadcastToRoomIncludeMe("room-users-changed", { roomUsers: roomUsers }, roomUser.roomId);
			}
		});

		const handleAfterRoomLeaved = (userLeaves) => {
			const roomUsers = getRoomUsers(userLeaves.roomId);
			broadcastToRoomExceptMe("message", { message: `${userLeaves.nick} 님이 떠났습니다.` }, userLeaves.roomId);
			console.log(`${userLeaves.nick} 님이 떠났습니다.`, userLeaves);
			console.log("roomLeaved:", roomUsers);
			broadcastToRoomIncludeMe("room-users-changed", { roomUsers: roomUsers }, userLeaves.roomId);
			broadcastToRoomExceptMe(
				"other-user-position",
				{
					scroll: -10,
					user: user,
					room: userLeaves.roomId,
					flag: 1,
				},
				userLeaves.roomId
			);
		};

		socket.on("room-leaved", (roomUser) => {
			if (!roomUser) {
				return;
			}
			const user = roomUser.user;
			const userLeaves = userLeaveById(user.id);
			if (userLeaves) {
				socket.leave(userLeaves.roomId);
				handleAfterRoomLeaved(userLeaves);
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");
			const userLeaves = userLeave(socket.id);
			if (userLeaves) {
				handleAfterRoomLeaved(userLeaves);
			}
		});

		socket.on("request-attention", (data) => {
			broadcastToRoomExceptMe("receive-attention", data);
		});

		socket.on("request-attention-scroll", (data) => {
			console.log("request-attention-scroll", data);
			broadcastToRoomExceptMe("receive-attention-scroll", data);
		});

		socket.on("request-attention-book", (data) => {
			console.log("request-attention-book", data);
			broadcastToRoomExceptMe("receive-attention-book", data);
		});

		//pointer
		socket.on("move-pointer", (data) => {
			const pointerData = {
				user: data.user,
				color: colors[data.user.id % colors.length], // 색상 추가
				bookId: data.bookId,
				pageNum: data.pageNum,
				x: data.x,
				y: data.y,
			};
			broadcastToRoomExceptMe("update-pointer", pointerData);
		});
		//canvas
		socket.on("draw-canvas", (data) => {
			// console.log("draw-canvas", data.user, data.location);
			broadcastToRoomExceptMe("share-canvas", data);
		});
		//highlight
		socket.on("insert-highlight", (data) => {
			console.log("insert-highlight", data);
			broadcastToRoomExceptMe("draw-highlight", data);
		});

		socket.on("delete-highlight", (data) => {
			console.log("delete-highlight", data);
			broadcastToRoomExceptMe("erase-highlight", data);
		});

		// video chat
		socket.on("rtc_start", (room) => {
			socket.to(room).emit("rtc_start", room);
		});

		socket.on("offer", ({ offer, room }) => {
			socket.to(room).emit("offer", { offer, room });
		});

		socket.on("answer", ({ answer, room }) => {
			socket.to(room).emit("answer", { answer, room });
		});

		socket.on("candidate", ({ candidate, room }) => {
			socket.to(room).emit("candidate", candidate);
		});

		// chart
		socket.on("send-chart", (data) => {
			// console.log("send-chart data", data);
			broadcastToRoomExceptMe("update-chart", data);
			// socket.broadcast.to(data.room).emit("update-chart", data);
		});

		socket.on("current-user-position", (data) => {
			console.log("current-user-position", data);
			broadcastToRoomExceptMe("other-user-position", data);
		});
	});
	return io;
};
