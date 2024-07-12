const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: String,
  content: String,
  timeStart: Date,
  timeFinish: Date,
  createBy: String,
  listUsers: Array,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date,
}, {
  timestamps: true,
});

const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = Task;