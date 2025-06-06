/**
 * @copyright 2024 Jeremie Mabiala
 * @license Apache-2.0
 * 
 */

/**
 * Node modules
 */

import winston from 'winston';

/**
 * Custom modules
 */

import config  from '@/config';


const { combine, timestamp,json,errors,  align, printf, colorize } = winston.format;

//  Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

//  If the application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // add color to the console output
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // format the timestamp
        errors({ stack: true }), // include error stack traces
        align(),
        printf(({ level, message, timestamp, ...meta }) => {
         const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';
         return `${timestamp} [${level.toUpperCase()}]: ${message}${metaString}`;
        })
      )
    })
  );
}

//  Create a logger instance with the defined transports
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info', // Set the logging level from the environment variable or default to 'info'
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // format the timestamp
    errors({ stack: true }), // include error stack traces
    json() // output logs in JSON format,
  ),
   transports, // use the defined transports
   silent: config.NODE_ENV === 'test', // disable logging in test environment
});


export {logger};