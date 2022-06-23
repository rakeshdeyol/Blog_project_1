const mongoose = require ('mongoose');

const authorSchema = new mongoose.Schema({
                    fname: {
                            type: String,
                            required: true
                    },
                    lname: {
                            type: String,
                            required: true
                    },
                    title: {
                        type: String,
                        enum: ["Mr", "Mrs", "Miss"]
                    },
                    email: { 
                        type: String,
                        required: true,
                        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,"Fill a valid email address"],
                        unique: true
                      },
                    
                    
                    password:{
                            require: true,
                            type: String
                    }

}, { timestamps: true });

/* var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
 */


module.exports = mongoose.model('Author', authorSchema) //authors