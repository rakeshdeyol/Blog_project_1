const authorModel = require("../models/authorModel")


const createAuthor = async function(req , res){
    try{
    let authorData = req.body;
    if(!authorData.fname) res.status(400).send({status: false, msg: "Please include the first name"})
    if(!authorData.lname) res.status(400).send({status: false, msg: "Please include the last name"})
    if(!authorData.email) res.status(400).send({status: false, msg: "Please include an email"})
    if(!authorData.password) res.status(400).send({status: false, msg: "Please include a password"})
    let savedData = await authorModel.create(data);
    res.status(201).send({msg : "Data is successfully created", data: savedData}) 

    
    }catch (err) {
        console.log('This is the error :', err.message);
        res.status(500).send({ msg: 'Error', error: err.message });
}
}

module.exports.createAuthor = createAuthor