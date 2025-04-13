import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // for storing error logs
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }), // for storing info logs
        new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }), // for storing warning logs
        new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }), // for storing debug logs
        new winston.transports.File({ filename: 'logs/all.log' }), // for storing all logs (error + info + warn + debug)
    ],
});

export default logger;
