import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';


dotenv.config();

// Create a server in socketIO
import { app, server } from './lib/socket.js';

///////////////
// IMPORTS ////
///////////////
import connectDB from './lib/db.js';
import errorHandler from './middleware/customErrorHandler.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

///////////////
// ENV FILES //
///////////////
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

////////////
// ROUTES //
////////////
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

///////////////
// ERROR HANDLER //
///////////////
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// becomes server.listen(instead of app) = because of SOCKET.IO
const main = async() => {
    server.listen(PORT, () => console.log(`PORT:${PORT} --> CHATAPP SERVER running...`))
    await connectDB();
}

main();
// npm run dev
