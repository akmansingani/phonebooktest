const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: 35
    },
    phone: {
      type: Number,
      trim: true,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contacts", contactSchema);
