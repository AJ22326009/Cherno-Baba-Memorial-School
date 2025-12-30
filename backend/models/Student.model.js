const mongoose=require('mongoose');

const StudentSchema=new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    admissionNumber:{
        type: String,
        required: true,
        unique: true
    },
    classLevel:{
        type: String,
        enum: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        required: true
    },
    status:{
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
        required: true
    }
},{timestamps:true});

module.exports=mongoose.model('Student',StudentSchema);