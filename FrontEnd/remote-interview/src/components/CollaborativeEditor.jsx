import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { socket } from '../socket';

const CollaborativeEditor = ({ roomId, language = 'javascript' }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('// Start coding...');
  const isRemoteChange = useRef(false);

  // Join room on mount
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
    <Editor
      height="75vh"
      defaultLanguage={language}
      value={code}
      onChange={handleEditorChange}
      theme="vs-dark"
      onMount={(editor) => (editorRef.current = editor)}
    />
  );
};

export default CollaborativeEditor;