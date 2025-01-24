const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    citizenshipNum: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

// pre middleware function will be called when save operation is performend 
// next is a callback that says we performed all task before save so now u can save in db 
userSchema.pre('save', async function (next) {
    const person = this;  //all data stored in person

    //hash psw if it is modified or is new
    if (!person.isModified('password')) return next(); //If any thing other than psw is changed, then directly next no need to hash; false then will go to try-catch block
    try {
        //hash psw generate
        const salt = await bcrypt.genSalt(10);

        // hash psw
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //override plain psw with hashed one
        person.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        //use bcrypt to compare provided password with hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password)  //.compare is bcrypt's method to compare
    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;