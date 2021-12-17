import winston from "winston";
import { createLogger, format, transports } from "winston";
import { addColors } from "winston/lib/winston/config";
import { LogCurrentTime } from "../utils/generalFuncs";

const { combine } = format;

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

/**
 * Custom Log Levels
 * @returns {object} 
*/
const customLogLevels = {
    levels: {
        error: 0,
        warning: 1,
        debug: 2,
        request: 3,
        info: 4,
    },
    colors: {
        error: "red",
        warning: "yellow",
        debug: "purple",
        request: "blue",
        info: "green",
    },
};

addColors(customLogLevels.colors);


/**
 * Log operation to its corresponding files
 * @returns {object}
*/
const logger = createLogger({
    levels: customLogLevels.levels,
    format: combine(
        enumerateErrorFormat(),
        format.uncolorize(),
        format.splat(),
        format.printf(({ level, message }) => `${level}: ${LogCurrentTime()} ${message}`)
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/warning.log', level: 'warning' }),
        new transports.File({ filename: './logs/debug.log', level: 'debug' }),
        new transports.File({ filename: './logs/request.log', level: 'request' }),
        new transports.File({ filename: './logs/system.log' }),
        new transports.Http({
            level: 'warn',
            format: winston.format.json()
        }),
        new transports.Console(),
    ],
});

export default logger;