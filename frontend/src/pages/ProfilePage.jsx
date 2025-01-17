import React from 'react'
import { useState } from 'react'
import { useAuthStore } from "../store/useAuthStore"
import '../pages/css/ProfilePage.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

function ProfilePage() {

    const { authUser , isUpdatingProfile , updateProfile } = useAuthStore()


    const [selectedImage, setSelectedImage] = useState(null);


    const handleImageUpload = async(e) => {
      const file = e.target.files[0];
      if(!file) return;

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImage(base64Image);
        await updateProfile({ profilePic: base64Image }) // expecting the object ProfilePic in backend api
      }
    }

    return (
      <div>
        <div className="profile-page-container">
          <div className="profile-header">
            <h1>Profile</h1>
            <h2>Your Profile Information</h2>
          </div>

          <div className="profile-image-uploader">
            <div className="icon">
              {/* FIRST - if there is selected IMAGE (show) , if not go down the chain */}
              <img className="avatar-pic" src={selectedImage || authUser.profilePic || '/avatar.png'}   />
              {/* IF the ICON and LABEL are in the same LABEL, ICON will run the function if clicked */}
              <label 
                    htmlFor="avatar-upload"
                    className='avatar-label'>
                  <FontAwesomeIcon className='camera' icon={faCameraRetro} />
                  <input 
                    type="file"
                    id='avatar-upload'
                    className='hidden'
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
              </label>
            </div>
            <h3>Click the Camera Icon to update your photo</h3>
          </div>

          <div className="profile-member-information">
            <div className="member-info-group">
              <h4>Full Name</h4>
              {/* WILL DISPLAY IF AUTHUSER HAS FULLNAME */}
              {/* NULL OTHERWISE */}
              <p>{authUser?.fullName}</p>
            </div>

            <div className="member-info-group">
              <h4>Email Address</h4>
              {/* WILL DISPLAY IF AUTHUSER HAS email */}
              {/* NULL OTHERWISE */}
              <p>{authUser?.email}</p>
            </div>
          </div>

          <div className="account-information">
            <div className="member-info-group">
              <h4>Member Since</h4>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>

            <div className="member-info-group">
              <h4>Account Status</h4>
              <span className='active'>Active</span>
            </div>

          </div>
        </div>
      </div>
    )
}

export default ProfilePage