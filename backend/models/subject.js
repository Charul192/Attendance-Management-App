const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },  // optional subject code
  semester: { type: Number },            // optional semester info
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;