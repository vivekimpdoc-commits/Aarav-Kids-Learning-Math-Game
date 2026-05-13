import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import heroImg from './assets/hero_warrior.png';
import monsterImg1 from './assets/monster_boss.png';
import monsterImg2 from './assets/monster_dragon.png';

function MathQuest() {
  const [playerHp, setPlayerHp] = useState(100);
  const [monsterHp, setMonsterHp] = useState(100);
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', ans: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'victory', 'gameover', 'gameclear'
  const [isHeroAttacking, setIsHeroAttacking] = useState(false);
  const [isMonsterAttacking, setIsMonsterAttacking] = useState(false);
  const [level, setLevel] = useState(1);
  const [currentMonsterImg, setCurrentMonsterImg] = useState(monsterImg1);
  
  const inputRef = useRef(null);

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const generateQuestion = () => {
    // Difficulty scaling for 100 levels
    let ops = ['+', '-'];
    if (level > 20) ops.push('*');
    if (level > 60) ops = ['+', '-', '*', '*']; // More multiplication in high levels
    
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;

    const range = Math.min(200, 10 + (level * 2));
    const multRange = Math.min(15, 5 + Math.floor(level / 8));

    if (op === '+') {
      a = Math.floor(Math.random() * range) + 1;
      b = Math.floor(Math.random() * range) + 1;
    } else if (op === '-') {
      a = Math.floor(Math.random() * range) + range;
      b = Math.floor(Math.random() * (a - 1)) + 1;
    } else {
      a = Math.floor(Math.random() * multRange) + 2; // Avoid 0 and 1 too often
      b = Math.floor(Math.random() * multRange) + 2;
    }

    let ans;
    switch (op) {
      case '+': ans = a + b; break;
      case '-': ans = a - b; break;
      case '*': ans = a * b; break;
      default: ans = a + b;
    }
    setQuestion({ a, b, op, ans });
    setUserInput('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const userAns = parseInt(userInput);
    if (userAns === question.ans) {
      handleHeroAttack();
    } else {
      handleMonsterAttack();
    }
  };

  const handleHeroAttack = () => {
    setIsHeroAttacking(true);
    setFeedback({ text: level % 10 === 0 ? 'CRITICAL SMASH!' : 'CRITICAL HIT!', type: 'success' });
    const speech = new SpeechSynthesisUtterance("Correct!");
    window.speechSynthesis.speak(speech);

    setTimeout(() => {
      setIsHeroAttacking(false);
      const baseDamage = level % 10 === 0 ? 15 : 25;
      const damage = baseDamage + Math.floor(Math.random() * 10);
      setMonsterHp(prev => {
        const next = Math.max(0, prev - damage);
        if (next === 0) {
          if (level === 100) {
            setGameState('gameclear');
          } else {
            setGameState('victory');
            setLevel(prevLevel => prevLevel + 1);
            // Change monster for the next level
            setCurrentMonsterImg(Math.random() > 0.5 ? monsterImg1 : monsterImg2);
          }
        }
        return next;
      });
      setFeedback(null);
      if (monsterHp > 0) generateQuestion();
    }, 600);
  };

  const handleMonsterAttack = () => {
    setIsMonsterAttacking(true);
    setFeedback({ text: level % 10 === 0 ? 'ULTIMATE BLOW!' : 'OUCH!', type: 'error' });

    setTimeout(() => {
      setIsMonsterAttacking(false);
      const baseDamage = 10 + Math.floor(level / 5) + (level % 10 === 0 ? 10 : 0);
      const damage = baseDamage + Math.floor(Math.random() * 5);
      setPlayerHp(prev => {
        const next = Math.max(0, prev - damage);
        if (next === 0) setGameState('gameover');
        return next;
      });
      setFeedback(null);
      if (playerHp > 0) generateQuestion();
    }, 600);
  };

  const restartGame = () => {
    setPlayerHp(100);
    setMonsterHp(100);
    setLevel(1);
    setGameState('playing');
    generateQuestion();
  };

  return (
    <div className="game-container quest-bg">
      {gameState === 'victory' && (
        <div className="overlay">
          <h1 className="victory-text">BATTLE WON!</h1>
          <p style={{marginBottom: '1rem', fontSize: '1.5rem'}}>Monster Defeated!</p>
          <p style={{marginBottom: '2rem'}}>Level {level} reached!</p>
          <button className="restart-btn" onClick={() => { setGameState('playing'); setMonsterHp(100); }}>NEXT LEVEL</button>
        </div>
      )}

      {gameState === 'gameclear' && (
        <div className="overlay">
          <h1 className="victory-text" style={{fontSize: '8rem'}}>🌌 LEGENDARY!</h1>
          <p style={{marginBottom: '1rem', fontSize: '2rem'}}>You have cleared all 100 levels!</p>
          <p style={{marginBottom: '2rem'}}>You are the Ultimate Math Deity.</p>
          <button className="restart-btn" onClick={restartGame}>START NEW ERA</button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="overlay">
          <h1 className="gameover-text">DEFEATED</h1>
          <p style={{marginBottom: '2rem', fontSize: '1.5rem'}}>The monster was too strong...</p>
          <button className="restart-btn" onClick={restartGame}>RETRY FROM LEVEL 1</button>
        </div>
      )}

      <div className="math-card">
        <div className="hp-text" style={{color: level % 10 === 0 ? '#ef4444' : '#60a5fa', fontSize: '1.5rem'}}>
          {level % 10 === 0 ? '🔥 BOSS BATTLE 🔥' : `LEVEL ${level}`}
        </div>
        <div className="question">
          {question.a} {question.op === '*' ? '×' : question.op} {question.b} = ?
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            className="answer-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="?"
            autoFocus
          />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button type="submit" className="submit-btn">CAST SPELL</button>
          </div>
        </form>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.type === 'success' ? 'victory-text' : 'gameover-text'}`}>
          {feedback.text}
        </div>
      )}

      <div className="battle-arena">
        <div className={`character-container ${isHeroAttacking ? 'hero-attack' : ''}`}>
          <div className="hp-text">HERO HP: {playerHp}%</div>
          <div className="hp-bar-container">
            <div className="hp-bar-fill" style={{ width: `${playerHp}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}></div>
          </div>
          <img src={heroImg} alt="Hero" className="character-image" />
        </div>

        <div className={`character-container ${isMonsterAttacking ? 'monster-attack' : ''}`}>
          <div className="hp-text">MONSTER HP: {monsterHp}%</div>
          <div className="hp-bar-container">
            <div className="hp-bar-fill" style={{ width: `${monsterHp}%` }}></div>
          </div>
          <img src={currentMonsterImg} alt="Monster" className="character-image" style={{ filter: isMonsterAttacking ? 'hue-rotate(90deg)' : 'none' }} />
        </div>
      </div>
    </div>
  );
}

export default MathQuest;
