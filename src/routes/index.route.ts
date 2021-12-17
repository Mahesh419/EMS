import * as express from 'express';

import employeeRoute from './employee/exployee.route';

const router = express.Router();

router.use('/employee', employeeRoute);

export default router;