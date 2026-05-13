import React, { useState } from 'react';
import MathQuest from './MathQuest';
import HungryAlligator from './HungryAlligator';
import ShapeScanner from './ShapeScanner';
import WordMatch from './WordMatch';
import FruitBasket from './FruitBasket';
import SpaceRace from './SpaceRace';
import BalloonPop from './BalloonPop';
import KangarooJump from './KangarooJump';
import ShapeSorter from './ShapeSorter';
import HideSeekKitty from './HideSeekKitty';
import './index.css';

function App() {
  const [currentGame, setCurrentGame] = useState('menu');

  return (
    <div className="main-app">
      {currentGame === 'menu' && (
        <div className="game-container menu-bg">
          <h1 className="menu-title">Aarav's Math Adventures</h1>
          <div className="menu-grid">
            <div className="menu-card" onClick={() => setCurrentGame('mathquest')}>
              <div className="card-icon">⚔️</div>
              <h2>Math Quest</h2>
              <p>Battle monsters with math!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('alligator')}>
              <div className="card-icon">🐊</div>
              <h2>Hungry Alligator</h2>
              <p>Feed the alligator larger numbers!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('scanner')}>
              <div className="card-icon">🔍</div>
              <h2>AI Shape Hunter</h2>
              <p>Find real shapes in your home!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('wordmatch')}>
              <div className="card-icon">📝</div>
              <h2>Word Match Master</h2>
              <p>Speak and match number names!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('fruit')}>
              <div className="card-icon">🍎</div>
              <h2>Fruit Basket</h2>
              <p>Count and add falling fruits!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('spacerace')}>
              <div className="card-icon">🚀</div>
              <h2>Space Race</h2>
              <p>Solve fast to win the race!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('balloon')}>
              <div className="card-icon">🎈</div>
              <h2>Balloon Pop</h2>
              <p>Count balloons after they pop!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('kangaroo')}>
              <div className="card-icon">🦘</div>
              <h2>Kangaroo Jump</h2>
              <p>Jump on the number line!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('sorter')}>
              <div className="card-icon">📐</div>
              <h2>AI Shape Sorter</h2>
              <p>Scan real objects into shapes!</p>
            </div>
            <div className="menu-card" onClick={() => setCurrentGame('kitty')}>
              <div className="card-icon">🐱</div>
              <h2>Hide & Seek Kitty</h2>
              <p>Find the kitty in the room!</p>
            </div>
          </div>
        </div>
      )}

      {currentGame === 'mathquest' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <MathQuest />
        </div>
      )}

      {currentGame === 'alligator' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <HungryAlligator />
        </div>
      )}

      {currentGame === 'scanner' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <ShapeScanner />
        </div>
      )}

      {currentGame === 'wordmatch' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <WordMatch />
        </div>
      )}

      {currentGame === 'fruit' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <FruitBasket />
        </div>
      )}

      {currentGame === 'spacerace' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <SpaceRace />
        </div>
      )}

      {currentGame === 'balloon' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <BalloonPop />
        </div>
      )}

      {currentGame === 'kangaroo' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <KangarooJump />
        </div>
      )}

      {currentGame === 'sorter' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <ShapeSorter />
        </div>
      )}

      {currentGame === 'kitty' && (
        <div style={{ position: 'relative' }}>
          <button className="back-btn" onClick={() => setCurrentGame('menu')}>⬅ BACK</button>
          <HideSeekKitty />
        </div>
      )}
    </div>
  );
}

export default App;
