# Why API_Gateway

FRONTEND - MIDDLE-END - BACKEND

-we need an intermediate layer between the client side and the microservice
- using this middle end, when client sends request we will be able  to make decision that which microservice should actually respond to this request
-we can do message validation, response  transformation , ratye limiting
- we try to pepare an API Gateway that acts as this middle end.


# About the Code

## Architecture Overview
The API Gateway is built using Node.js and Express.js, serving as a crucial middleware layer between the frontend and various microservices. Here's how the code is structured:

### Core Components

1. **Server Setup (`index.js`)**
   - Express application configuration
   - Middleware registration (CORS, body-parser, morgan)
   - Route registration
   - Error handling middleware

2. **Route Management**
   - Separate route files for different services
   - Route versioning (v1, v2, etc.)
   - Request validation middleware
   - Authentication middleware

3. **Service Integration**
   - Proxy middleware for routing requests
   - Service discovery and load balancing
   - Circuit breaker implementation
   - Response caching

### Key Features Implementation

1. **Authentication Flow**
   ```javascript
   // Authentication middleware example
   const validateToken = async (req, res, next) => {
     try {
       const token = req.headers.authorization;
       // Verify token with Auth service
       // Add user details to request
       next();
     } catch (error) {
       return res.status(401).json({ message: "Unauthorized" });
     }
   };
   ```

2. **Rate Limiting**
   ```javascript
   // Rate limiting configuration
   const rateLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   ```

3. **Error Handling**
   ```javascript
   // Global error handler
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(err.status || 500).json({
       status: 'error',
       message: err.message
     });
   });
   ```

### Request Flow
1. Client sends request to API Gateway
2. Request passes through:
   - Rate limiting check
   - Authentication verification
   - Request validation
   - Route matching
3. Gateway forwards request to appropriate service
4. Response is transformed if needed
5. Final response sent to client

### Code Organization
```
src/
├── config/           # Configuration files
├── middlewares/      # Custom middleware functions
├── routes/           # Route definitions
├── services/         # Service integration logic
├── utils/           # Helper functions
└── index.js         # Application entry point
```

