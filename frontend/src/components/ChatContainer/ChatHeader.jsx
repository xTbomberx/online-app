import React from 'react'

import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore'

import './css/ChatHeader.css'

function ChatHeader() {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();


  return (
    <div className='Chatheader'>
        {/* COMPONENT 1 - DISPLAY AVATAR IMAGE OF SELECTED USER */}
        <div className="avatar-container">
            <div className="avatar-selectedUser">
                <img src={selectedUser.profilePic || "avatar.png"} alt={selectedUser.fullName} />
            </div>
            {/* COMPONENT 2 - USER INFO */}
            <div className="avatar-userInfo">
                <h3>{selectedUser.fullName}</h3> -
                {/* Conditional checks to see if the ARRAY of ONLINE users includes/has the current selected user 
                (returns TRUE if ONLINE and FALSE IF NOT) */}
                <p>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
            </div>
        </div>

        
        {/* COMPONENT 3 - CLOSE BUTTON */}
        <button onClick={() => setSelectedUser(null)}>
            X
        </button>

    </div>
  )
}

export default ChatHeader