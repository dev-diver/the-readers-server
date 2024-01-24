/*********************/
/* express */
var express = require('express');
var router = express.Router();

const { Highlight } = require('../database/mongoose.js');

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

module.exports = router;