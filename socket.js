const { Server } = require("socket.io");
const { userJoin, userChange, getRoomUsers, userLeave } = require("./utils/user");

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

		socket.on("requestAttention", (data) => {
			socket.broadcast.emit("receiveAttention", data);
		});

		//pointer
		socket.on("movepointer", (data) => {
			// 커서 위치와 클라이언트 ID 매핑
			const pointerData = {
				id: user.id,
				color: colors[user.id % colors.length], // 색상 추가
				book: data.book,
				page: data.page,
				x: data.x,
				y: data.y,
			};
			io.emit("updatepointer", pointerData);
		});

		socket.on("drawing", (data) => {
			socket.broadcast.to(data.location.roomId).emit("canvasImage", data);
		});
		// video chat
		socket.on("join_room", (roomName) => {
			console.log("---------------<   join_room   >----------------");
			socket.join(roomName);
			socket.to(roomName).emit("welcome");
		});
		socket.on("offer", (offer, roomName) => {
			console.log("---------------<   offer   >----------------");
			socket.to(roomName).emit("offer", offer);
		});
		socket.on("answer", (answer, roomName) => {
			console.log("---------------<   answer   >----------------");
			socket.to(roomName).emit("answer", answer);
		});
		socket.on("ice", (ice, roomName) => {
			console.log("---------------<   ice   >----------------");
			socket.to(roomName).emit("ice", ice);
		}); // 인터넷 연결 생성, 브라우저가 서로 소통할 수 있게 만들어줌.
	});
	return io;
};
