const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'teacher'],
    },
    assignedClass:{
        type: String,
        enum: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        required: function() {
            return this.role === 'teacher';
        }
    }
},{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);