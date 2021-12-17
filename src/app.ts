import express from 'express';
import * as bodyParser from 'body-parser';
import Morgan from 'morgan';
import fs from 'fs';

import indexRoute from './routes/index.route';
import { errorConverter, errorHandler } from './middlewares/error';
import swaggerUi from 'swagger-ui-express';

const app = express();

require('dotenv').config();

app.use(bodyParser.json());

const ENV = process.env.environment || 'dev';

const swaggerFile: any = (process.cwd()+"/src/swagger/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

app.use(Morgan(ENV));

app.use("/api/v1/", indexRoute);

app.use('/api/v1/docs', swaggerUi.serve,
            swaggerUi.setup(swaggerDocument));

app.use(errorConverter);
app.use(errorHandler);

export default app;
