import React, { useState, useEffect } from 'react';
import './index.css';

const BEADS = [
  { id: 'red', color: '#ef4444', icon: '🔴', type: 'color' },
  { id: 'blue', color: '#3b82f6', icon: '🔵', type: 'color' },
  { id: 'green', color: '#22c55e', icon: '🟢', type: 'color' },
  { id: 'yellow', color: '#eab308', icon: '🟡', type: 'color' },
  { id: 'star', color: '#f59e0b', icon: '⭐', type: 'shape' },
  { id: 'heart', color: '#ec4899', icon: '❤️', type: 'shape' },
  { id: 'diamond', color: '#a855f7', icon: '💎', type: 'shape' },
  { id: 'square', color: '#6366f1', icon: '🟦', type: 'shape' }
];

const MagicNecklace = () => {
  const [pattern, setPattern] = useState([]);
  const [nextBead, setNextBead] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'solved', 'victory'
  const [status, setStatus] = useState('What comes next?');

  useEffect(() => {
    generateNewPattern();
  }, [level]);

  const generateNewPattern = () => {
    const isShape = level > 15;
    const pool = isShape ? BEADS : BEADS.filter(b => b.type === 'color');
    
    // Pattern logic
    let sequence = [];
    const patternType = level % 3; // 0: ABAB, 1: ABCABC, 2: AABAAB
    
    const a = pool[Math.floor(Math.random() * pool.length)];
    let b = pool[Math.floor(Math.random() * pool.length)];
    while (b.id === a.id) b = pool[Math.floor(Math.random() * pool.length)];
    let c = pool[Math.floor(Math.random() * pool.length)];
    while (c.id === a.id || c.id === b.id) c = pool[Math.floor(Math.random() * pool.length)];

    if (patternType === 0) {
      sequence = [a, b, a, b, a];
      setNextBead(b);
    } else if (patternType === 1) {
      sequence = [a, b, c, a, b];
      setNextBead(c);
    } else {
      sequence = [a, a, b, a, a];
      setNextBead(b);
    }

    setPattern(sequence);
    
    // Generate 4 options
    let opts = [nextBead || b];
    while (opts.length < 4) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (!opts.find(o => o.id === rand.id)) opts.push(rand);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setStatus('Complete the magic necklace!');
  };

  const checkBead = (bead) => {
    if (gameState !== 'playing') return;

    if (bead.id === nextBead.id) {
      setScore(s => s + 10);
      setStatus('✨ BEAUTIFUL! The pattern is complete! ✨');
      const speech = new SpeechSynthesisUtterance("Great pattern matching!");
      window.speechSynthesis.speak(speech);
      
      if (level === 50) {
        setGameState('victory');
      } else {
        setGameState('solved');
      }
    } else {
      setStatus('❌ That does not fit the pattern. Try again!');
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setGameState('playing');
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('playing');
    generateNewPattern();
  };

  return (
    <div className="game-container jewelry-bg" style={{background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)'}}>
      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(162, 28, 175, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>✨ PATTERN GENIUS! ✨</h1>
          <p style={{fontSize: '2rem'}}>Aarav, you completed all 50 magic necklaces!</p>
          <button className="restart-btn" onClick={restartGame}>NEW JEWELS</button>
        </div>
      )}

      {gameState === 'solved' && (
        <div className="overlay" style={{background: 'rgba(217, 70, 239, 0.8)'}}>
          <h1 className="victory-text" style={{color: 'white'}}>PATTERN SOLVED! 💎</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>Ready for a harder one?</p>
          <button className="restart-btn" onClick={nextLevel}>NEXT LEVEL</button>
        </div>
      )}

      <div className="score-board" style={{top: '2rem', color: '#a21caf'}}>SCORE: {score} | LEVEL: {level}</div>
      
      <h1 className="menu-title" style={{color: '#a21caf', textShadow: '2px 2px 0 white', fontSize: '3.5rem'}}>Magic Necklace</h1>

      <div className="necklace-area">
        <div className="string"></div>
        <div className="bead-sequence">
          {pattern.map((bead, i) => (
            <div key={i} className="bead-item bounce-in" style={{background: bead.type === 'color' ? bead.color : 'transparent', animationDelay: `${i * 0.1}s`}}>
              {bead.icon}
            </div>
          ))}
          <div className="bead-item next-placeholder">?</div>
        </div>

        <div className="pattern-options">
          <p style={{color: '#a21caf', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem'}}>WHICH BEAD COMES NEXT?</p>
          <div className="opts-row">
            {options.map(bead => (
              <button key={bead.id} className="bead-btn" onClick={() => checkBead(bead)} style={{border: `4px solid ${bead.color}`}}>
                <span style={{fontSize: '3rem'}}>{bead.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="status-bar" style={{color: '#a21caf', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 2rem', borderRadius: '50px'}}>{status}</div>
    </div>
  );
};

export default MagicNecklace;
