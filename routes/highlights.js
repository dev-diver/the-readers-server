/*********************/
/* express */
var express = require('express');
var router = express.Router();

import { Highlight, HtmlContent } from '../database/mongoose.js';

router.get('/', (req, res) => {
  Highlight.find().then(highlights => res.json(highlights));
});

router.post('/', (req, res) => {
  const newHighlight = new Highlight(req.body);
  newHighlight.save().then(() => res.send('Highlight saved'));
  // console.log("/api/save-highlight post test",savedData);
});

// 예시: 'Highlight' 모델의 모든 문서를 삭제하는 API
router.delete('/', async (req, res) => {
  try {
    await Highlight.deleteMany({}); // 모든 하이라이트 삭제
    res.status(200).send('All highlights deleted');
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const highlightId = req.params.id; // URL에서 하이라이트 ID 가져오기
    const highlight = await Highlight.findById(highlightId); // Highlight는 모델
    if (highlight) {
      res.json(highlight); // 하이라이트를 찾았다면 JSON으로 반환
    } else {
      res.status(404).send('Highlight not found');
    }
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // console.log(req.params.id);
    await Highlight.deleteOne({ _id: req.params.id });
    res.status(200).send('Highlight deleted');
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
});

/* text */
router.post('/api/save-text', async (req, res) => {
  try {
    const { html } = req.body;
    // DB에 html 저장 로직
    const newHtmlContent = new HtmlContent({ html });
    await newHtmlContent.save();
    res.status(200).send('내용 저장 성공');
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
});

router.get('/api/get-text', async (req, res) => {
  try {
    // DB에서 html 데이터 가져오기
    const htmlContent = await HtmlContent.findOne({}).sort({ _id: -1 }); // 가장 최근에 저장된 내용 가져오기
    res.json({ html: htmlContent });
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
});


