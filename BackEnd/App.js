// server.js or App.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id)

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('code_change', ({ room, newCode }) => {
    socket.to(room).emit('code_update', { room, newCode });
  });

  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', { offer, sender: socket.id });
  });

  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', { answer, sender: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, sender: socket.id });
  });

  // Handle chat messages
  socket.on('chat_message', ({ room, message, sender, timestamp }) => {
    io.to(room).emit('chat_message', { message, sender, timestamp });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
