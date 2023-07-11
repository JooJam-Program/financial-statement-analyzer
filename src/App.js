import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='appTitle'>Financial Statements Miner</div>
      </header>
      <FileUploader />
    </div>
  );
}

export default App;
