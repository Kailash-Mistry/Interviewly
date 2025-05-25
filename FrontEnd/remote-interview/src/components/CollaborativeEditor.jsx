import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { socket } from '../socket';
import VideoChat from './VideoChat';
import Chat from './Chat';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { toast } from 'react-toastify';

// Add custom scrollbar styles
const scrollbarStyles = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 10px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #111b21;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #202c33;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #005c4b;
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #202c33 #111b21;
  }
`;

// Basic dark theme styles
const darkThemeStyles = `
  .dark-theme {
    background-color: #111b21;
    color: #e0e0e0;
  }

  .dark-theme h1, .dark-theme h3, .dark-theme h4 {
    color: #ffffff;
  }

  .dark-theme .text-gray-300 {
    color: #b0b0b0;
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
  const [isInterviewer, setIsInterviewer] = useState(false);
  const { currentUser } = useAuth();
  
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
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Copied to clipboard!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
      });
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsInterviewer(userData.userType === 'interviewer');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      }
    };

    checkUserRole();
  }, [currentUser]);

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

  const handleAskAI = async () => {
    if (!isInterviewer) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      if (data.analysis) {
        setAiResponses(prev => [...prev, {
          timestamp: new Date().toLocaleString(),
          code: code,
          analysis: data.analysis
        }]);
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
        if (!isInterviewer) {
          return (
            <div className="w-full h-full p-4 bg-[#111b21] text-white flex items-center justify-center">
              <p className="text-[#e9edef]">This feature is only available to interviewers.</p>
            </div>
          );
        }
        return (
          <div className="w-full h-full p-4 bg-[#111b21] text-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Ask AI for Help</h3>
              <p className="text-[#e9edef] mb-4 hidden sm:block">Get AI assistance with your code. The AI can help with:</p>
              <ul className="list-disc list-inside text-[#e9edef] mb-4  hidden sm:block">
                <li>Code explanation</li>
                <li>Code optimization</li>
                <li>Space and time complexity analysis</li>
              </ul>
              <button
                onClick={handleAskAI}
                disabled={isLoading}
                className="px-4 py-2 bg-[#005c4b] text-white rounded hover:bg-[#006d5b] transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Analyzing...' : 'Ask AI'}
              </button>
            </div>
          </div>
        );
      case 'responses':
        if (!isInterviewer) {
          return (
            <div className="w-full h-full p-4 bg-[#111b21] text-white flex items-center justify-center">
              <p className="text-[#e9edef]">This feature is only available to interviewers.</p>
            </div>
          );
        }
        return (
          <div className="w-full h-full bg-[#111b21] text-white flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {aiResponses.length === 0 ? (
                <p className="text-[#e9edef]">No previous responses yet.</p>
              ) : (
                <div className="space-y-4">
                  {aiResponses.map((response, index) => (
                    <div key={index} className="bg-[#202c33] rounded-lg p-4 break-words">
                      <div className="text-sm text-gray-400 mb-2">{response.timestamp}</div>
                      <div className="mb-2">
                        <h4 className="font-medium mb-1 text-[#e9edef]">Original Code:</h4>
                        <pre className="bg-[#111b21] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap text-[#e9edef]">{response.code}</pre>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 text-[#e9edef]">AI Analysis:</h4>
                        <div className="bg-[#111b21] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap text-[#e9edef]">
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
      <div className="h-12 bg-[#202c33] flex items-center justify-between px-4">
      <button 
            
            className="flex-shrink-0 text-xl font-bold text-blue-500 hover:cursor-pointer">
              Interviewly
        </button>
        <button
        onClick={copyToClipboard}
         className='bg-[#005c4b] px-2 py-1 rounded-xl font-bold text-sm hover:cursor-pointer'>
          Room ID
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left Half - Code Editor and Tabs */}
        <div className="w-full lg:w-1/2 h-[33vh] lg:h-full flex flex-col">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#111b21] p-1 border-[#202c33] border-r-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 hover:cursor-pointer py-2 text-sm font-medium hover:bg-[#005c4b] rounded-sm ${
                activeTab === 'code'
                  ? 'text-white bg-[#005c4b]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Code Editor
            </button>
            {isInterviewer && (
              <>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-4 py-2 hover:cursor-pointer text-sm font-medium hover:bg-[#005c4b] rounded-sm ${
                    activeTab === 'ai'
                      ? 'text-white bg-[#005c4b]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ask AI
                </button>
                <button
                  onClick={() => setActiveTab('responses')}
                  className={`px-4 py-2 hover:cursor-pointer text-sm font-medium hover:bg-[#005c4b] rounded-sm ${
                    activeTab === 'responses'
                      ? 'text-white bg-[#005c4b]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Previous Responses
                </button>
              </>
            )}
            <div className="flex items-center ml-4 text-sm font-medium">
              <div className='flex flex-wrap gap-3'>
                <h3 className='text-gray-400 p-2'>Select Language</h3>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#111b21] text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#005c4b]"
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
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Video Chat Section */}
          <div className="h-[33vh] lg:h-[50%]">
            <VideoChat roomId={roomId} />
          </div>
          
          {/* Chat Section */}
          <div className="h-[33vh] lg:h-[50%]">
            <Chat roomId={roomId} username={username} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;