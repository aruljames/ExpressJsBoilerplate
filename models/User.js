const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


var UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type:Number },
    email: { type: String },
    password: { type: String, required: true },
    role : { type: Schema.Types.ObjectId, ref: 'Role' },
    created_at : { type: Date },
    updated_at: { type: Date },
});

UserSchema.pre('save', function(next) {
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    if(this.password){
        var hashPassword = bcrypt.hashSync(this.password, 10);
        this.password = hashPassword;
    }
    
    next();
});

UserSchema.methods.comparePassword=function(candidatePassword,next){
    bcrypt.compareSync(candidatePassword,this.password,function(err,isMatch){
        if(err) return next(err);
        next(null,isMatch)
    })
}

module.exports = mongoose.model("User", UserSchema);