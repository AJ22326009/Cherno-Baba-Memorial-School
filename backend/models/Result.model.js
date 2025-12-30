const mongoose=require('mongoose');

const ResultSchema=new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    term:{
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    academicYear:{
        type: String,
        required: true
    },
    scores:[
        {
            subject:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject',
                required: true
            },
            score:{
                type: Number,
                required: true
            }
        }
    ],
    total:{
        type: Number,
        default: 0
    },
    position:{
        type: Number,
        default: 0
    }
}
,{timestamps:true});

module.exports=mongoose.model('Result',ResultSchema);