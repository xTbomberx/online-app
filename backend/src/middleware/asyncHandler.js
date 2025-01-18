const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
};

export default asyncHandler;

// Wraps around ASYNC functions 
// catches errors and then passes them to next middleware

// ALLOWS US to not have to use TRY and CATCH blocks for everything

// ASYNCHANDLER - is designed to catch ERRORS in ASYNC ROUTES and pass them to our CUSTOM HANDLER