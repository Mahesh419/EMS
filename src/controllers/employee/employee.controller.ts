import {employeeService} from '../../services/index.service';
import {
    StatusCodes,
} from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';

const getAllEmployees = catchAsync(async (req: Request, res: Response ) => {
    const {pageSize, page} = req.query;
    const employeeList = await employeeService.getAllEmployees(pageSize, page);
    res.status(StatusCodes.OK).send(employeeList);
});

const getEmployeeById =  catchAsync(async (req: Request, res: Response ) => {
    const employeeId = req.params.id;
    const employee = await employeeService.getEmployeeById(employeeId);
    res.status(StatusCodes.OK).send(employee);
});

const addEmployee = catchAsync(async (req: Request, res: Response ) => {
    const response = await employeeService.addEmployee(req.body);
    res.status(StatusCodes.CREATED).send(response);
});

const updateEmployee = catchAsync(async (req: Request, res: Response ) => {
    const employeeId = req?.params?.id;
    const employeeDetails = req.body;

    const response = await employeeService.updateEmployee(employeeId, employeeDetails);
    res.status(StatusCodes.OK).send(response);
});

const deleteEmployee = catchAsync(async (req: Request, res: Response ) => {
    const employeeId = req?.params?.id;

    const response = await employeeService.deleteEmployee(employeeId);
    res.status(StatusCodes.OK).send(response);
});

const addEmployees = catchAsync(async (req: Request, res: Response ) => {
    const file = req.file;
    const response = await employeeService.addEmployeesFromCSV(file);
    res.status(StatusCodes.OK).send(response);
});

const uploadImage = catchAsync(async (req: Request, res: Response ) => {
    const file = req.file;
    const employeeId = req.params.id;
    const response = await employeeService.uploadImage(employeeId, file);
    res.status(StatusCodes.OK).send(response);
});



export default {
    getAllEmployees,
    addEmployee,
    updateEmployee,
    getEmployeeById,
    deleteEmployee,
    addEmployees,
    uploadImage
};