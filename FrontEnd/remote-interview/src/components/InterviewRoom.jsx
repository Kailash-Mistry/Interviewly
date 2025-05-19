import React from 'react';
import CollaborativeEditor from './CollaborativeEditor';

const InterviewRoom = ({ roomId }) => {
  return (
    <div>
      <h2>Live Coding Interview Room</h2>
      <CollaborativeEditor roomId={roomId} language="cpp" />
    </div>
  );
};

export default InterviewRoom;