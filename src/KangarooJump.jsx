import React, { useState, useEffect } from 'react';
import './index.css';

const KangarooJump = () => {
  const [startPos, setStartPos] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const [targetPos, setTargetPos] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'levelclear', 'victory'
  const [status, setStatus] = useState('Wait for the mission!');
  const [isJumping, setIsJumping] = useState(false);
  const [stepsTaken, setStepsTaken] = useState(0);

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const maxStart = Math.min(15, 3 + Math.floor(level / 5));
    const maxJump = Math.min(10, 2 + Math.floor(level / 8));
    const start = Math.floor(Math.random() * maxStart); 
    const jump = Math.floor(Math.random() * maxJump) + 1; 
    setStartPos(start);
    setJumpCount(jump);
    setCurrentPos(start);
    setTargetPos(start + jump);
    setStepsTaken(0);
    setIsJumping(false);
    setStatus(`Kangaroo is at ${start}. Jump +${jump} steps!`);
  };

  const handleLineClick = (num) => {
    if (isJumping || stepsTaken >= jumpCount) return;

    if (num === currentPos + 1) {
      // Correct step
      setIsJumping(true);
      const nextPos = currentPos + 1;
      
      setTimeout(() => {
        setCurrentPos(nextPos);
        setStepsTaken(s => s + 1);
        setIsJumping(false);
        
        if (nextPos === targetPos) {
          setScore(s => s + 10);
          setStatus('🦘 AWESOME JUMP! Destination reached!');
          const speech = new SpeechSynthesisUtterance("Great jumps! You reached " + targetPos);
          window.speechSynthesis.speak(speech);
          if (level === 50) {
            setGameState('victory');
          } else {
            setGameState('levelclear');
          }
        } else {
          setStatus(`Good! ${jumpCount - (stepsTaken + 1)} more steps to go!`);
        }
      }, 600);
    } else {
      setStatus('❌ That is not the next step! Try jumping to the next number.');
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setGameState('playing');
    generateNewRound();
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('playing');
    generateNewRound();
  };

  return (
    <div className="game-container outback-bg" style={{background: 'linear-gradient(#fcd34d, #fb923c)'}}>
      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(120, 53, 15, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>🌏 WORLD TRAVELER!</h1>
          <p style={{fontSize: '2rem'}}>Aarav, you jumped through all 50 regions!</p>
          <button className="restart-btn" onClick={restartGame}>START OVER</button>
        </div>
      )}

      {gameState === 'levelclear' && (
        <div className="overlay" style={{background: 'rgba(249, 146, 60, 0.9)'}}>
          <h1 className="victory-text" style={{color: 'white'}}>LEVEL {level} CLEAR!</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>The next waterhole is far...</p>
          <button className="restart-btn" onClick={nextLevel}>NEXT LEVEL</button>
        </div>
      )}

      <div className="score-board" style={{top: '2rem', color: '#78350f'}}>SCORE: {score} | LEVEL: {level}</div>
      
      <h1 className="menu-title" style={{color: '#78350f', textShadow: '2px 2px 0 white', fontSize: '3.5rem'}}>Kangaroo Jump Addition</h1>

      <div className="outback-area">
        <div className="mission-box">
          <span className="mission-text">{startPos}</span>
          <span className="mission-text" style={{color: '#ef4444'}}> + </span>
          <span className="mission-text">{jumpCount}</span>
          <span className="mission-text"> = </span>
          <span className="mission-text">?</span>
        </div>

        <div className="number-line-container">
          <div className="kangaroo" style={{ 
            left: `${(currentPos * 80) + 40}px`,
            transform: `translateX(-50%) ${isJumping ? 'translateY(-100px) rotate(-10deg)' : 'translateY(0)'}`
          }}>
            🦘
          </div>
          
          <div className="number-line">
            {[...Array(targetPos + 3).keys()].map(num => (
              <div 
                key={num} 
                className={`line-point ${num === currentPos ? 'active' : ''} ${num === targetPos ? 'target' : ''}`}
                onClick={() => handleLineClick(num)}
              >
                <div className="point-dot"></div>
                <span className="point-label">{num}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="status-bar" style={{color: '#78350f', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 2rem', borderRadius: '50px'}}>{status}</div>
    </div>
  );
};

export default KangarooJump;
