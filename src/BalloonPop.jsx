import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const BALLOON_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const BalloonPop = () => {
  const [totalBalloons, setTotalBalloons] = useState(0);
  const [popCount, setPopCount] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Watch the balloons pop!');
  const [isPopping, setIsPopping] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const total = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const toPop = Math.floor(Math.random() * (total - 1)) + 1; // At least 1 pops
    
    setTotalBalloons(total);
    setPopCount(toPop);
    setUserInput('');
    setIsPopping(true);
    setStatus('AI is popping balloons...');

    // Initialize balloons
    const newBalloons = Array.from({ length: total }, (_, i) => ({
      id: i,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      isPopped: false,
      isPopping: false
    }));
    setBalloons(newBalloons);

    // AI Popping Sequence
    setTimeout(() => {
      let poppedSoFar = 0;
      const interval = setInterval(() => {
        setBalloons(prev => {
          const next = [...prev];
          const unpopped = next.filter(b => !b.isPopped && !b.isPopping);
          if (unpopped.length > 0 && poppedSoFar < toPop) {
            const target = unpopped[Math.floor(Math.random() * unpopped.length)];
            target.isPopping = true;
            setTimeout(() => {
              setBalloons(curr => curr.map(b => b.id === target.id ? { ...b, isPopped: true, isPopping: false } : b));
            }, 500);
            poppedSoFar++;
            return next;
          } else {
            clearInterval(interval);
            setIsPopping(false);
            setStatus('How many balloons are left?');
            setTimeout(() => inputRef.current?.focus(), 100);
            return prev;
          }
        });
      }, 800);
    }, 1000);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (isPopping) return;
    
    const ans = parseInt(userInput);
    if (ans === totalBalloons - popCount) {
      setScore(s => s + 10);
      setStatus('🎈 FANTASTIC! Correct Subtraction! 🎈');
      setTimeout(generateNewRound, 2000);
    } else {
      setStatus('❌ Look closely! Count the ones still floating.');
    }
  };

  return (
    <div className="game-container sky-bg" style={{background: 'linear-gradient(#bae6fd, #e0f2fe)'}}>
      <div className="score-board" style={{top: '2rem', color: '#0369a1'}}>SCORE: {score}</div>
      
      <h1 className="menu-title" style={{color: '#0369a1', textShadow: '2px 2px 0 white', fontSize: '3.5rem'}}>Balloon Pop Subtraction</h1>

      <div className="sky-area">
        <div className="balloon-grid">
          {balloons.map((balloon) => (
            <div key={balloon.id} className="balloon-wrapper">
              {!balloon.isPopped ? (
                <div 
                  className={`balloon ${balloon.isPopping ? 'popping' : 'floating'}`}
                  style={{ 
                    backgroundColor: balloon.color,
                    boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.2), 0 0 20px ${balloon.color}44`
                  }}
                >
                  <div className="balloon-string"></div>
                </div>
              ) : (
                <div className="pop-effect">💥</div>
              )}
            </div>
          ))}
        </div>

        <div className="math-display-small">
          <span className="math-text-blue">{totalBalloons}</span>
          <span className="math-text-blue" style={{color: '#ef4444'}}> - </span>
          <span className="math-text-blue">{popCount}</span>
          <span className="math-text-blue"> = </span>
          <span className="math-text-blue">?</span>
        </div>
      </div>

      <form onSubmit={checkAnswer} className="input-section">
        <input 
          ref={inputRef}
          type="number" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Remaining?"
          className="answer-input"
          style={{background: 'white', color: '#0369a1', border: '4px solid #0369a1'}}
          disabled={isPopping}
        />
        <button type="submit" className="submit-btn" style={{background: '#0369a1'}}>CHECK</button>
      </form>

      <div className="status-bar" style={{color: '#0369a1', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 2rem', borderRadius: '50px'}}>{status}</div>
    </div>
  );
};

export default BalloonPop;
