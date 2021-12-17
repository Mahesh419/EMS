import mongoose from "mongoose";
import logger from "./logger";

const ENV = process.env.environment;
const DB_URL = process.env.DB_URL;


if (ENV === "test") {
    mongoose.set("debug", true);
}

/**
 *  Initialize MongoDB connection
 * 
 * @returns {object} MongoDB connection
 */
export default function () {

    return mongoose.connect(DB_URL!)
        .then(() => {
            logger.info(`MongoDB successfully connected`);
        })
        .catch(err => {
            logger.error(`MongoDB failed to connect - ${err}`);
            throw new Error(err);
        })
}