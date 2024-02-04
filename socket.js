const { Server } = require("socket.io");
const { userJoin, userChange, getUsers, userLeave } = require("./utils/user");

module.exports = (server) => {
	const io = new Server(server, {
		cors: {
			origin: ["http://localhost:3001", "http://localhost:3000"], // 필요한 경우 CORS 설정
			credentials: true,
		},
		path: "/socket", // 클라이언트와 동일한 경로를 설정
	});

	let clientCounter = 0;
	const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]; // 색상 배열

	io.on("connection", (socket) => {
		console.log("---------------<   1   >----------------");
		const clientId = clientCounter % colors.length; // 클라이언트 ID를 색상 배열의 길이로 나눔
		clientCounter++; // 다음 클라이언트를 위해 카운터 증가

		console.log("A user connected: " + socket.id + " with color: " + colors[clientId]);

		socket.on("disconnect", () => {
			console.log("Us er disconnected");
			clientCounter--; // 추가 확인 (진태)

			const userLeaves = userLeave(socket.id);
			const roomUsers = getUsers(userRoom);
			console.log("roomUsers:", roomUsers);

			if (userLeaves) {
				io.to(userLeaves.roomId).emit("message", {
					message: `${userLeaves.username} left the chat`,
				});
				io.to(userLeaves.roomId).emit("users", roomUsers);
			}
		});

		// 진태 추가 코드
		// requestAttention 이벤트를 수신하면
		// receiveAttention 이벤트를 모든 클라이언트에게 전송
		socket.on("requestAttention", (data) => {
			// 모든 클라이언트에게 현재 유저의 스크롤 위치를 전송
			socket.broadcast.emit("receiveAttention", { scrollTop: data.scrollTop });
		});

		//pointer
		socket.on("movepointer", (data) => {
			// 커서 위치와 클라이언트 ID 매핑
			const pointerData = {
				id: socket.id,
				color: colors[clientId], // 색상 추가

				page: data.page,
				x: data.x,
				y: data.y,
			};
			io.emit("updatepointer", pointerData);
		});

		//pdf viewer
		socket.on("attention", (data) => {
			console.log(data);
			io.emit("attention", data);
		});

		socket.on("attention", (data) => {
			socket.broadcast.emit(data);
		});

		// drawing canvas
		let imageUrl, userRoom;
		socket.on("room-joined", (userdata) => {
			if (userdata.userName) {
				const { roomId, bookId, memberId, userId, userName, host, presenter } = userdata;
				userRoom = roomId;
				const user = userJoin(socket.id, roomId, bookId, memberId, userId, userName, host, presenter);
				const roomUsers = getUsers(user.roomId);
				socket.join(user.roomId);
				socket.broadcast.to(user.roomId).emit("message", {
					message: "Welcome to ChatRoom",
				});
				socket.broadcast.to(user.roomId).emit("message", {
					message: `${user.userName} has joined`,
				});

				io.to(user.roomId).emit("users", roomUsers);
				io.to(user.roomId).emit("canvasImage", imageUrl);
			}
		});

		// socket.on("user-changed", (userdata) => {
		// 	if (userdata.userName) {
		// 		userChange(userdata);
		// 		const roomUsers = getUsers(userdata.roomId);
		// 		io.to(userdata.roomId).emit("users", roomUsers);
		// 	}
		// });

		socket.on("drawing", (data) => {
			socket.broadcast.to(userRoom).emit("canvasImage", data);
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
