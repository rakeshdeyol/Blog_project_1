const authorModel = require("../models/authorModel")


const createAuthor = async function(req , res){
    try{
    let authorData = req.body;
    if(!authorData.fname) res.status(400).send({status: false, msg: "Please include the first name"})
    if(!authorData.lname) res.status(400).send({status: false, msg: "Please include the last name"})
    if(!authorData.email) res.status(400).send({status: false, msg: "Please include an email"})
    if(!authorData.password) res.status(400).send({status: false, msg: "Please include a password"})
    //let 
    let savedData = await authorModel.create(authorData);
    res.status(201).send({status: true, msg : "Data is successfully created", data: savedData}) 

    
    }catch (err) {
        console.log('This is the error :', err.message);
        res.status(500).send({status: false, msg: 'Error', error: err.message });
}
}

module.exports.createAuthor = createAuthor