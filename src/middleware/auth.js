const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
//const blogModel = require("../models/blogModel");
//const authorModel = require("../models/authorModel");

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-Api-key"];
    if (!token)
      return res.send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "functionup-radon");
    if (!decodedToken)
      return res.send({ status: false, msg: "token is not valid" });
    next();
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const authorize = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      token = req.headers["x-Api-key"];
    }

    let blogToBeModified;
    if (Object.keys(req.params).length) {
      //blogToBeModified = req.params;
      blogToBeModified = req.params.blogId;
    }
    if (Object.keys(req.query).length != 0) {
      blogToBeModified = req.query;
      //blogToBeModified = req.query
    }

    //'if (!mongoose.isValidObjectId(blogToBeModified)) return res.status(400).send({ msg: "Invalid Id" })
    let decodedToken = jwt.verify(token, "functionup-radon");
    let authorLoggedIn = decodedToken.authorId;
    let authId = await blogModel.find({blogToBeModified}).select("authorId");
    
    if (authId.length == 0)
    return res.send({ status: false, msg: "Please use correct blog Id" }); 
    let auth;
    for (let i = 0; i < authId.length; i++) {
      
      auth = authId[i].authorId;
    }

    if (auth != authorLoggedIn)
      return res.send({
        status: false,
        msg: "Author logged is not allowed to modify the requested  data"});
  next();
      
    
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorize = authorize;
