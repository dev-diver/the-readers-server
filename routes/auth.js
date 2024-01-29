const express = require("express");
const router = express.Router();

// Load User model
const User = require("../models/user");

//  /signup 으로 넘어오는 id, 비밀번호를 sequelize를 이용해 DB에 저장
router.post("/signup", (req, res) => {
	console.log("req.body",req.body);
  User.create({
	nick: req.body.nick,
	email: req.body.email,
	password: req.body.password,
  })
	.then((user) => res.status(201).json(user))
	.catch((err) => {
	  console.log(err);
	  res.status(500).json(err);
	});
});

function createToken() {	
	var token = "";	
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 16; i++)	
		token += possible.charAt(Math.floor(Math.random() * possible.length));
	return token;
}
// /login 으로 넘어오는 id, 비밀번호를 sequelize를 이용해 DB에 저장
router.post("/login", async (req, res) => {
    try {
		console.log("req.body.email",req.body.email)
		console.log("req.body.password",req.body.password);
        const user = await User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password,
            },
        });
        console.log("________user", user);

        if (!user) {
            return res.status(404).json({ success: false });
        } else {
            var token = createToken();
            console.log("token", token);
            user.token = token;
            await user.save();

            res.cookie("=======user", token);
            res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    nick: user.nick,
                    password: user.password,
                    token: user.token,
                },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
