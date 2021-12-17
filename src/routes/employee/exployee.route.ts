import express from 'express';
import multer from 'multer';

import {employeeController} from "../../controllers/index.controller";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', employeeController.getAllEmployees);

router.get('/:id', employeeController.getEmployeeById);

router.post('/', employeeController.addEmployee);

router.put('/:id', employeeController.updateEmployee);

router.delete('/:id', employeeController.deleteEmployee);

router.post('/csv', upload.single('employeeDetails'), employeeController.addEmployees);

router.post('/:id/image', upload.single('employeeImage'), employeeController.uploadImage);


export default router;