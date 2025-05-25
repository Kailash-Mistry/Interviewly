// server.js or App.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

// Add code analysis endpoint
app.post('/analyze-code', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a prompt for code analysis
    const prompt = `Review the following ${language} code ,Give the expected Time and Space Complexity and check for syntax errors if any and suggestions for optimization . keep the ans concise and to the point:

${code}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({ analysis });
  } catch (error) {   
    console.error('Error analyzing code:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
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

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
