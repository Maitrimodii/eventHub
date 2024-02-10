const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Import security-related middleware
const helmet = require('helmet'); // Helps secure HTTP headers
const xss = require('xss-clean'); // Helps prevent Cross-Site Scripting (XSS) attacks
const mongoSanitize = require('express-mongo-sanitize'); // Helps prevent MongoDB Injection attacks

// Import database connection setup
const DbConnect = require('./config/db');

// Import route handlers 
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registerRoutes = require('./routes/registrationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Import error handling middleware
const errorMiddleware = require('./middlewares/errorMiddleware');
const initializeSocket = require('./socket');

// Load environment variables from the .env file
dotenv.config();

// Connect to the database
DbConnect();

// Create an Express application
const app = express();

// Use Helmet middleware to secure HTTP headers
app.use(helmet());

// Use xss-clean middleware to prevent XSS attacks
app.use(xss());

// Use express-mongo-sanitize middleware to prevent MongoDB Injection attacks
app.use(mongoSanitize());

// Parse incoming JSON requests
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Log HTTP requests during development using Morgan
app.use(morgan('dev'));

// Define routes for handling user-related and event-related requests
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);

//routes for handling chat related requests
app.use('/api/chat', chatRoutes);
app.use('/api/message',messageRoutes);

// route for the Razorpay payment route
app.use('/api', require('./razorpay'));

//route for the qrcode generator and scan
app.use('/api', registerRoutes);

//route for file related requests
app.use('/api/file', fileRoutes);

// Use custom error handling middleware
app.use(errorMiddleware);

// Define the Port variable after loading environment variables
const Port = process.env.PORT || 5000;

// Start the server
const server  = app.listen(Port, () => {
    console.log(`Node server running in ${process.env.DEV_MODE} mode on ${Port}`);
});

const io = initializeSocket(server);