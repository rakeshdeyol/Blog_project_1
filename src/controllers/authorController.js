const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    let authorData = req.body;
    if (Object.keys(blog).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "data can't be empty" });
    }
    if (!authorData.fname)
      res
        .status(400)
        .send({ status: false, msg: "Please include the first name" });
    if (!authorData.lname)
      res
        .status(400)
        .send({ status: false, msg: "Please include the last name" });
    if (!authorData.email)
      res.status(400).send({ status: false, msg: "Please include an email" });
    if (!authorData.password)
      res.status(400).send({ status: false, msg: "Please include a password" });
    //let
    let savedData = await authorModel.create(authorData);
    res
      .status(201)
      .send({
        status: true,
        msg: "Data is successfully created",
        data: savedData,
      });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

/* const login  = async function (abcd, xyz) {
    try{
    let data = abcd.body;
    let savedData = await userModel.create(data);
    console.log(abcd.newAttribute);
    xyz.send({ msg: savedData });
  }; */

const loginAuthor = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "login info can't be empty" });
    }
    let userName = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({
      email: userName,
      password: password,
    });
    if (!author)
      return res
        .status(400)
        .send({
          status: false,
          msg: "username or the password is not correct",
        });
    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organization: "FunctionUp",
      },
      "functionup-radon"
    );
    res.setHeader("x-auth-token", token);
    res.status(201).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;
