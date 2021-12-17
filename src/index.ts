import logger from './config/logger';
import app from './app';
import mongoose from './config/mongoose';

const PORT = process.env.PORT || 5000;
const ENV = process.env.environment || 'dev';

let server: any;

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);

  if (server) {
    server.close(() => {
      logger.info(`Server Close`);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info(`SIGTERM received`);
  if (server) {
    server.close();
    process.exit(1);
  }
});

async function startServer() {
  try {
    await mongoose();
    server = app.listen(PORT, () => {
      logger.info(`Listening on port ${PORT} (${ENV})`);
    });
  } catch (error) {
    logger.error(`Fail to start server: ${error}`);
    process.exit(-1);
  }
}

startServer();
