import {EmployeeModel} from '../../models/index.model'; 
import logger from '../../config/logger';
import IEmployee from './../../types/IEmployee';

import {promises as fs} from 'fs';
import httpStatus from "http-status";
import ApiError from '../../utils/apiError';

const getAllEmployees = async (pageSize?: any, page?: any) => {
    try{
        const size = pageSize && Number(pageSize);
        const pageNo = page && Number(page);
        if(size && pageNo){
            const skip = (pageNo - 1) * size;
            return await EmployeeModel.find().limit(size).skip(skip);
        }
        return await EmployeeModel.find();
    } catch (error: any){
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Could not fetch users");       
    }
};

const getEmployeeById = async (employeeId: string) => {
    try{
        return await EmployeeModel.findById(employeeId);
    } catch (error: any){
        logger.error(error);
        throw new ApiError(httpStatus.NOT_FOUND, "User not found"); 
    }
};

const addEmployee = async (employee: IEmployee) => {
    try{
        const res = await EmployeeModel.create(employee);
        return res;
    } catch (error: any){
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Could not create the user"); 
    }
}

const updateEmployee = async (employeeId: string, employee: IEmployee) => {
    try {
        const existingEmployee = await EmployeeModel.findById(employeeId);
        if(existingEmployee){
            return await EmployeeModel.findOneAndUpdate({_id: employeeId}, employee, {new: true});
        }
    } catch (error){
        logger.error(error);        
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update the user");
    }
}

const deleteEmployee = async (employeeId: string) => {
    try{
        let message = "Employee deleted successfully!";
        const {deletedCount} = await EmployeeModel.deleteOne({_id: employeeId});
        if(!deletedCount){
            message = "Employee could not be found with the given id"
        }
        return {message}
    } catch (error){
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the user"); 
    }
};


const toEmployeeObject = (csvRow: string) => {
    const details = csvRow.split(",");
    return new EmployeeModel({
        firstName: details[0],
        lastName: details[1],
        preferredName: details[2],
        gender: details[3],
        location: details[4],
        description: details[5],
        designation: details[6],
        workEmail: details[7],
        workPhone: details[8],
        linkedinProfile: details[9],
    });
}

const addEmployeesFromCSV = async (fileDetails: any) => {
    let response: any;
    const filePath = `${fileDetails.destination}/${fileDetails.filename}`;
    try{
        const data = await fs.readFile(filePath, {encoding: 'utf8'});
        const employeeDetails = data.split(/\r?\n/).map((csvRow: string) => {
            if(csvRow){
                return toEmployeeObject(csvRow);
            }
        }).filter(employee => employee);
        response = await EmployeeModel.insertMany(employeeDetails);       
    } catch (error){
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to add the users"); 
    } finally {
        await fs.unlink(filePath);
    }
    return response;
};

const uploadImage = async (employeeId: string, imageFile: any) => {
    let response: any;
    const imagePath = `${imageFile.destination}/${imageFile.filename}`;
    try{
        const image = await fs.readFile(imagePath); 
        const existingEmployee = await EmployeeModel.findById(employeeId);
        if(existingEmployee){
            return await EmployeeModel.findOneAndUpdate({_id: employeeId}, {profilePicture: image}, {new: true});
        }
        throw new ApiError(httpStatus.NOT_FOUND, "User not found"); 
    } catch (error){
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload the profile picture"); 
    }finally {
        await fs.unlink(imagePath);
    }
    return response;
};

export default {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addEmployeesFromCSV,
    uploadImage
};