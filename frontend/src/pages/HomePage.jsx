import React from 'react'
import { useChatStore } from '../store/useChatStore'

import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelected'

import '../pages/css/homepage/Homepage.css'

function HomePage() {

    const { selectedUser } = useChatStore();





    return (
      <div>
          {/* 3 CHILD ELEMENTS */}
          <div className="homepage-container">

              <Sidebar  /> 
              <div className="right-side">
                  {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
              </div>
              

          </div>
      </div>
    )
}

export default HomePage