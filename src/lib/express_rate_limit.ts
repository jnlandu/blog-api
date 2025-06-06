/**
 * @copyright 2024 Jeremie Mabiala
 * @license Apache-2.0
 * 
 */

/**
 * Node modules
 */
import {rateLimit} from 'express-rate-limit';



//  Configure rate limiting middleware to prevent abuse
const limiter = rateLimit({                         
  windowMs: 60000, // 15 * 60 * 1000, // 15 minutes
  limit: 60, //Allow a maximum of 60 requests per window per IP
  standardHeaders: 'draft-8', // use the latest standard rate-limit headers
  legacyHeaders: false, // Disable deprecated X-rateLimit headers
  message: {
    error:
    'You have sent too many requests in a given amount of time. Please try again later.',
  }
});

export default  limiter;