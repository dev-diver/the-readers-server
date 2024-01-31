const { Server } = require("socket.io");
const { userJoin, getUsers, userLeave } = require("./utils/user");

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
		const clientId = clientCounter % colors.length; // 클라이언트 ID를 색상 배열의 길이로 나눔
		clientCounter++; // 다음 클라이언트를 위해 카운터 증가

		console.log("A user connected: " + socket.id + " with color: " + colors[clientId]);

		socket.on("disconnect", () => {
			console.log("User disconnected");
			clientCounter--; // 추가 확인 (진태)
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
		socket.on("user-joined", (data) => {
			console.log("current user data: ", data);
			const { roomId, userId, userName, host, presenter } = data;
			userRoom = roomId;
			const user = userJoin(socket.id, userName, roomId, host, presenter);
			const roomUsers = getUsers(user.room);
			console.log("user.room??", user.room);
			socket.join(user.room);
			socket.emit("message", {
				message: "Welcome to ChatRoom",
			});
			socket.broadcast.to(user.room).emit("message", {
				message: `${user.username} has joined`,
			});

			io.to(user.room).emit("users", roomUsers);
			io.to(user.room).emit("canvasImage", imageUrl);
		});

		socket.on("drawing", (data) => {
			imageUrl = data;
			console.log("userRoom***:", userRoom);

			socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
		});
	});
	return io;
};
