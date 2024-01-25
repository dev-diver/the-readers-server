var express = require("express");
var router = express.Router();

router.get("/search", function (req, res) {
  const bookname = req.query.bookname;

  const books = [
    { name: "알고리즘", id: "facebook" },
    { name: "알고리즘 짱", id: "example" },
    { name: "Clean Code", id: "facebook" },
    { name: "운영체제", id: "google" },
    { name: "C기초", id: "facbook" },
  ];

  const filteredBooks = books.filter((book) => book.name.includes(bookname));

  res.json({ message: "검색 성공", data: filteredBooks });
});

module.exports = router;
