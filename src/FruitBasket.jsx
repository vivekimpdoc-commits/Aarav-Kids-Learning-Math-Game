import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const FRUITS = [
  { name: 'Apple', icon: '🍎', color: '#ef4444' },
  { name: 'Orange', icon: '🍊', color: '#f97316' },
  { name: 'Grape', icon: '🍇', color: '#8b5cf6' },
  { name: 'Banana', icon: '🍌', color: '#eab308' },
  { name: 'Strawberry', icon: '🍓', color: '#f43f5e' }
];

const FruitBasket = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [currentFruit, setCurrentFruit] = useState(FRUITS[0]);
  const [userInput, setUserInput] = useState('');
  const [isFalling, setIsFalling] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Wait for the fruits to fall!');
  const [basketFruits, setBasketFruits] = useState([]);
  const [fallingFruits, setFallingFruits] = useState([]);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'levelclear', 'victory'
  const inputRef = useRef(null);

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    // Difficulty increases with level
    const maxVal = Math.min(10, 3 + Math.floor(level / 5));
    const a = Math.floor(Math.random() * maxVal) + 1;
    const b = Math.floor(Math.random() * (maxVal - 2)) + 1;
    const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    
    setNum1(a);
    setNum2(b);
    setCurrentFruit(fruit);
    setUserInput('');
    setStatus('Count the total fruits!');
    setIsFalling(true);
    
    // Setup fruits
    setBasketFruits(Array(a).fill(fruit.icon));
    setFallingFruits(Array(b).fill(fruit.icon));

    setTimeout(() => {
      setIsFalling(false);
      setBasketFruits(prev => [...prev, ...Array(b).fill(fruit.icon)]);
      setFallingFruits([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 2000);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    const ans = parseInt(userInput);
    if (ans === num1 + num2) {
      setScore(s => s + 10);
      setStatus('🌈 BRAVO! Correct Addition!');
      const speech = new SpeechSynthesisUtterance("Great job! " + (num1 + num2));
      window.speechSynthesis.speak(speech);
      if (level === 50) {
        setGameState('victory');
      } else {
        setGameState('levelclear');
      }
    } else {
      setStatus('❌ Try counting again!');
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
    <div className="game-container garden-bg" style={{background: 'linear-gradient(#87ceeb, #90ee90)'}}>
      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(21, 128, 61, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>👑 FRUIT KING!</h1>
          <p style={{fontSize: '2rem'}}>Aarav, you conquered all 50 levels!</p>
          <button className="restart-btn" onClick={restartGame}>NEW GARDEN</button>
        </div>
      )}

      {gameState === 'levelclear' && (
        <div className="overlay" style={{background: 'rgba(56, 189, 248, 0.9)'}}>
          <h1 className="victory-text" style={{color: 'white'}}>LEVEL {level} CLEAR!</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>More fruits are ripening...</p>
          <button className="restart-btn" onClick={nextLevel}>NEXT LEVEL</button>
        </div>
      )}

      <div className="score-board" style={{top: '2rem'}}>SCORE: {score} | LEVEL: {level}</div>
      
      <h1 className="menu-title" style={{color: '#15803d', textShadow: '2px 2px 0 white', fontSize: '3rem'}}>Fruit Basket Addition</h1>

      <div className="garden-area">
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>

        <div className="addition-display">
          <span className="math-text">{num1}</span>
          <span className="math-text" style={{color: '#ef4444'}}>+</span>
          <span className="math-text">{num2}</span>
          <span className="math-text">=</span>
          <span className="math-text">?</span>
        </div>

        <div className="tree-section">
          {isFalling && (
            <div className="falling-fruits">
              {fallingFruits.map((f, i) => (
                <div key={i} className="fruit drop-anim" style={{animationDelay: `${i * 0.2}s`}}>{f}</div>
              ))}
            </div>
          )}
        </div>

        <div className="basket-container">
          <div className="basket">🧺</div>
          <div className="fruits-in-basket">
            {basketFruits.map((f, i) => (
              <div key={i} className="basket-fruit">{f}</div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={checkAnswer} className="input-section">
        <input 
          ref={inputRef}
          type="number" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Total?"
          className="answer-input"
          style={{background: 'white', color: '#15803d', border: '4px solid #15803d'}}
          autoFocus
        />
        <button type="submit" className="submit-btn" style={{background: '#15803d'}}>CHECK</button>
      </form>

      <div className="status-bar" style={{color: '#15803d', background: 'rgba(255,255,255,0.5)', padding: '0.5rem 2rem', borderRadius: '50px'}}>{status}</div>
    </div>
  );
};

export default FruitBasket;
