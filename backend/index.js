const express = require("express");
const users = require("./MOCK_DATA (1).json");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/attendance-management")
  .then((e) => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('')

app.listen(PORT, () => console.log(`Server started at PORT {PORT}`));