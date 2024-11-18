const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

// instance method:
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "inactive" });
  },
};

// static method:
todoSchema.statics = {
  findByJs: function () {
    return this.find({ title: /js/i, status: "active" });
  },
};
// query helper:
todoSchema.query = {
  byLanguage: function (lang) {
    return this.find({ title: new RegExp(lang, "i") });
  },
};

module.exports = todoSchema;
