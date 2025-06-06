/**
 * @copyright 2024 Jeremie Mabiala
 * @license Apache-2.0
 * 
 */

/**
 * Node modules
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';


/**
 * Custom  modules
 */

import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';

import { logger } from '@/lib/winston';

/**
 * Routers
 */
import v1Routes from '@/routes/v1';

/**
  * Types
 */
import type {CorsOptions } from 'cors';


/**
 * Express app initial
 */

const app = express();



/**
 *Configire CORS options
 */
const corsOptions: CorsOptions = {
  origin(origin, callback) {
   if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    }else{
      //  Reject requests from non-whitelisted origins
      callback(new Error(`CORS  error : ${origin} is not allowed by CORS`), false);
      logger.warn(`CORS  error : ${origin} is not allowed by CORS`);
    }
   
  }
}

/**
 * Apply CORS middleware to the app
 */
app.use(cors(corsOptions));


/**
 * Enable JSON request body parsing
 */
app.use(express.json());

/**
 * Enable URL-encoded request body parsing
 */
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  Enable response compression to reduce payload size and improve performance
app.use(compression({
  threshold: 1024, // only compress responses larger than 1KB
})); 

//  Use Helmet to set various HTTP headers for security
app.use(helmet());

//  Apply rate limiting middleware to prevent abuse and enhance security
app.use(limiter);
/**
 * Immediately Invoked Async Function Expression (IIFE) to handle server startup
 * and error handling
 * 
 *  - Tries to connect to the database before initializing the server
 *  - Defines the API (`api/v1`)
 */
(async () => {
    try{
      await connectToDatabase();
      app.use('/api/v1', v1Routes);
      app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
});
    }catch (error) {
      logger.error('Failed to start the server', error);

      if (config.NODE_ENV === 'production') {
       process.exit(1); // Exit the process in production on error
      }
    }
  
  })();

/**
 * Handles server shutdown gracefully by disconnecting from the database
 * 
 * - Attempts to close the database connection before shutting down the server
 * - Logs a success message if the disconnection is successful
 * - If an error occurs during disconnection, it logs the error and exits the process
 * - Exits the process with status code `0` to indicate a clean shutdown
 * 
 * 
 * 
*/


const handleServerShutdown = async () => {
  try{
      await disconnectFromDatabase();
      logger.warn('Shutting down server gracefully...');
      process.exit(0); // Exit the process with status code 0 to indicate a clean shutdown
  }catch (error) {
      logger.error('Error during server shutdown:', error);
    // process.exit(1); // Exit the process with status code 1 to indicate an error during shutdown
  }
  
}

/**
 *  Listens for termination signals (SIGINT, SIGTERM) to handle graceful shutdown
 * * - SIGINT is sent when the user interrupts the process (e.g., Ctrl+C in the terminal)
 * * - SIGTERM is sent by the system to request termination of the process
 * 
 * 
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);



