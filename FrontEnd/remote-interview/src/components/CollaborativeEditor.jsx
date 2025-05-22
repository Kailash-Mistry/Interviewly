import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { socket } from '../socket';
import VideoChat from './VideoChat';
import Chat from './Chat';
import ReactMarkdown from 'react-markdown';

// Add custom scrollbar styles
const scrollbarStyles = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 10px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #4a4a4a #1a1a1a;
  }
`;

// Basic dark theme styles
const darkThemeStyles = `
  .dark-theme {
    background-color: #1a1a1a; /* Dark background */
    color: #e0e0e0; /* Light text color */
  }

  .dark-theme h1, .dark-theme h3, .dark-theme h4 {
    color: #ffffff; /* White color for headings */
  }

  .dark-theme .text-gray-300 {
    color: #b0b0b0; /* Slightly lighter gray for secondary text */
  }
`;

const CollaborativeEditor = ({ roomId, language = 'cpp', username }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('// Write your code here...\n');
  const [isLoading, setIsLoading] = useState(false);
  const isRemoteChange = useRef(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code', 'ai', or 'responses'
  const [aiResponses, setAiResponses] = useState([]);// array to store the responses from the AI 
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languages = [
    { id: 'cpp', name: 'C++' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' }
  ];

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

  const handleAskAI = async () => { // get ai response from the backend
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      if (data.analysis) {
        // Add the response to the history
        setAiResponses(prev => [...prev, {     // spread operator so no new array is formed inside an array
          timestamp: new Date().toLocaleString(),
          code: code, // Store the code that was analyzed
          analysis: data.analysis // Store the AI's analysis
        }]);
        // Remove the lines below to prevent updating the code editor
        // setCode(data.analysis);
        // socket.emit('code_change', { room: roomId, newCode: data.analysis });
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'code':
        return (
          <div className="w-full h-full">
            <Editor
              height="100%"
              defaultLanguage={selectedLanguage}
              language={selectedLanguage}
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
        );
      case 'ai':
        return (
          <div className="w-full h-full p-4 bg-[#1a1a1a] text-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Ask AI for Help</h3>
              <p className="text-gray-300 mb-4">Get AI assistance with your code. The AI can help with:</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 ">
                <li>Code explanation</li>
                <li>Code optimization</li>
                <li>Space and time complexity analysis</li>
                
              </ul>
              <button
                onClick={handleAskAI}
                disabled={isLoading}
                className="px-4 py-2 bg-black border-gray-500 text-white rounded hover:bg-gray-600 hover:cursor-pointer disabled:bg-blue-400"
              >
                {isLoading ? 'Analyzing...' : 'Ask AI'}
              </button>
            </div>
          </div>
        );
      case 'responses':
        return (
          <div className="w-full h-full bg-[#1a1a1a] text-white flex flex-col">
            
            <div className="flex-1 overflow-y-auto p-4">
              {aiResponses.length === 0 ? (
                <p className="text-gray-300">No previous responses yet.</p>
              ) : (
                <div className="space-y-4">
                  {aiResponses.map((response, index) => (
                    <div key={index} className="bg-[#2d2d2d] rounded-lg p-4 break-words">
                      <div className="text-sm text-gray-400 mb-2">{response.timestamp}</div>
                      <div className="mb-2">
                        <h4 className="font-medium mb-1">Original Code:</h4>
                        <pre className="bg-[#1a1a1a] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">{response.code}</pre>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">AI Analysis:</h4>
                        <div className="bg-[#1a1a1a] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                          <ReactMarkdown>{response.analysis}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden dark-theme">
      <style>{scrollbarStyles}</style>
      <style>{darkThemeStyles}</style>
      {/* Top Bar */}
      <div className="h-12 bg-[#2d2d2d] border-b border-[#3c4043] flex items-center justify-between px-4">
        <h1 className="text-white text-lg font-medium">Collaborative Editor</h1>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left Half - Code Editor and Tabs */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r  flex flex-col">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 hover:cursor-pointer py-2 text-sm font-medium hover:bg-gray-700 rounded-sm ${
                activeTab === 'code'
                  ? 'text-white border-b-2 border-gray-300 '
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Code Editor
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 hover:cursor-pointer text-sm font-medium hover:bg-gray-700 rounded-sm ${
                activeTab === 'ai'
                  ? 'text-white border-b-2 border-gray-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Ask AI
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`px-4 py-2 hover:cursor-pointer text-sm font-medium hover:bg-gray-700 rounded-sm ${
                activeTab === 'responses'
                  ? 'text-white border-b-2 border-gray-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Previous Responses
            </button>
            <div className="flex items-center  ml-4 text-sm font-medium  ">
          <div className='flex gap-3 '>
            <h3 className='text-gray-400 p-2'>Select Language</h3>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#1a1a1a] text-white px-3 py-1 rounded border border-[#3c4043] focus:outline-none focus:border-gray-800 "
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          </div>
        </div>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            {renderTabContent()}
          </div>
        </div>

        {/* Right Half - Video Chat and Chat */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col">
          {/* Video Chat Section */}
          <div className="h-[60%] lg:h-[50%] sm:h-[30%] border-b border-[#3c4043] sm:gap-2 sm:p-2">
            <VideoChat roomId={roomId} />
          </div>
          
          {/* Chat Section */}
          <div className="h-[40%] lg:h-[50%]">
            <Chat roomId={roomId} username={username} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor; 