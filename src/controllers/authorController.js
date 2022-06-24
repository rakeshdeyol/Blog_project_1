const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
function isNum(val){
  return !isNaN(val)
}


// Creating author request handler =


const createAuthor = async function (req, res) {
  try {  
    let authorData = req.body;
    if (Object.keys(authorData).length == 0) {
      return res.status(400).send({ status: false, msg: "data can't be empty" });
    }
    if (!authorData.fname)
      return res.status(400).send({ status: false, msg: "Please include the first name" });
    if (typeof (authorData.fname) != "string"){ res.status(400).send({ status: false, msg: "fname must be a string" });}
    
    if ((authorData.fname).trim().length === 0){{ res.status(400).send({ status: false, msg: "fname can't be empty" });}}
    if (isNum(authorData.fname) === true) { res.status(400).send({ status: false, msg: "fname cannot be a number" });}
    if ((authorData.fname).includes(" ")){{ res.status(400).send({ status: false, msg: "Please remove any empty spaces in fname" });}}
   
    if (!authorData.lname)
      res.status(400).send({ status: false, msg: "Please include the last name" });
    if (typeof (authorData.lname) != "string"){ res.status(400).send({ status: false, msg: "lname must be a string" });}  
    if ((authorData.lname).trim().length === 0){ res.status(400).send({ status: false, msg: "Please remove any empty spaces in lname" });}
    if (isNum(authorData.lname) === true) { res.status(400).send({ status: false, msg: "lname cannot be a number" });}
    if ((authorData.lname).includes(" ")){{ res.status(400).send({ status: false, msg: "Please remove any empty spaces in lname" });}}

    if (!authorData.title)
    res.status(400).send({ status: false, msg: "Please include a title" });
    if(typeof (authorData.title) != "string"){ res.status(400).send({ status: false, msg: "Title is not string" });}
    if ((authorData.title).trim().length === 0){{ res.status(400).send({ status: false, msg: "Please remove any empty spaces around title" });}} 
    if ((authorData.title).includes(" ")){{ res.status(400).send({ status: false, msg: "Please remove any empty spaces in title" });}}
  
   
  if (!authorData.email)
      res.status(400).send({ status: false, msg: "Please include an email" });
  if(typeof(authorData.email) != "string"){return res.status(400).send({ status: false, msg: "Email is not string" });}
  if ((authorData.email).trim().length === 0) {res.status(400).send({ status: false, msg: "Please remove any empty spaces around email" });} 
  if ((authorData.email).includes(" ")){{ res.status(400).send({ status: false, msg: "Please remove any empty spaces in email" });}}
  
    
  if (!authorData.password)
      res.status(400).send({ status: false, msg: "Please include a password" });
  if(typeof (authorData.password) != "string"){return res.status(400).send({ status: false, msg: "password is not string" });}
  if ((authorData.password).trim().length === 0){{return res.status(400).send({ status: false, msg: "Please remove any empty spaces around password" });}}
  if ((authorData.password).includes(" ")){{ res.status(400).send({ status: false, msg: "Please remove any empty spaces in password" });}}
  
 
   
  let savedData = await authorModel.create(authorData);
    res.status(201).send({status: true,msg: "Data is successfully created", data: savedData,});
    } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

//login Author request handler =

const loginAuthor = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({ status: false, msg: "login info can't be empty" });
    }
    let userName = req.body.email;
    let password = req.body.password;
    if (!userName){res.status(400).send({ status: false, msg: "Please include a email" });}
    if(!password){res.status(400).send({ status: false, msg: "Please include a password." });}

    let author = await authorModel.findOne({
      email: userName,
      password: password
    });
    if (!author)return res.status(400).send({status: false,msg: "username or the password is not correct"});

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organization: "FunctionUp",
      },
      "functionup-radon"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;
