import { io } from 'socket.io-client';


const URL = 'https://backendchat-scb6.onrender.com';
// /'https://backendchat-scb6.onrender.com'
export const socket = io(URL);