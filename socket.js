const { Server } = require("socket.io");
const { userJoin, getRoomUsers, userLeave } = require("./utils/user");

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
		socket.on("room-joined", (userdata) => {
			if (userdata.userId) {
				const { userId, userName, roomId } = userdata;
				userRoom = roomId;
				const roomUser = userJoin(socket.id, userId, userName, roomId);
				const roomUsers = getRoomUsers(roomUser.roomId);
				socket.join(roomUser.roomId);

				socket.broadcast.to(roomUser.roomId).emit("message", {
					message: `${roomUser.userName} 님이 입장하셨습니다.`,
				});
				console.log(`${roomUser.userName} 님이 입장하셨습니다.`, roomUser);
				console.log("roomJoined:", roomUsers);
				io.to(roomUser.roomId).emit("room-users-changed", roomUsers);
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");

			const userLeaves = userLeave(socket.id);

			if (userLeaves) {
				const roomUsers = getRoomUsers(userLeaves.roomId);
				io.to(userLeaves.roomId).emit("message", {
					message: `${userLeaves.userName} 님이 떠났습니다.`,
				});
				console.log(`${userLeaves.userName} 님이 떠났습니다.`, userLeaves);
				console.log("roomLeaved:", roomUsers);
				io.to(userLeaves.roomId).emit("room-users-changed", roomUsers);
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
			// 커서 위치와 클라이언트 ID 매핑
			const pointerData = {
				id: user.id,
				color: colors[user.id % colors.length], // 색상 추가
				book: data.book,
				page: data.page,
				x: data.x,
				y: data.y,
			};
			io.emit("update-pointer", pointerData);
		});

		//canvas

		socket.on("drawing", (data) => {
			socket.broadcast.to(data.location.roomId).emit("canvasImage", data);
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
	});
	return io;
};
