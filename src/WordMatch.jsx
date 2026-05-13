import React, { useState, useEffect } from 'react';
import './index.css';

const NUMBER_NAMES = {
  1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR', 5: 'FIVE', 6: 'SIX', 7: 'SEVEN', 8: 'EIGHT', 9: 'NINE', 10: 'TEN',
  11: 'ELEVEN', 12: 'TWELVE', 13: 'THIRTEEN', 14: 'FOURTEEN', 15: 'FIFTEEN', 16: 'SIXTEEN', 17: 'SEVENTEEN', 18: 'EIGHTEEN', 19: 'NINETEEN', 20: 'TWENTY',
  21: 'TWENTY ONE', 22: 'TWENTY TWO', 23: 'TWENTY THREE', 24: 'TWENTY FOUR', 25: 'TWENTY FIVE', 30: 'THIRTY', 40: 'FORTY', 50: 'FIFTY'
};

const WordMatch = () => {
  const [targetNumber, setTargetNumber] = useState(1);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('Click "Listen" to start!');
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'levelclear', 'victory'

  useEffect(() => {
    generateNewChallenge();
  }, []);

  const generateNewChallenge = () => {
    const keys = Object.keys(NUMBER_NAMES);
    // Limit keys based on level
    const maxIndex = Math.min(keys.length, 5 + Math.floor(level * 1.5));
    const levelKeys = keys.slice(0, maxIndex);
    
    const correct = levelKeys[Math.floor(Math.random() * levelKeys.length)];
    setTargetNumber(correct);
    
    // Generate 4 options
    let opts = [correct];
    while (opts.length < 4) {
      const rand = keys[Math.floor(Math.random() * keys.length)];
      if (!opts.includes(rand)) opts.push(rand);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setStatus('Listen to the number and match!');
  };

  const speakNumber = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = NUMBER_NAMES[targetNumber];
    speech.rate = 0.8;
    speech.pitch = 1.2;
    window.speechSynthesis.speak(speech);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('Voice recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);
    setStatus('Listening... say the number!');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toUpperCase();
      console.log('Voice Input:', transcript);
      
      if (transcript.includes(NUMBER_NAMES[targetNumber]) || transcript.includes(targetNumber.toString())) {
        handleSuccess();
      } else {
        setStatus(`You said "${transcript}". Try again!`);
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setStatus('Voice error. Try clicking the cards!');
      setIsListening(false);
    };
  };

  const handleSuccess = () => {
    setScore(s => s + 10);
    setStatus('✨ CORRECT! PERFECT MATCH! ✨');
    const speech = new SpeechSynthesisUtterance();
    speech.text = "Excellent! " + NUMBER_NAMES[targetNumber];
    window.speechSynthesis.speak(speech);

    if (level === 50) {
      setGameState('victory');
    } else {
      setGameState('levelclear');
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setGameState('playing');
    generateNewChallenge();
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('playing');
    generateNewChallenge();
  };

  const checkMatch = (num) => {
    if (num.toString() === targetNumber.toString()) {
      handleSuccess();
    } else {
      setStatus('Oops! Try another one.');
    }
  };

  return (
    <div className="game-container menu-bg" style={{background: 'linear-gradient(135deg, #1e1b4b, #312e81)'}}>
      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(30, 27, 75, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>🗣️ LINGUIST GENIUS!</h1>
          <p style={{fontSize: '2rem'}}>Aarav, you mastered all 50 vocabulary levels!</p>
          <button className="restart-btn" onClick={restartGame}>NEW JOURNEY</button>
        </div>
      )}

      {gameState === 'levelclear' && (
        <div className="overlay" style={{background: 'rgba(99, 102, 241, 0.9)'}}>
          <h1 className="victory-text" style={{color: 'white'}}>LEVEL {level} CLEAR!</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>You are speaking beautifully!</p>
          <button className="restart-btn" onClick={nextLevel}>NEXT LEVEL</button>
        </div>
      )}

      <div className="word-match-header">
        <h1 className="menu-title" style={{fontSize: '3.5rem', marginBottom: '1rem'}}>Word Match Master</h1>
        <div className="score-board">SCORE: {score} | LEVEL: {level}</div>
      </div>

      <div className="main-challenge">
        <div className="speaker-section" onClick={speakNumber}>
          <div className="speaker-icon">🔊</div>
          <p>Click to Listen</p>
        </div>

        <div className="voice-section">
          <button 
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={startVoiceRecognition}
          >
            {isListening ? '🛑 LISTENING...' : '🎤 SPEAK ANSWER'}
          </button>
        </div>
      </div>

      <div className="options-grid">
        {options.map(num => (
          <div key={num} className="match-card" onClick={() => checkMatch(num)}>
            <div className="card-num">{num}</div>
            <div className="card-name">{NUMBER_NAMES[num]}</div>
          </div>
        ))}
      </div>

      <div className="status-bar">{status}</div>
    </div>
  );
};

export default WordMatch;
