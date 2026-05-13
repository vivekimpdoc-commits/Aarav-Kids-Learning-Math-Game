import React, { useState, useEffect } from 'react';
import './index.css';

const KangarooJump = () => {
  const [startPos, setStartPos] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const [targetPos, setTargetPos] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Wait for the mission!');
  const [isJumping, setIsJumping] = useState(false);
  const [stepsTaken, setStepsTaken] = useState(0);

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const start = Math.floor(Math.random() * 5); // 0 to 4
    const jump = Math.floor(Math.random() * 5) + 1; // 1 to 5
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
          setTimeout(generateNewRound, 2000);
        } else {
          setStatus(`Good! ${jumpCount - (stepsTaken + 1)} more steps to go!`);
        }
      }, 600);
    } else {
      setStatus('❌ That is not the next step! Try jumping to the next number.');
    }
  };

  return (
    <div className="game-container outback-bg" style={{background: 'linear-gradient(#fcd34d, #fb923c)'}}>
      <div className="score-board" style={{top: '2rem', color: '#78350f'}}>SCORE: {score}</div>
      
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
            {[...Array(11).keys()].map(num => (
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
