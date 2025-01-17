import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set,get) => ({

    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        set({isUsersLoading: true});

        try {
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data })
        } catch (error) {
            console.error('GETTING USERS ERROR:' , error)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async(userId) => {
        set({isMessagesLoading: true});

        try {
            const response = await axiosInstance.get(`/messages/${userId}`)
            
            // CONSOLE CHECKING
            const messages = response.data;
            messages.forEach(message => {
                console.log(message.text)
            })
            ////////////////////
            set({ messages: response.data });
        } catch(error) {
            console.error('GETTINGS MSGs error:' , error);
        } finally {
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async(messageData) => {
        const {selectedUser, messages} = get()
        try {
            // messageData.text , messageData.image
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            // KEEP ALL THE PREVIOUS MESSAGES, just create a new array including the response.data
            // THIS IS HOW WE PUSH ----  a new item to an array
            set({message: [...messages, response.data]})
        } catch(error) {
            console.error('sendMessage Error:' , error)
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket 

        // event we are listening to is newMessage // data= newMessage
        socket.on("newMessage" , (newMessage) => {

            if(newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)
                { 
            set({
                // creating new ARRAY (keeping all old messages) , new ARRAY will have newMessage added
                messages: [...get().messages, newMessage],
            });
        }
        });
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket 
        // turn off event listener
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),


}))