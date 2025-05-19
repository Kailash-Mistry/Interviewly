import React, { useState } from 'react';
import CollaborativeEditor from './components/CollaborativeEditor';

function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (roomId.trim()) {
      setJoined(true);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {!joined ? (
        <div>
          <h2>Join Coding Room</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: '10px', width: '300px', marginBottom: '1rem' }}
          />
          <br />
          <button onClick={handleJoin} style={{ padding: '10px 20px' }}>
            Join Room
          </button>
        </div>
      ) : (
        <CollaborativeEditor roomId={roomId} language="javascript" />
      )}
    </div>
  );
}

export default App;