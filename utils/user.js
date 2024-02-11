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
	const index = roomUsers.findIndex((user) => user.userId === newUser.userId);
	if (index !== -1) {
		// 일치하는 userId가 있는 경우
		roomUsers[index] = newUser; // 해당 인덱스의 사용자를 newUser로 업데이트
	}
};

// User leaves chat
const userLeave = (socketId) => {
	const index = roomUsers.findIndex((user) => user.socketId === socketId);
	console.log("userLeave index:", socketId, index);
	if (index !== -1) {
		const result = roomUsers.splice(index, 1)[0];
		return result;
	}
};

const userLeaveById = (userId) => {
	const index = roomUsers.findIndex((user) => user.id === userId);
	console.log("userLeave ID index:", userId, index);
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
	userLeaveById,
	getRoomUsers,
};
