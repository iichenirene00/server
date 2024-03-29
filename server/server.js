const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
mongoose.connect(
  "mongodb+srv://irenechen2010:fane9821@cluster0.qlt9kk4.mongodb.net/chart?retryWrites=true&w=majority&appName=Cluster0"
);
mongoose.connection.on("open", () => {
  console.log("database connect success");
});
const createSchema = new mongoose.Schema({
  email: String,
  user: String,
  password: String,
});

const createModel = mongoose.model("create", createSchema);
const app = express();

const secret = "dssffdfcdd";

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extends: false }));

const encryption = (req, res, next) => {
  let password = req.body.password;
  console.log(password);
  req.body.password = md5(password);
  next();
};

app.post("/api/v1/create", encryption, (req, res) => {
  console.log(req.body);
  createModel
    .create(req.body)
    .then((data) => {
      console.log("create success");
      res.send({
        code: 1,
        message: "create success",
        data: data,
      });
    })
    .catch((err) => {
      console.log("create fail");
      res.send({
        code: 0,
        message: "create fail",
        data: err,
      });
    });
});

app.post("/api/v1/sign", encryption, (req, res) => {
  console.log(req.body);
  createModel
    .findOne(req.body)
    .then((data) => {
      console.log(123, "sign success");
      console.log("data", data);
      if (data) {
        res.send({
          code: 1,
          message: "sign success",

          token: jwt.sign(
            { uid: data._id, exp: Math.ceil(Date.now() / 1000) + 7200 },
            secret
          ),
        });
      } else {
        res.send({
          code: 0,
          message: "sign fail",
        });
      }
    })
    .catch((err) => {
      console.log("sign fail");
      res.send({
        code: 0,
        message: "sign fail",
        data: err,
      });
    });
});

const chartSchema = new mongoose.Schema({
  fill: Boolean,
});
const chartSchema1 = new mongoose.Schema({
  fill: Object,
});
const chartModel = mongoose.model("row1chart1", chartSchema);
const chartModel1 = mongoose.model("row2chart1", chartSchema1);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});
app.get("/api/v1/row1", (req, res) => {
  chartModel
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.json(err));
});
app.get("/api/v1/row2", (req, res) => {
  chartModel1
    .find()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => res.json(err));
});
app.listen("8000", () => {
  console.log("server running on 8000");
});
