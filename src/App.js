// src/App.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Import the backend
import MusicPlayer from './MusicPlayer';

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}> {/* Wrap your app with DndProvider */}

        <MusicPlayer />
      </DndProvider>
    </div>
  );
}

export default App;
