/**
 * @copyright 2024 Jeremie Mabiala
 * @license Apache-2.0
 * 
 */

/**
 * Node modules
 */

import mongoose from 'mongoose';


/**
 * Custom modules
 */

import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * Types 
 */

import type { ConnectOptions } from 'mongoose'; 


/** 
 * Client option
 * 
 */

const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }

}

/**
 * Connect to MongoDB using Mongoose
 * 
 */ 

export const connectToDatabase = async (): Promise<void> => {
if(!config.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}

try{

     await mongoose.connect(config.MONGO_URI, clientOptions);
     logger.info('Connected to MongoDB successfully', {
        uri: config.MONGO_URI,
        options: clientOptions,
     });

}catch(error) {
   logger.error('Error connecting to MongoDB:', error);
    if(error instanceof Error) {
        throw error
    }
    logger.error('Error  occurred while connecting to MongoDB:', error);
}
}

/**
 * Disconnect from MongoDB using Mongoose
 */
export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.warn('Disconnected from MongoDB successfully', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        logger.error('Error occurred while disconnecting from MongoDB:', error);
    }
};