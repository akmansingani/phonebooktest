const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        trim:true,
        required:true,
        maxlength:35
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 35
    },
    en_password :{
        type: String,
        required: true
    },
    saltKey: String,
    
}, { timestamps : true});

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.saltKey = uuidv1();
        this.en_password = this.encryptPassword(password);

        //console.log("set password",this._password, this.saltKey, this.en_password);
        
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {

    authenticateUser:function (password) {
        var verifyPassword = this.encryptPassword(password);
        return verifyPassword === this.en_password;
    },
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.saltKey)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
    
};    

module.exports = mongoose.model('Users',userSchema);

