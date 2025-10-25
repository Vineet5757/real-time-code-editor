import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    };

    const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    
    try {
        const socket = io(SOCKET_SERVER_URL, options);
        
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
        });

        return socket;
    } catch (error) {
        console.error('Socket initialization error:', error);
        throw error;
    }
};
