import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  const authToken = process.env.WEBSOCKET_AUTH_TOKEN;
  if (authToken) {
    io.use((socket, next) => {
      const token = (socket.handshake.auth as any)?.token || (socket.handshake.query as any)?.token;
      if (token !== authToken) {
        return next(new Error('Unauthorized'));
      }
      next();
    });
  }
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};