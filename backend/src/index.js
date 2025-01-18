/////////////////////////////////////////////////
const express = require('express')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require('path');

dotenv.config()
// const app = express(); // create a server in socketIO
const { app, server } = require( './lib/socket.js')


///////////////
// IMPORTS ////
///////////////
const connectDB = require('./lib/db.js');
const errorHandler = require('./middleware/customErrorHandler');



///////////////
// ENV FILES //
///////////////
const PORT = process.env.PORT

// const __dirname = path.resolve();
////////////////
// MIDDLEWARE //
////////////////
app.use(express.json({
    limit: '2MB',
  }));
app.use(cookieParser()); // Allows you to PARSE/GRAB the values from JWT Cookie
// CORS = cross-origin-resource-sharing
// ALLOWS 2 different domains send request to each other (after a web page is loaded)
// request only from the origin(param) will be allowed to this backend 
// while also allowing for cookies to be passed to the frontend client server
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Increase the payload size limit
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

////////////
// ROUTES //
////////////
const authRoutes = require('./routes/auth.route')
const messageRoutes = require('./routes/message.route')



app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)


///////////////
// ERROR HANDLER //
///////////////
// app.use((err,req,res,next) => {
//     const { statusCode = 500, message = "Something went wrong"} = err;
//     res.status(statusCode).render('error', { err });
// })

app.use(errorHandler);

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

// becomes server.listen(instead of app) = because of SOCKET.IO
const main = async() => {
    server.listen(PORT, () => console.log(`PORT:${PORT} --> CHATAPP SERVER running...`))
    await connectDB();
}

main();
// npm run dev