const Subject = require('../models/Subject.model');

//Only admins can do CRUD operations on subjects

//create a new subject
const createSubject = async(req,res)=>{
    try {
        const {name} = req.body;
        const newSubject = new Subject({name});
        await newSubject.save();
        res.status(201).json({message: "Subject created successfully", subject: newSubject});
    } catch (error) {
        res.status(500).json({message: "Error creating subject", error: error.message});
    }
}

//get all subjects
const getAllSubjects = async(req,res)=>{
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({message: "Error fetching subjects", error: error.message});
    }
}

//update a subject by ID
const updateSubject = async(req,res)=>{
    try{
        const updates = req.body;
        const subject = await Subject.findByIdAndUpdate(req.params.id, updates, {new: true});
        if(!subject){
            return res.status(404).json({message: "Subject not found"});
        }
        res.status(200).json({message: "Subject updated successfully", subject});
    }catch(error){
        res.status(500).json({message: "Error updating subject", error: error.message});
    }
}

//delete a subject by ID
const deleteSubject = async(req,res)=>{
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if(!subject){
            return res.status(404).json({message: "Subject not found"});
        }
        res.status(200).json({message: "Subject deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting subject", error: error.message});
    }
}

module.exports = {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject
};