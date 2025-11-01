import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="App">
          <ChatInterface />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
