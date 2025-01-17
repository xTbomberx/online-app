import React from 'react';
import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

import ChatHeader from './ChatContainer/ChatHeader';
import MessageInput from './ChatContainer/MessageInput';

import '../pages/css/homepage/ChatContainer.css'
// 3 PARTS
// 1. CHAT HEADER (WITH selected User were chatting)
// 2. CHAT message field
// 3. TYPE A MESSAGE INPUT


// useEffect(() => {
//   // This code runs once when the component mounts 
//   // USEFUL For initilizaing dta or setting up the page on render(ONLY RUNS ONCE)
// }, []);

// useEffect(() => {
  // This code runs when `selectedUser` changes
// }, [selectedUser]);

function ChatContainer() {

    const { selectedUser , messages, getMessages, isMessagesLoading,
      subscribeToMessages, unsubscribeToMessages
     } = useChatStore();

    const { authUser } = useAuthStore();
    // We have access to selectedUser.email // selectedUser._id // selectedUser.fullName'

    const messageEndRef = useRef(null);

    // WE are GETTING MESSAGES FROM THE SELECTED-USER
    // THIS will RUN when 2 different things happen 1. IF SELECTED_USER CHANGES 2. getMESSAGES CHANGES
    useEffect(() => {
      if (selectedUser) {
        getMessages(selectedUser._id);

        // now create event to LISTEN TO MESSAGES event
        subscribeToMessages();

        return () => unsubscribeToMessages();
      }
    }, [selectedUser, getMessages , subscribeToMessages, unsubscribeToMessages]);
    
    // this will auto scroll when a newMessage (useEffect)
    useEffect(() => {
      if(messageEndRef.current && messages ) {
        messageEndRef.current.scrollIntoView({behavior: "smooth"})
      }
    } ,[messages]) // RUNS whenever MESSAGES CHANGES




    if (isMessagesLoading) {
      return (
          <div>....Loading</div>
      );
    }

    return (
      // THIS creates a div with the className chat-container and extra className of the selectedUser for potential more styling
      <div className={`chat-container`}>
        {/* { COMPONENT 1  (chatheadeer}/} */}
        <ChatHeader />

        <div className="message-container">
        {messages.map((message) => (
          <div 
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* COMPONENT 1 - CHAT CONTENT */}
            <div className="chat-content">
              <div className="chat-header">
                <time dateTime={message.createdAt} className='time-of-message'>
                  {new Date(message.createdAt).toLocaleString()}
                </time>
              </div>
              <div className="chat-bubble">
                {message.image && (
                  <img
                    src={message.image}
                    alt='Attachment'
                    className='message-image' 
                  />
                )}
                {message.text && <p className='chat-text'>{message.text}</p>}
              </div>
            </div>

            {/* COMPONENT 2 - IMAGE */}
            <div className="chat-image avatar-image">
              <img 
                src={message.senderId === authUser._id 
                      ? authUser.profilePic || "/avatar.png" 
                      : selectedUser.profilePic || "/avatar.png"} 
                alt="profile-pic" 
              />
            </div>
          </div>
        ))}
      </div>

        {/* COMPONENT - 3(message INPUT) */}
        <MessageInput />
      </div>
    )
}

export default ChatContainer





{/* COMPONENT - 2  (display messages)*/}
{/* {selectedUser ? ( */}
{/* //   <div className='message-container'> 
//     <h2>
//       Chat with {selectedUser.fullName} , {selectedUser._id}, {selectedUser.email}
//     </h2>
//   </div>
// ) : (
//   <div>
//     <h2> Select a user to start chatting</h2>
//   </div>
// )} */}