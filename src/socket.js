import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 5,
        timeout: 10000,
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
        withCredentials: true
    };

    const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    
    return new Promise((resolve, reject) => {
        try {
            const socket = io(SOCKET_SERVER_URL, options);

            socket.on('connect', () => {
                console.log('Socket connected successfully');
                resolve(socket);
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                socket.io.opts.transports = ['polling', 'websocket'];
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
                reject(error);
            });

            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                if (reason === 'io server disconnect') {
                    socket.connect();
                }
            });

            socket.on('reconnect', (attemptNumber) => {
                console.log('Socket reconnected after', attemptNumber, 'attempts');
            });

            socket.on('reconnect_error', (error) => {
                console.error('Socket reconnection error:', error);
            });

        } catch (error) {
            console.error('Socket initialization error:', error);
            reject(error);
        }
    });
};
