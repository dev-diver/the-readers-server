/*********************/
/* mongoDB */

const mongoose = require('mongoose');
const os = require('os');

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

const htmlContentSchema = new Schema({
  html: String
});

const Highlight = mongoose.model('Highlights', highlightSchema);
const HtmlContent = mongoose.model('HtmlContent', htmlContentSchema);

exports.module = { Highlight, HtmlContent };