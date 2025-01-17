import React from 'react'
import {useState, useRef} from 'react';

import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage , faPaperPlane} from '@fortawesome/free-solid-svg-icons';

import './css/MessageInput.css'

// WILL have 3 components
// 1. FORM - where we type our message (flex: 1)// transparent background
// 2. IMAGE UPLOAD BUTTON (with image preview)
// 3. SEND BUTTON
function MessageInput() {

    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError ] = useState('');

    const fileInputRef = useRef(null)

    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // CREATE ERROR if they didnt select an Image file
        if (!file.type.startsWith("image/")) {
            setError('Please select an image file');
            return;
        }
        setError('');

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current)fileInputRef.current.value = "";
    };

    const handleSendMessage = async(e) => {
        e.preventDefault();
        // ERROR check --> IF NOT EMPTY message or imagepreview
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            // CLEAR FORM
            setText('');
            setImagePreview(null);
        } catch (error) {
            console.error("Failed to send Message: ", error);
        }
    }

    /////////////////////////////////////////////////////////////
    // HTML ////
    /////////////////////////////////////////////////////////////
    return (
        <div className='message-input'>
            {/* CUSTOM ERROR MESSAGE/ONLY DISPLAYED IF ERROR */}
            {error && <h1 className='error-message'>{error}</h1>}

            {/* COMPONENT 1 - Image preview  */}
            <div className="image-preview">
                {imagePreview && (
                    <div className="image-container">
                        <img src={imagePreview} alt="Preview" />
                        <button onClick={removeImage} className='image-x'>X</button>
                    </div>
                )}
            </div>

            {/* Component 2 - MESSAGE FORM */}
            <form onSubmit={handleSendMessage} className='message-form'>
                <input 
                    type="text"
                    placeholder='Type a message...'
                    value={text}
                    onChange={(e) => setText(e.target.value)} 
                />

                <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />


                <button className='file-button' type="button" onClick={() => fileInputRef.current?.click()}>
                    <FontAwesomeIcon icon={faImage} className='icon-image' />
                </button>
                {/* disabled checks 2 conditions if text=empty and imagePreview is falsy = button is disabled */}
                <button className='file-button' type='submit' disabled={!text.trim() && !imagePreview}>
                    <FontAwesomeIcon icon={faPaperPlane} className='icon-image' />
                </button>
            </form>
        </div>
    )
}

export default MessageInput