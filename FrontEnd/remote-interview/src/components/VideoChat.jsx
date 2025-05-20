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
    <div style={{ marginTop: '1rem' }}>
      <h3>Video Call</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: '300px', borderRadius: '8px', border: '2px solid #00bcd4' }}
          />
          <p style={{ textAlign: 'center' }}>You</p>
        </div>
        <div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: '300px', borderRadius: '8px', border: '2px solid #4caf50' }}
          />
          <p style={{ textAlign: 'center' }}>Peer</p>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={toggleVideo} style={{ marginRight: '10px', padding: '8px 12px' }}>
          {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
        </button>
        <button onClick={toggleAudio} style={{ padding: '8px 12px' }}>
          {audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
