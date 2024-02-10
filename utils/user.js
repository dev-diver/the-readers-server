let roomUsers = [];

// Join user to chat
const userJoin = (socketId, user, roomId) => {
	const existingUser = roomUsers.find((roomUser) => roomUser.id === user.id);

	if (!existingUser) {
		const roomUser = {
			...user,
			socketId,
			roomId,
		};
		roomUsers.push(roomUser);
		return roomUser;
	} else {
		return existingUser;
	}
};

const userChange = (newUser) => {
	roomUsers = roomUsers.map((user) => {
		if (user.userId === newUser.userId) {
			return newUser; // userId가 일치하면 newUser로 변경
		}
		return user; // 그렇지 않으면 기존 사용자를 반환
	});
};

// User leaves chat
const userLeave = (socketId) => {
	const index = roomUsers.findIndex((user) => user.socketId === socketId);
	console.log("userLeave index:", index);
	if (index !== -1) {
		const result = roomUsers.splice(index, 1)[0];
		return result;
	}
};

//get users
const getRoomUsers = (roomId) => {
	const RoomUsers = [];
	roomUsers.map((user) => {
		if (user.roomId == roomId) {
			RoomUsers.push(user);
		}
	});

	return RoomUsers;
};

module.exports = {
	userJoin,
	userChange,
	userLeave,
	getRoomUsers,
};
