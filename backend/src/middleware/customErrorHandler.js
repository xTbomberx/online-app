// const errorHandler = (err, req, res, next) => {
//     // console.error('Error stack:', err.stack); // Log the stack trace for debugging
//     // console.error('Error message:', err.message);
//     console.log('error message:', err.message)
//     res.status(500).json({ 'message': err.message });
// };

// module.exports = errorHandler;


// THIS CONSOLES LOG THE ERROR MESSAGE THEN RETURNS the correct error if handled properly

const errorHandler = (err, req, res, next) => {
    // console.log('Error stack:', err.stack); // Log the stack trace for debugging
    console.log('Error message:', err.message); // Log the error message for debugging
    const statusCode = err.statusCode || 500;

    const message = 'Something went wrong';
    res.status(statusCode).json({ message });
};

module.exports = errorHandler;