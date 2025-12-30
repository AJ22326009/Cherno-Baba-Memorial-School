const Result=require('../models/Result.model');
const Subject=require('../models/Subject.model');
const Student=require('../models/Student.model');

//create a result
const createResult=async(req,res)=>{
    try{
        const {studentName, term, academicYear, scores}=req.body;

        const student=await Student.findOne({fullName: studentName});
        if(!student){
            return res.status(400).json({message: "Student not found"});
        }
        const existingResult=await Result.findOne({student:student._id, term, academicYear});
        if(existingResult){
            return res.status(400).json({message: "Result for this student, term and academic year already exists"});
        }

        for(const score of scores){
            const subject=await Subject.findOne({name: score.subject});
            console.log(subject);
            if(!subject){
                return res.status(400).json({message: `Subject with ID ${score.subject} not found`});
            }
            score.subject=subject._id;
        }

        const total=scores.reduce((acc, curr)=> acc + curr.score, 0);
        const newResult=new Result({
            student:student._id,
            term,
            academicYear,
            scores,
            total
        });
        await newResult.save();
        res.status(201).json({message: "Result created successfully", result: newResult});
    }catch(error){
        res.status(500).json({message: "Error creating result", error: error.message});
    }
}

//generate class positions of particular term and academic year
const generateClassPositions=async(req,res)=>{
    try{
        const {classLevel, term, academicYear}=req.body;
        const results= await Result.find({term, academicYear}).populate({path: 'student', match: {classLevel}});
        const filteredResults=results.filter(result=> result.student !== null);

        filteredResults.sort((a,b)=> b.total - a.total);

        let position=1;
        for(const result of filteredResults){
            result.position=position;
            await result.save();
            position++;
        }
        res.status(200).json({message: "Class positions generated successfully"});
    }catch(error){
        res.status(500).json({message: "Error generating class positions", error: error.message});
    }
};

//get all the results of a particular student
const getResultsByStudent=async(req,res)=>{
    try {
        const studentId=req.params.studentId;
        const results=await Result.find({student:studentId});
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({message: "Error fetching results", error: error.message});
    }
}

//get all the results of a particular class, term and academic year
const getResultsByClassTermYear=async(req,res)=>{
    try {
        const {classLevel, term, academicYear}=req.body;
        const results=await Result.find({term, academicYear}).populate({path: 'student', match: {classLevel}});
        const filteredResults=results.filter(result=> result.student !== null);
        res.status(200).json(filteredResults);
    } catch (error) {
        res.status(500).json({message: "Error fetching results", error: error.message});
    }
}

//get all results [only admin]
const getAllResults=async(req,res)=>{
    try {
        const results=await Result.find().populate('student');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({message: "Error fetching results", error: error.message});
    }
}


module.exports={createResult, generateClassPositions, getResultsByStudent, getResultsByClassTermYear, getAllResults};