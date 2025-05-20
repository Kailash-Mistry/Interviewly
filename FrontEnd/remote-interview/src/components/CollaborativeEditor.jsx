import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { socket } from '../socket';
import VideoChat from './VideoChat';

const CollaborativeEditor = ({ roomId, language = 'cpp' }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('// Start coding...');
  const isRemoteChange = useRef(false);
  
  useEffect(() => {
    socket.emit('join_room', roomId);

    socket.on('code_update', ({ room, newCode }) => {
      if (room === roomId && newCode !== code) {
        isRemoteChange.current = true;
        setCode(newCode);
      }
    });

    return () => {
      socket.off('code_update');
    };
  }, [roomId, code]);

  const handleEditorChange = (value) => {
    if (!isRemoteChange.current) {
      setCode(value);
      socket.emit('code_change', { room: roomId, newCode: value });
    }
    isRemoteChange.current = false;
  };

  return (
    <div className="h-screen w-full bg-[#1a1a1a] flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-[#2d2d2d] border-b border-[#3c4043] flex items-center px-4">
        <h1 className="text-white text-lg font-medium">Collaborative Editor</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor Section - Left Half */}
        <div className="w-1/2 h-full border-r border-[#3c4043]">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            onMount={(editor) => (editorRef.current = editor)}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Video Chat Section - Right Half */}
        <div className="w-1/2 h-full">
          <VideoChat roomId={roomId} />
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
