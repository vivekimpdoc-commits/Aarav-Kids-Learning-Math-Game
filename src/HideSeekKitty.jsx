import React, { useState, useEffect } from 'react';
import './index.css';

const POSITIONS = [
  { id: 'under', label: 'UNDER THE TABLE', icon: '🪑' },
  { id: 'inside', label: 'INSIDE THE BOX', icon: '📦' },
  { id: 'top', label: 'TOP OF THE TABLE', icon: '🪑' },
  { id: 'near', label: 'NEAR THE BOX', icon: '📦' },
  { id: 'behind', label: 'BEHIND THE CURTAIN', icon: '🎭' }
];

const HideSeekKitty = () => {
  const [targetPos, setTargetPos] = useState(POSITIONS[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'found', 'victory'
  const [status, setStatus] = useState('Where is the kitty?');
  const [kittyVisible, setKittyVisible] = useState(false);

  useEffect(() => {
    generateNewRound();
  }, [level]);

  const generateNewRound = () => {
    const correct = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    setTargetPos(correct);
    setKittyVisible(false);
    
    let opts = [correct];
    while (opts.length < 3) {
      const rand = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
      if (!opts.find(o => o.id === rand.id)) opts.push(rand);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setStatus('The kitty is hiding... can you find her?');
  };

  const checkPosition = (pos) => {
    if (gameState !== 'playing') return;

    if (pos.id === targetPos.id) {
      setKittyVisible(true);
      setScore(s => s + 10);
      setStatus(`✨ YES! The kitty was ${pos.label}! ✨`);
      const speech = new SpeechSynthesisUtterance("You found her! She was " + pos.label);
      window.speechSynthesis.speak(speech);

      if (level === 50) {
        setGameState('victory');
      } else {
        setGameState('found');
      }
    } else {
      setStatus('❌ Nope, she is not there! Look again.');
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
    generateNewRound();
  };

  return (
    <div className="game-container room-bg" style={{background: 'linear-gradient(#fecaca, #f9a8d4)'}}>
      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(190, 24, 93, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>🐱 KITTY MASTER!</h1>
          <p style={{fontSize: '2rem'}}>Aarav, you found the kitty in all 50 hiding spots!</p>
          <button className="restart-btn" onClick={restartGame}>PLAY AGAIN</button>
        </div>
      )}

      {gameState === 'found' && (
        <div className="overlay" style={{background: 'rgba(236, 72, 153, 0.8)'}}>
          <h1 className="victory-text" style={{color: 'white'}}>FOUND HER! 🐱</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>She is hiding somewhere else now...</p>
          <button className="restart-btn" onClick={nextLevel}>NEXT LEVEL</button>
        </div>
      )}

      <div className="score-board" style={{top: '2rem', color: '#be185d'}}>SCORE: {score} | LEVEL: {level}</div>
      
      <h1 className="menu-title" style={{color: '#be185d', textShadow: '2px 2px 0 white', fontSize: '3rem'}}>Hide & Seek Kitty</h1>

      <div className="scene-area">
        <div className="room-setup">
          {/* Table */}
          <div className="item-container table-pos">
            <div className="table-top">🪑</div>
            {targetPos.id === 'under' && kittyVisible && <div className="kitty-entity">🐱</div>}
            {targetPos.id === 'top' && kittyVisible && <div className="kitty-entity top-kitty">🐱</div>}
          </div>

          {/* Box */}
          <div className="item-container box-pos">
            <div className="box-body">📦</div>
            {targetPos.id === 'inside' && kittyVisible && <div className="kitty-entity inside-kitty">🐱</div>}
            {targetPos.id === 'near' && kittyVisible && <div className="kitty-entity near-kitty">🐱</div>}
          </div>

          {/* Curtain */}
          <div className="item-container curtain-pos">
            <div className="curtain">🎭</div>
            {targetPos.id === 'behind' && kittyVisible && <div className="kitty-entity behind-kitty">🐱</div>}
          </div>
        </div>

        <div className="position-options">
          <p style={{color: '#be185d', fontWeight: 'bold', fontSize: '1.2rem'}}>WHERE IS THE KITTY?</p>
          <div className="opts-row">
            {options.map(pos => (
              <button key={pos.id} className="pos-btn" onClick={() => checkPosition(pos)}>
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="status-bar" style={{color: '#be185d', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 2rem', borderRadius: '50px'}}>{status}</div>
    </div>
  );
};

export default HideSeekKitty;
