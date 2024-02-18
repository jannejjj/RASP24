var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
var cors = require("cors");
const { insertSampleData, deleteAllDocuments } = require("./bin/defaultdata");

const mongoDB = process.env.MONGODB_CONN_STRING;
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
// insertSampleData(); // Commented this since the member data persists in the cloud DB, uncomment for local use if needed

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var apiRouter = require("./routes/api");
var app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

module.exports = app;
