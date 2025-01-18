const errorHandler = (err, req, res, next) => {
    // console.log('Error stack:', err.stack); // Log the stack trace for debugging
    console.log('Error message:', err.message); // Log the error message for debugging
    const statusCode = err.statusCode || 500;

    const message = 'Something went wrong';
    res.status(statusCode).json({ message });
};

export default errorHandler;
