import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const SpaceRace = () => {
  const [playerPos, setPlayerPos] = useState(0);
  const [enemyPos, setEnemyPos] = useState(0);
  const [question, setQuestion] = useState({ q: '2 + 2', a: 4 });
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'victory', 'gameover', 'levelclear'
  const [difficulty, setDifficulty] = useState(1); // AI adaptive difficulty
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [speedMode, setSpeedMode] = useState('Normal'); // 'Normal', 'Fast', 'Super'
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const enemyTimerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      startTimer();
      startEnemyAI();
      generateQuestion();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clearInterval(timerRef.current);
      clearInterval(enemyTimerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(enemyTimerRef.current);
    };
  }, [gameState, isPaused]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startEnemyAI = () => {
    const speedMultiplier = speedMode === 'Fast' ? 1.2 : speedMode === 'Super' ? 1.8 : 0.7; // Slowed down significantly
    enemyTimerRef.current = setInterval(() => {
      setEnemyPos(prev => {
        // AI speed increases with level, difficulty and speed mode
        // Base speed reduced from 0.3 to 0.15
        const speed = (0.15 + (level * 0.03)) * difficulty * speedMultiplier;
        const next = prev + speed;
        if (next >= 100) {
          setGameState('gameover');
          return 100;
        }
        return next;
      });
    }, 100);
  };

  const generateQuestion = () => {
    const ops = ['+', '-'];
    if (score > 50) ops.push('*');
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;

    if (op === '+') {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 20) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 5) + 1;
      ans = a * b;
    }
    setQuestion({ q: `${a} ${op} ${b}`, a: ans });
    setUserInput('');
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (parseInt(userInput) === question.a) {
      setScore(s => s + 10);
      setPlayerPos(prev => {
        const next = prev + 10;
        if (next >= 100) {
          if (level === 50) {
            setGameState('victory');
          } else {
            setGameState('levelclear');
          }
        }
        return next;
      });
      // AI Adaptive: Increase difficulty if player is fast
      setDifficulty(d => d + 0.1);
      generateQuestion();
    } else {
      // Penalty: Slow down player or speed up enemy
      setEnemyPos(prev => Math.min(100, prev + 5));
    }
  };

  const startGame = () => {
    setPlayerPos(0);
    setEnemyPos(0);
    setScore(0);
    setLevel(1);
    setTimeLeft(180);
    setElapsedTime(0);
    setDifficulty(1);
    setIsPaused(false);
    setGameState('playing');
  };

  const nextLevel = () => {
    setPlayerPos(0);
    setEnemyPos(0);
    setLevel(l => l + 1);
    // Adjusted time decrease: Start with 180, minus 2 seconds per level, minimum 60
    setTimeLeft(Math.max(60, 180 - (level * 2)));
    setIsPaused(false);
    setGameState('playing');
  };

  return (
    <div className="game-container space-bg" style={{background: '#020617', overflow: 'hidden'}}>
      <div className="stars"></div>
      
      {gameState === 'menu' && (
        <div className="overlay" style={{background: 'rgba(2, 6, 23, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem', color: '#38bdf8'}}>🚀 SPACE RACE</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Solve math to BOOST your rocket!</p>
          
          <div className="speed-selector" style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
            {['Normal', 'Fast', 'Super'].map(mode => (
              <button 
                key={mode}
                className={`speed-btn ${speedMode === mode ? 'active' : ''}`}
                onClick={() => setSpeedMode(mode)}
                style={{
                  background: speedMode === mode ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  padding: '0.5rem 1.5rem', borderRadius: '10px', color: 'white', border: 'none', cursor: 'pointer'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <button className="restart-btn" onClick={startGame}>START ENGINES</button>
        </div>
      )}

      {isPaused && (
        <div className="overlay" style={{background: 'rgba(15, 23, 42, 0.8)', zIndex: 500}}>
          <h1 className="victory-text" style={{color: '#fbbf24'}}>MISSION PAUSED</h1>
          <button className="restart-btn" onClick={() => setIsPaused(false)}>RESUME MISSION</button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(22, 163, 74, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>👑 GALAXY CHAMPION!</h1>
          <p style={{fontSize: '2rem'}}>You won all 50 Space Races!</p>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>Final Score: {score}</p>
          <button className="restart-btn" onClick={startGame}>START NEW ERA</button>
        </div>
      )}

      {gameState === 'levelclear' && (
        <div className="overlay" style={{background: 'rgba(56, 189, 248, 0.9)'}}>
          <h1 className="victory-text" style={{color: 'white'}}>LEVEL {level} CLEAR!</h1>
          <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>Prepare for the next jump...</p>
          <button className="restart-btn" onClick={nextLevel}>NEXT RACE</button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="overlay" style={{background: 'rgba(220, 38, 38, 0.9)'}}>
          <h1 className="victory-text">💥 CRASHED!</h1>
          <p style={{fontSize: '2rem'}}>The enemy beat you to Mars.</p>
          <button className="restart-btn" onClick={startGame}>RETRY MISSION</button>
        </div>
      )}

      <div className="race-track">
        <div className="track-line player-track">
          <div className="ship player-ship" style={{ left: `${playerPos}%` }}>
            <div className="thrust">🔥</div>
            🚀
            <span className="ship-label">YOU</span>
          </div>
        </div>
        <div className="track-line enemy-track">
          <div className="ship enemy-ship" style={{ left: `${enemyPos}%` }}>
            🛸
            <span className="ship-label">ENEMY</span>
          </div>
        </div>
        <div className="finish-line">FINISH</div>
      </div>

      <div className="space-hud">
        <div className="hud-item" style={{color: '#fbbf24'}}>LEVEL: {level}</div>
        <div className="hud-item">TIME: {timeLeft}s</div>
        <div className="hud-item" style={{color: '#38bdf8'}}>TOTAL: {elapsedTime}s</div>
        <button 
          className="pause-btn" 
          onClick={() => setIsPaused(!isPaused)}
          style={{
            background: isPaused ? '#22c55e' : '#f59e0b',
            color: 'white', border: 'none', borderRadius: '10px', padding: '0.2rem 1rem', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
        <div className="hud-item">SCORE: {score}</div>
      </div>

      {gameState === 'playing' && (
        <div className="math-panel">
          <h2 className="space-question">{question.q} = ?</h2>
          <form onSubmit={checkAnswer}>
            <input 
              ref={inputRef}
              type="number" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)}
              className="space-input"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default SpaceRace;
