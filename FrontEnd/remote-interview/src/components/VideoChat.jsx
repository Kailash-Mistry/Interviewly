// components/VideoChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

const VideoChat = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  useEffect(() => {
    socket.emit('join_room', roomId);
    setupMediaAndConnection();

    socket.on('offer', async ({ offer }) => {
      if (!peerConnection.current) createPeerConnection();

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { answer, roomId });
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding received ICE candidate', err);
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, []);

  const setupMediaAndConnection = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream.current;
      createPeerConnection();

      localStream.current.getTracks().forEach((track) =>
        peerConnection.current.addTrack(track, localStream.current)
      );

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', { offer, roomId });
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(config);

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, roomId });
      }
    };
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-5 bg-[#202124] rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="relative rounded-xl overflow-hidden bg-[#2d2d2d] shadow-md">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video object-cover rounded-xl bg-[#1a1a1a]"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
            You
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-[#2d2d2d] shadow-md">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full aspect-video object-cover rounded-xl bg-[#1a1a1a]"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
            Peer
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 p-4 bg-[#202124]/90 backdrop-blur-md rounded-lg">
        <button 
          onClick={toggleAudio} 
          className={`flex items-center justify-center w-12 h-12 rounded-full border-none transition-all duration-200 ease-in-out ${
            audioEnabled 
              ? 'bg-[#3c4043] hover:bg-[#4a4d51]' 
              : 'bg-[#ea4335] hover:bg-[#f44336]'
          }`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="text-white">
            {audioEnabled ? (
              <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            ) : (
              <path fill="currentColor" d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
            )}
          </svg>
        </button>
        <button 
          onClick={toggleVideo} 
          className={`flex items-center justify-center w-12 h-12 rounded-full border-none transition-all duration-200 ease-in-out ${
            videoEnabled 
              ? 'bg-[#3c4043] hover:bg-[#4a4d51]' 
              : 'bg-[#ea4335] hover:bg-[#f44336]'
          }`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" className="text-white">
            {videoEnabled ? (
              <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            ) : (
              <path fill="currentColor" d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
