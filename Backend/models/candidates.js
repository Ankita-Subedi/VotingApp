const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

//Define person schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number, 
        required: true
    },
     votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId, //unique id geneareted when by mongodb itself while creating new record
                ref: 'User',
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now()
            }
        }
     ],
     voteCount: {
        type: Number,
        default: 0   //since initailly created account will not have voted anyone yet
     }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;