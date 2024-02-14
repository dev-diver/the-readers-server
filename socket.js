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
		socket.on("room-joined", (data) => {
			const { roomId, user } = data;
			if (user.id) {
				const roomUser = userJoin(socket.id, user, roomId);
				socket.join(roomUser.roomId);
				const roomUsers = getRoomUsers(roomUser.roomId);
				console.log("roomUsers", roomUsers);
				socket.broadcast.to(roomUser.roomId).emit("message", {
					message: `${roomUser.nick} 님이 입장하셨습니다.`,
				});
				console.log(`${roomUser.nick} 님이 입장하셨습니다.`, roomUser);
				console.log("roomJoined:", roomUsers);
				io.to(roomUser.roomId).emit("room-users-changed", { roomUsers: roomUsers });
			}
		});

		socket.on("room-leaved", (roomUser) => {
			if (!roomUser) {
				return;
			}
			const user = roomUser.user;
			const userLeaves = userLeaveById(user.id);
			if (userLeaves) {
				const roomUsers = getRoomUsers(userLeaves.roomId);
				socket.leave(userLeaves.roomId);
				io.to(userLeaves.roomId).emit("message", {
					message: `${userLeaves.nick} 님이 떠났습니다.`,
				});
				console.log(`${userLeaves.nick} 님이 떠났습니다.`, userLeaves);
				console.log("남은 사람:", roomUsers);
				io.to(userLeaves.roomId).emit("room-users-changed", { roomUsers: getRoomUsers });
				io.to(userLeaves.roomId).emit("other-user-position", {
					scroll: -10,
					user: user,
					room: userLeaves.roomId,
					flag: 1,
				});
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");
			const userLeaves = userLeave(socket.id);
			if (userLeaves) {
				const roomUsers = getRoomUsers(userLeaves.roomId);
				io.to(userLeaves.roomId).emit("message", {
					message: `${userLeaves.nick} 님이 떠났습니다.`,
				});
				console.log(`${userLeaves.nick} 님이 떠났습니다.`, userLeaves);
				console.log("roomLeaved:", roomUsers);
				io.to(userLeaves.roomId).emit("room-users-changed", { roomUsers: roomUsers });
			}
		});

		socket.on("request-attention", (data) => {
			socket.broadcast.emit("receive-attention", data);
		});

		socket.on("request-attention-scroll", (data) => {
			console.log("request-attention-scroll", data);
			socket.broadcast.emit("receive-attention-scroll", data);
		});

		socket.on("request-attention-book", (data) => {
			console.log("request-attention-book", data);
			socket.broadcast.emit("receive-attention-book", data);
		});

		//pointer
		socket.on("move-pointer", (data) => {
			let color = colors[data.user.id % colors.length];
			// console.log("color", color);
			// 커서 위치와 클라이언트 ID 매핑
			const pointerData = {
				user: data.user,
				color: colors[data.user.id % colors.length], // 색상 추가
				bookId: data.bookId,
				pageNum: data.pageNum,
				x: data.x,
				y: data.y,
			};
			// console.log("data", pointerData);
			io.emit("update-pointer", pointerData);
		});

		//canvas

		socket.on("draw-canvas", (data) => {
			if (data) {
				io.to(data.location.roomId).emit("share-canvas", data);
			}
		});

		//highlight

		socket.on("insert-highlight", (data) => {
			console.log("insert-highlight", data);
			socket.broadcast.to(data.roomId).emit("draw-highlight", data);
		});

		socket.on("delete-highlight", (data) => {
			console.log("delete-highlight", data);
			socket.broadcast.to(data.roomId).emit("erase-highlight", data);
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
			socket.broadcast.to(data.room).emit("update-chart", data);
		});

		socket.on("current-user-position", (data) => {
			console.log("current-user-position", data);
			io.to(data.room).emit("other-user-position", data);
		});
	});
	return io;
};
