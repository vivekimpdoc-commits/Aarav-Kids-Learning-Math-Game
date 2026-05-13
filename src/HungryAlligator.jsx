import React, { useState, useEffect } from 'react';
import './swamp.css';
import alligatorImg from './assets/alligator.png';
import monster1 from './assets/monster_boss.png';
import monster2 from './assets/monster_dragon.png';

const HungryAlligator = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [eating, setEating] = useState(null); // 'left', 'right', 'middle'
  const [gameState, setGameState] = useState('playing'); // 'playing', 'clear'
  const [alligatorStyle, setAlligatorStyle] = useState({});
  const [currentImg, setCurrentImg] = useState(alligatorImg);
  const [errorStats, setErrorStats] = useState({}); // Tracking errors: { "11-19": 5, "21-12": 2 }
  const [aiFocus, setAiFocus] = useState(null);

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    let a, b;
    
    // Simple AI Logic: Check for high-error patterns
    const troubledPairs = Object.entries(errorStats)
      .filter(([_, count]) => count > 2)
      .sort((a, b) => b[1] - a[1]);

    if (troubledPairs.length > 0 && Math.random() > 0.4) {
      // Focus on a troubled pair
      const pair = troubledPairs[0][0].split('-').map(Number);
      a = pair[0];
      b = pair[1];
      setAiFocus(`Focusing on confused numbers: ${a} & ${b}`);
    } else {
      // Standard generation based on level
      const range = 20 + level * 2;
      a = Math.floor(Math.random() * range) + 1;
      b = Math.floor(Math.random() * range) + 1;
      
      // Occasionally force similar looking numbers (like 11 and 19, or 12 and 21)
      if (Math.random() > 0.7) {
        const triggers = [[11, 19], [12, 21], [15, 51], [13, 31], [6, 9], [16, 19]];
        const trigger = triggers[Math.floor(Math.random() * triggers.length)];
        a = trigger[0];
        b = trigger[1];
      }
      setAiFocus(null);
    }

    // Shuffle positions
    if (Math.random() > 0.5) {
      setNum1(a);
      setNum2(b);
    } else {
      setNum1(b);
      setNum2(a);
    }
    setEating(null);
  };

  const checkAnswer = (choice) => {
    if (eating) return;

    const correctSymbol = num1 > num2 ? '>' : num1 < num2 ? '<' : '=';
    const isCorrect = choice === correctSymbol;

    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setEating(num1 >= num2 ? 'left' : 'right');
      setAlligatorStyle({ filter: `hue-rotate(${Math.random() * 360}deg)`, transform: 'scale(1.2) translateY(-20px)' });
      
      // Change the hungry character image!
      const images = [alligatorImg, monster1, monster2];
      setCurrentImg(images[Math.floor(Math.random() * images.length)]);
      
      // Level upEvery 3 correct answers
      if ((streak + 1) % 3 === 0) {
        if (level === 100) {
          setGameState('clear');
        } else {
          setLevel(l => l + 1);
        }
      }

      setTimeout(() => {
        if (gameState === 'playing') {
          generateProblem();
          setAlligatorStyle({});
        }
      }, 1000);
    } else {
      // Update Error Stats for AI
      const pairKey = [num1, num2].sort().join('-');
      setErrorStats(prev => ({
        ...prev,
        [pairKey]: (prev[pairKey] || 0) + 1
      }));
      
      setStreak(0);
      setEating('middle'); // Sad alligator
      
      setTimeout(() => {
        setEating(null);
      }, 1000);
    }
  };

  return (
    <div className="swamp-container">
      <div className="swamp-overlay" />
      
      {gameState === 'clear' && (
        <div className="overlay" style={{background: 'rgba(22, 101, 52, 0.95)'}}>
          <h1 className="victory-text" style={{fontSize: '6rem'}}>🐊 ALLIGATOR KING!</h1>
          <p style={{marginBottom: '2rem', fontSize: '2rem', color: 'white'}}>You've mastered 100 levels of comparison!</p>
          <button className="restart-btn" onClick={() => { setLevel(1); setScore(0); setStreak(0); setGameState('playing'); generateProblem(); }}>START NEW JOURNEY</button>
        </div>
      )}

      {aiFocus && <div className="ai-tag">🤖 AI ENGINE: {aiFocus}</div>}

      <div className="score-board">
        <span>LEVEL: {level}</span>
        <span>SCORE: {score}</span>
        <span>STREAK: {streak} 🔥</span>
      </div>

      <div className="arena">
        <div className="lily-pad" onClick={() => checkAnswer('>')}>
          {num1}
        </div>

        <div className={`alligator-container ${eating === 'left' ? 'alligator-eat-left' : eating === 'right' ? 'alligator-eat-right' : ''}`} style={alligatorStyle}>
          <img 
            src={currentImg} 
            alt="Hungry Friend" 
            className="alligator-img" 
            style={{ 
              transform: eating === 'middle' ? 'scale(0.8) rotate(10deg)' : 'none',
              filter: eating === 'middle' ? 'grayscale(1) sepia(1)' : 'none'
            }}
          />
        </div>

        <div className="lily-pad" onClick={() => checkAnswer('<')}>
          {num2}
        </div>
      </div>

      <div className="choice-buttons">
        <button className="choice-btn" onClick={() => checkAnswer('>')}>{`>`}</button>
        <button className="choice-btn" onClick={() => checkAnswer('=')}>{`=`}</button>
        <button className="choice-btn" onClick={() => checkAnswer('<')}>{`<`}</button>
      </div>

      <p style={{ color: 'white', zIndex: 10, fontSize: '1.2rem' }}>
        The Alligator always wants to eat the <strong>LARGER</strong> number!
      </p>
    </div>
  );
};

export default HungryAlligator;
