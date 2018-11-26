const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
//Define model
const userSchema = new Schema({
    id: Number,
    email: { type: String, unique: true, lowercase: true },
    password: String
});
//On save Hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this;
    //Genrate a salt
    bcrypt.genSalt(10, function(error, salt){
        if(error) { return next(error); }
        //hash (encrypt) a password using a salt
        bcrypt.hash(user.password, salt, null, function(error, hash){
            if(error) { return next(error); }
            //override plain text password with exncrypted one
            user.password = hash;
            //go ahead and save a model
            next();
        });
    })
});
//Create model class
const ModelClass = mongoose.model('user', userSchema);
//Export model
module.exports = ModelClass;