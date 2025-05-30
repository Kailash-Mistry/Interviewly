# Interviewly - Real-time Technical Interview Platform

Interviewly is a modern, feature-rich platform designed for conducting technical interviews remotely. It provides a seamless experience for both interviewers and interviewees with real-time collaboration, video communication, and AI-powered assistance.

## 🌟 Features

### For Interviewers
- **Real-time Code Collaboration**
  - Live code editing with syntax highlighting
  - Support for multiple programming languages
  - Real-time code synchronization between participants
  - Language switching during the interview

- **AI-Powered Code Analysis**
  - Instant code quality assessment
  - Time and space complexity analysis
  - Code optimization suggestions
  - Syntax error detection
  - Historical analysis tracking

- **Interview Monitoring**
  - Real-time notifications when interviewee switches tabs
  - Fullscreen mode monitoring
  - Tab switching detection
  - Instant alerts for any suspicious activities

### For Interviewees
- **Secure Interview Environment**
  - Forced fullscreen mode
  - Tab switching detection
  - Window focus monitoring
  - Restricted access to other applications

- **Collaborative Features**
  - Real-time code editing
  - Multiple language support
  - Live code synchronization
  - Integrated chat system

### Communication Features
- **Video Chat**
  - High-quality video communication
  - Audio controls (mute/unmute)
  - Video controls (on/off)
  - Screen sharing capabilities

- **Text Chat**
  - Real-time messaging
  - Message history
  - Timestamp tracking
  - User identification

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Socket.io-client** - Real-time communication
- **Monaco Editor** - Code editor
- **WebRTC** - Video/audio streaming
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Firebase** - Authentication
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time server
- **Google Gemini AI** - Code analysis
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/interviewly.git
cd interviewly
```

2. Install Frontend dependencies
```bash
cd FrontEnd/remote-interview
npm install
```

3. Install Backend dependencies
```bash
cd BackEnd
npm install
```

4. Set up environment variables
Create a `.env` file in the Backend directory:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

5. Start the development servers

Frontend:
```bash
cd FrontEnd/remote-interview
npm run dev
```

Backend:
```bash
cd BackEnd
npm start
```

## 🔒 Security Features
- Secure WebRTC connections
- Protected routes
- User authentication
- Real-time monitoring
- Tab switching detection
- Fullscreen enforcement

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors
- Kailash Mistry
- Swastik Verma

## 🙏 Acknowledgments
- Google Gemini AI for code analysis
- Monaco Editor for the code editor
- Socket.io for real-time communication
- WebRTC for video/audio streaming 