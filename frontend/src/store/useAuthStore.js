import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ?'http://localhost:3000' : "/"

// Management SOLUTION - Custom HOOK to manage authentication-related state within the application
// CALLING this allows us to have access to the current logged in USERS credentials and information

export const useAuthStore = create((set, get) => ({
    authUser: null, // we dont Know if User is authenticated or NOT
    isSigningUp: false,
    isLoggingIn:false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    // when we refresh the page -- WE want to CHECK if the USER IS AUTHENTICATED

    /////////////////////////
    // AUTH STORE FUNCTION //
    /////////////////////////

    // CHECK USERS CREDENTIALS
    checkAuth: async() => {
        try {
            // STEP 1 - RUN this whenever we call our application
            // REQUEST to OUR ENDPOINT -- router.get('/check', protectedRoute, checkAuth);
            const response = await axiosInstance.get('/auth/check');
            set({authUser:response.data}) // response.data.message(is what is passed from the backend)

            // STEP 2 - create socket whenever we load a page
            get().connectSocket()
        } catch (error) {
            // means USER is not AUTHENTICATED
            console.log("Error in checkAuth: ", error);
            set({authUser:null})
        } finally {
            set({isCheckingAuth: false})
        }
    },

    // SIGNUP FUNCTION //
    // data = data.fullname, data.password, data.email
    signup: async(data, navigate) => {
        set({ isSigningUp: true});
        console.log('Incoming signup data:', JSON.stringify(data, null, 2));
        try {
            // 1 - creating USER
            const response = await axiosInstance.post('/auth/signup', data);
            console.log('Account created successfully');
            set({ authUser: response.data });

            // 2 - Connecting to Socket
            get().connectSocket()
            navigate('/');
        } 
        catch (error){
            if (error.response) {
                console.error('Signup error:', error.response.data);
            } else {
                console.error('Signup error:', error.message);
            }
        }
        finally{
            set({ isSigningUp: false});
        }
    },



    logout: async() => {
        try {
            // 1 - LOGOUT
            await axiosInstance.post("/auth/logout") // BACKEND API - remove authentication cookie from server
            set({ authUser: null })                 // Client - updates client side-state 
            console.log('Logged Out Successfully')

            // 2 - disconnect from socker server
            get().disconnectSocket()
        } catch (error) {
            console.error('LOGOUT ERROR:', error)
        }
    },

    // WHEN we LOGIN - we want to connect to the socket Immediately
    login: async(data) => {
        set({ isLoggingIn: true});

        console.log('Incoming login data', JSON.stringify(data, null, 2))
        try {
            // STEP 1 - axios to our backend endpoint
            const response = await axiosInstance.post('/auth/login', data);
            set({authUser: response.data})
            console.log('Logged in successfully', response.data)

            // STEP 2 - connect to socket
            get().connectSocket()
        } catch (error) {
            console.error('LOGIN ERROR:', error)
        } finally {
            set({ isLoggingIn: false})
        }
    },

    updateProfile: async(data)=> {
        set({ isUpdatingProfile: true});
        try {
            const response = await axiosInstance.put('/auth/update-profile', data)
            set({authUser: response.data});
            console.log('Successul Image Upload' , response.data)
        } catch (error) {
            console.error("UPLOADING IMAGE ERROR:", error)
        } finally {
            set({ isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        // IF user is NOT AUTHENTICATED - dont create connection
        const {authUser} = get()
        // 1. if NO authUser = return out of the function   -- dont create new socket
        // or 2. if AUTHUSER is already connected           -- dont create new socket
        if (!authUser || get().socket?.connected)  return; 

        
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id // passing this to the socket
            }
        })
        socket.connect()

        set({ socket: socket });

        // listen for this io.emit event - setting our REACT APP
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })

        console.log('Socket connected:', socket.id);
    },


    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}));



// THE NODE.JS app sets the cookies and passes that to our FRONTEND AUTH STORE
// WE then call the AUTHSTORE throughout OUR APP so the CLIENT has easier access to their INFORMATION
// this is STATEFUL MANAGEMENT(because it remembers the info)
// ---> this way we dont have to repeatedly call the backend server for that information (saving time on our backend)
// zustand is a management library that helps maintain the state across the client side app

// HOW IT WORKS
// 1. BACKEND SETS COOKIES  
//          - USER LOGS IN , node.js sets the cookies in the users browser. (cookie is sent with every subsequent req to backend)\
//          - (auth.controller.js)(NODEJS-backend)
// 2. FRONTEND USES COOKIES
//          - FRONTEND REACT app reads the cookie to determine user's auth status.
//          - (utils.js)(NODEJS-backend)
// 3. STATE MANAGEMENT with ZUSTAND
//          - zustand library is a custom hook to manages that AUTH STATE. it stores the authenticated users info
//               and provides it to any component that needs it
//          - useAuthStore.js(REACT-frontend)
// 4. AVOID REPEATED BACKEND CALLS
//          - by storing the authentication state in the zustand store, the frontend app avoids making repeated calls 
//              to the backend to check the users auth status. IMPROVES PERFORMANCE AND REDUCES unnescessary network traffic
//          - IMPORT { useAuthStore } to any component - EXAMPLE BELOW
// import React from 'react';
// import { useAuthStore } from '../store/useAuthStore';

// function Navbar() {
//   const { authUser, clearAuthUser } = useAuthStore();

//   const handleLogout = () => {
//     clearAuthUser();
//     // Additional logout logic (e.g., redirect to login page, clear cookies, etc.)
//   };

//   return (
//     <nav>
//       <ul>
//         <li><a href="/">Home</a></li>
//         {authUser ? (
//           <>
//             <li><a href="/profile">Profile</a></li>
//             <li><a href="/settings">Settings</a></li>
//             <li><a href="#" onClick={handleLogout}>Logout</a></li>
//           </>
//         ) : (
//           <>
//             <li><a href="/login">Login</a></li>
//             <li><a href="/signup">Sign Up</a></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;