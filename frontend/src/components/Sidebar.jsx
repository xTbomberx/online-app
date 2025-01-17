import React, { useEffect, useState } from 'react';

import '../pages/css/homepage/Homepage.css'
import '../pages/css/homepage/Sidebar.css'

import SidebarSkeleton from '../components/skeletons/SideBarSkeleteon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore'

function Sidebar() {

    const { getUsers , users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()

    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    
    useEffect( () => {
      getUsers()
    }, [getUsers])

    // create new array with only onlineUsers that are online
    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;
    if(isUsersLoading) return <SidebarSkeleton /> 

  return (

    <aside className='sidebar'>
      <div className='sidebar-header'>
        <FontAwesomeIcon icon={faUser} />
        <span>Contacts</span>
      </div>

      <div className="sidebar-toggle">
        <label >
          <input type="checkbox"
                 checked={showOnlineOnly}
                 onChange={(e) => setShowOnlineOnly(e.target.checked)}
                 className='checkbox' />
                 <span style={{fontSize: '.9rem'}}>Show Online Only</span>
        </label>
        <span className="online-amount"
              style={{
                fontSize: '.7rem',
                opacity: '0.6',
                marginLeft: '5px'
              }}>
              ({onlineUsers.length - 1})
        </span>
      </div>

      <div className="sidebar-contacts">
        {filteredUsers.map((user) => (
          <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              // BACKROUND ON SELECTED USER WOULD onChange
                // This contiional checks to see if ---> 
                //         the ID of the (selected User) matches Id of user._id(in the map func) 
                //         if so it applies an additional class called selected (we style)
                className={`contact-item ${selectedUser?._id === user._id ? 'selected' : "" }`}
                >
                <div>
                  <img src={user.profilePic || '/avatar.png'} alt={user.name} />
                </div>
                {/* IF ONLINE DISPLAY THIS DOT */}
                {onlineUsers.includes(user._id)  && (
                <div>
                     <span
                      className='span-onlineUser'
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'green',
                        borderRadius: '50%',
                      }}
                    ></span>
                </div>
                )}
                <div className="user-info">
                      <div className="user-name">{user.fullName}</div>
                      <div className="user-status">
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                      </div>
                </div>
          </button>
        ))}
      </div>

    </aside>
  )
}

export default Sidebar