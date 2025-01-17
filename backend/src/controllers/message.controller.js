const Message = require('../models/message.model.js')
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require("../lib/cloudinary.js")
const User = require('../models/user.model');
const { getReceiverSocketId, io } = require('../lib/socket.js');

// FUNCTION = SEARCHES DB for ALL USERS to showcase whose ONLINE
// FUNCTION = SEARCHES DB for ALL USERS to showcase whose ONLINE
module.exports.getUsersForSideBar = asyncHandler(async (req, res) => {
    // Step 1 - (protected ROUTE = req.user will be attached to REQUEST) - grab USER-ID
    const loggedInUserId = req.user._id;

    // Step 2 - FIND all the USERS ne(NOT EQUAL) to logged IN users(and THEIR info EXCEPT their password)
    const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filterUsers);
});



module.exports.getMessages = asyncHandler(async(req,res) => {

    // STEP 1 - EXTRACT target and senders IDs
    const { id:userToChatId } = req.params
    const myId = req.user._id; // current LOGGED IN USER (in COOKIE)

    // Step 2 - find MESSAGES between sender/receiver REGARDLESS of who sent it
    const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ]
    });

    res.status(200).json(messages)
})



module.exports.sendMessage = asyncHandler(async(req,res) => {

    // STEP 1 - grab text/image from the REQUEST BODY
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const fullName = req.user.fullName;
    let imageUrl;
    if(image) {
        // UPLOAD base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    // STEP 2 - create a new message
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
    });


    // STEP 3 - save the message to the database
    await newMessage.save();

    
    const receiverSocketId = getReceiverSocketId(receiverId)
    // user is online
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage) // event=newMessage data=newMessage
    }

    // Emit the message to the sender
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", newMessage)
    }

    // STEP 4 - future socket.io function
    console.log("Sender username:", fullName)
    res.status(201).json(newMessage);
})

// POSTMAN // 
// requires ID of another USER (and logged in of 1)
// http://localhost:3000/api/messages/6766b8247eeb08ea9c9467bd

// {
//     "text": "Hello, how are you?",
//    
// }






