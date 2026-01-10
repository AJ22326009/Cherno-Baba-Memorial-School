const mongoose=require('mongoose');

const ResultSchema=new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    term:{
        type: String,
        enum: ['Term 1', 'Term 2', 'Term 3'],
        required: true
    },
    scores:[
        {
            subject:{
                type: String,
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

ResultSchema.index({ student: 1, term: 1}, { unique: true });

module.exports=mongoose.model('Result',ResultSchema);