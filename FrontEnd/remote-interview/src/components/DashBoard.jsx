import React, { useState } from 'react';
import CollaborativeEditor from './CollaborativeEditor';
import { v4 as uuidv4 } from 'uuid';

function DashBoard() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setusername] = useState("");
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  const [copySuccess, setCopySuccess] = useState('');

  const generateRoomId = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    setCopySuccess('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const handleJoin = () => {
    if (roomId.trim() && username.trim()) {
      setJoined(true);
    }
  };

  const handleCreate = () => {
    if (username.trim() && roomId.trim()) {
      setJoined(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-white">
      {!joined ? (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="bg-[#202c33] rounded-lg shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
              Coding Room
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-[#2a3942]">
              <button
                className={`flex-1 py-2 sm:py-3 text-center font-medium text-sm sm:text-base ${
                  activeTab === 'join' ? 'text-[#005c4b] border-b-2 border-[#005c4b]' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('join')}
              >
                Join Meet
              </button>
              <button
                className={`flex-1 py-2 sm:py-3 text-center font-medium text-sm sm:text-base ${
                  activeTab === 'create' ? 'text-[#005c4b] border-b-2 border-[#005c4b]' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('create')}
              >
                Create Meet
              </button>
            </div>
            
            <div className="space-y-4">
              {activeTab === 'join' ? (
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="roomId" className="block text-sm font-medium text-white mb-2">
                    Room ID
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="roomId"
                      type="text"
                      placeholder="Click Generate to create Room ID"
                      value={roomId}
                      readOnly
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors text-sm sm:text-base"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={generateRoomId}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#005c4b] text-white font-medium rounded-lg hover:bg-[#006d5b] focus:outline-none focus:ring-2 focus:ring-[#005c4b] focus:ring-offset-2 focus:ring-offset-[#202c33] transition-all text-sm sm:text-base"
                      >
                        Generate
                      </button>
                      {roomId && (
                        <button
                          onClick={copyToClipboard}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#2a3942] text-white font-medium rounded-lg hover:bg-[#3a4952] focus:outline-none focus:ring-2 focus:ring-[#2a3942] focus:ring-offset-2 focus:ring-offset-[#202c33] transition-all text-sm sm:text-base"
                        >
                          {copySuccess || 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors text-sm sm:text-base"
                />
              </div>

              <button
                onClick={activeTab === 'join' ? handleJoin : handleCreate}
                disabled={!username.trim() || (activeTab === 'join' && !roomId.trim()) || (activeTab === 'create' && !roomId.trim())}
                className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-[#005c4b] text-white font-medium rounded-lg hover:bg-[#006d5b] focus:outline-none focus:ring-2 focus:ring-[#005c4b] focus:ring-offset-2 focus:ring-offset-[#202c33] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {activeTab === 'join' ? 'Join Room' : 'Create Room'}
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