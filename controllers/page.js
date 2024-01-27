const { User} = require('../models');

exports.renderProfile = (req, res) => {
  res.render('profile', { title: '내 정보' });
};

exports.renderSignup = (req, res) => {
  res.render('signup', { title: '회원가입' });
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "The-readers",
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'The-readers',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  };
};
