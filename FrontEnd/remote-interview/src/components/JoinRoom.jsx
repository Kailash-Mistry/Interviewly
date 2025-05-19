import React, { useState } from 'react';
import { socket } from '../socket';

const JoinRoom = ({ setJoined, setRoom, setUser }) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const joinRoom = () => {
    if (roomId && username) {
      socket.emit('join_room', roomId);
      setRoom(roomId);
      setUser(username);
      setJoined(true);
    }
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
};

export default JoinRoom;