const Result=require('../models/Result.model');
const Student=require('../models/Student.model');

//create a result
const createResult=async(req,res)=>{
    try{
        const {studentName, term, scores}=req.body;

        const student=await Student.findOne({fullName: studentName});
        if(!student){
            return res.status(400).json({message: "Student not found"});
        }

        if(req.user.assignedClass !== student.classLevel){
            return res.status(403).json({ message: 'You can only create results for students from your assigned class' });
        }

        const existingResult=await Result.findOne({student:student._id, term});
        if(existingResult){
            return res.status(400).json({message: "This result already exists"});
        }

        const total=scores.reduce((acc, curr)=> acc + curr.score, 0);
        const newResult=new Result({
            student:student._id,
            term,
            scores,
            total
        });
        await newResult.save();
        res.status(201).json({message: "Result created successfully", result: newResult});
    }catch(error){
        res.status(500).json({message: "Error creating result", error: error.message});
    }
}

//generate class positions of particular term
const generateClassPositions=async(req,res)=>{
    try{
        const {classLevel, term}=req.body;
        const results= await Result.find({term}).populate({path: 'student', match: {classLevel}});
        const filteredResults=results.filter(result=> result.student !== null);

        filteredResults.sort((a, b) => b.total - a.total);

        for (let i = 0; i < filteredResults.length; i++) {
            const result = filteredResults[i];

            if (i > 0 && result.total === filteredResults[i - 1].total) {
                result.position = filteredResults[i - 1].position;
            } else {
                result.position = i + 1;
            }

            await result.save();
        }
        res.status(200).json({message: "Class positions generated successfully"});
    }catch(error){
        res.status(500).json({message: "Error generating class positions", error: error.message});
    }
};

//get results in a class
const getResultsByClass=async(req,res)=>{
    try{
        const classLevel=req.params.classLevel;

        if(req.user.role==='teacher' && req.user.assignedClass !== classLevel){
            return res.status(403).json({ message: 'forbidden access: You can only view results of your assigned class' });
        }

        const {term, studentName}=req.query;

        if(!term || !studentName){
            return res.status(400).json({message: "Please provide both term and studentName"});
        }

        let resultsArray=[];
        let filteredResultsArray=[];

        if(term !== 'all' && studentName !== 'all'){
           resultsArray=await Result.find({term}).populate({path: 'student', match: {fullName: studentName, classLevel}});
           filteredResultsArray=resultsArray.filter(result=> result.student !== null);
        }else if(term !== 'all' && studentName=== 'all'){
            resultsArray=await Result.find({term}).populate({path: 'student', match: {classLevel}});
            filteredResultsArray=resultsArray.filter(result=> result.student !== null);
        }else if(term === 'all' && studentName !== 'all'){
            resultsArray=await Result.find().populate({path: 'student', match: {fullName: studentName, classLevel}});
            filteredResultsArray=resultsArray.filter(result=> result.student !== null);
        }else if(term === 'all' && studentName === 'all'){
            resultsArray=await Result.find().populate({path: 'student', match: {classLevel}});
            filteredResultsArray=resultsArray.filter(result=> result.student !== null);
        }

        res.status(200).json(filteredResultsArray);
    }catch(error){
        res.status(500).json({message: "Error fetching results", error: error.message});
    }
}

//delete a result
const deleteResult=async(req,res)=>{
    try {
        const id=req.params.id;
        const result=await Result.findById(id);
        if(!result){
            return res.status(404).json({message: "Result not found"});
        }

        await result.populate('student');
        if(req.user.role==='teacher' && req.user.assignedClass !== result.student.classLevel){
            return res.status(403).json({ message: 'forbidden access: You can only delete results of your assigned class' });
        }

        await Result.findOneAndDelete(result)
        res.status(200).json({message: "Result deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting result", error: error.message});
    }
}

//edit a result
const editResult=async(req,res)=>{
    try {
        const id=req.params.id;
        const updatedData=req.body;
        const result=await Result.findById(id);
        if(!result){
            return res.status(404).json({message: "Result not found"});
        }

        await result.populate('student');
        if(req.user.role==='teacher' && req.user.assignedClass !== result.student.classLevel){
            return res.status(403).json({ message: 'forbidden access: You can only edit results of your assigned class' });
        }

        const updatedResult = await Result.findOneAndUpdate(result, updatedData, {new: true});
        updatedResult.total = updatedResult.scores.reduce((acc, curr) => acc + curr.score, 0);
        await updatedResult.save();
        res.status(200).json({message: "Result updated successfully"});
    } catch (error) {
        res.status(500).json({message: "Error updating result", error: error.message});
    }
}

//search for results by name, term (all terms included) and class level (all classes included)
// only admin can do this
const searchResults=async(req,res)=>{
    try {
        const name=req.params.name.trim();
        const {term, classLevel}=req.query;

        const results=await Result.find().populate('student');
        let filteredResults=results;

        filteredResults=filteredResults.filter(result=> result.student.fullName.toLowerCase().includes(name.toLowerCase()));

        if(!term){
            res.status(400).json({message: "Please provide term in query"});
            return;
        }
        if(term !== 'all'){
            filteredResults=filteredResults.filter(result=> result.term === term);
        }
        if(!classLevel){
            res.status(400).json({message: "Please provide classLevel in query"});
            return;
        }

        if(classLevel !== 'all'){
            filteredResults=filteredResults.filter(result=> result.student.classLevel === classLevel);
        }
        res.status(200).json(filteredResults);
    } catch (error) {
        res.status(500).json({message: "Error searching results", error: error.message});
    }
}


module.exports={createResult, generateClassPositions, getResultsByClass, deleteResult, editResult, searchResults};