/**
 * @copyright 2024 Jeremie Mabiala
 * @license Apache-2.0
 * 
 */ 

/**
 * Node modules
 * 
 */

import dotenv from 'dotenv';


dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: ['https://documenter.getpostman.com/view/45688618/2sB2x2LaT2','https://www.postman.com/aerospace-cosmologist-40086310/workspace/blog-api','https://docs.blog-api.jmabiala.com'],
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/blog-db',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // set default logging level to 'info'
}


export default config;
