import React, { useState } from 'react';
import CollaborativeEditor from './CollaborativeEditor';

function DashBoard() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setusername] = useState("");

  const handleJoin = () => {
    if (roomId.trim() && username.trim()) {
      setJoined(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-white">
      {!joined ? (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-[#202c33] rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Join Coding Room
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-white mb-2">
                  Room ID
                </label>
                <input
                  id="roomId"
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!roomId.trim() || !username.trim()}
                className="w-full mt-6 px-6 py-3 bg-[#005c4b] text-white font-medium rounded-lg hover:bg-[#006d5b] focus:outline-none focus:ring-2 focus:ring-[#005c4b] focus:ring-offset-2 focus:ring-offset-[#202c33] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen">
          <CollaborativeEditor roomId={roomId} language="cpp" username={username} />
        </div>
      )}
    </div>
  );
}

export default DashBoard;