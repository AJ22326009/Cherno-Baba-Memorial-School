const Student=require('../models/Student.model');

// Create a new student
const createStudent=async(req,res)=>{
    try {
        const {fullName,admissionNumber, classLevel}=req.body;
        const newStudent=new Student({fullName,admissionNumber,classLevel});
        await newStudent.save();
        res.status(201).json({message: "Student created successfully", student: newStudent});
    } catch (error) {
        res.status(500).json({message: "Error creating student", error: error.message});
    }
};

// Get all students (only admins can access)
const getAllStudents=async(req,res)=>{
    try {
        const students=await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({message: "Error fetching students", error: error.message});
    }
};

// Get a student by ID
const getStudentById=async(req,res)=>{
    try {
        const student=await Student.findById(req.params.id);
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: "Error fetching student", error: error.message});
    }
};

//get students from a particular class
const getStudentsByClassLevel=async(req,res)=>{
    try {
        const {classLevel}=req.params;
        const students=await Student.find({classLevel});
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({message: "Error fetching students by class level", error: error.message});
    }
}

// Update a student by ID (only admins can access)
const updateStudent=async(req,res)=>{
    try {
        const updates=req.body;
        const student=await Student.findByIdAndUpdate(req.params.id,updates,{new:true});

        if(!student){
            return res.status(404).json({message: "Student not found"});
        }
        res.status(200).json({message: "Student updated successfully", student});
    } catch (error) {
        res.status(500).json({message: "Error updating student", error: error.message});
    }
};

// Delete a student by ID (only admins can access)
const deleteStudent=async(req,res)=>{
    try {
        const id=req.params.id;
        const student=await Student.findByIdAndDelete(id);

        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        res.status(200).json({message: "Student deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting student", error: error.message});
    }
}

module.exports={
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClassLevel,
    updateStudent,
    deleteStudent
}