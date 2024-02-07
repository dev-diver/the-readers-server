let users = [];

// Join user to chat
const userJoin = (socketId, userId, userName, roomId) => {
	const existingUser = users.find((user) => user.userId === userId);

	if (!existingUser) {
		const user = { socketId, userId, userName, roomId };
		users.push(user);
		return user;
	} else {
		return existingUser;
	}
};

const userChange = (newUser) => {
	users = users.map((user) => {
		if (user.userId === newUser.userId) {
			return newUser; // userId가 일치하면 newUser로 변경
		}
		return user; // 그렇지 않으면 기존 사용자를 반환
	});
};

// User leaves chat
const userLeave = (socketId) => {
	const index = users.findIndex((user) => user.socketId === socketId);
	console.log("userLeave index:", index);
	if (index !== -1) {
		const result = users.splice(index, 1)[0];
		return result;
	}
};

//get users
const getRoomUsers = (roomId) => {
	const RoomUsers = [];
	users.map((user) => {
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
