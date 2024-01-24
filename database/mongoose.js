/*********************/
/* mongoDB */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* modeling */
const Schema = mongoose.Schema;

const highlightInfoSchema = new Schema({
  text: String,
  startContainer: Schema.Types.Mixed,
  startOffset: Number,
  endContainer: Schema.Types.Mixed,
  endOffset: Number
});

const highlightSchema = new Schema({
  highlightInfos: [highlightInfoSchema] 
});

const Highlight = mongoose.model('Highlights', highlightSchema);

module.exports = { Highlight };