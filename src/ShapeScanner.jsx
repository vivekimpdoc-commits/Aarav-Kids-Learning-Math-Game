import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import './scanner.css';

const SHAPES = [
  { 
    name: 'Circle', 
    icon: '⭕', 
    objects: ['clock', 'donut', 'sports ball', 'orange', 'apple', 'bowl', 'cup', 'bottle', 'vase'],
    color: '#3b82f6'
  },
  { 
    name: 'Square / Rectangle', 
    icon: '🟦', 
    objects: ['cell phone', 'book', 'laptop', 'remote', 'keyboard', 'mouse', 'microwave', 'tv', 'refrigerator'],
    color: '#ef4444'
  },
  { 
    name: 'Triangle / Cone', 
    icon: '🍕', 
    objects: ['pizza', 'umbrella', 'cone', 'handbag', 'kite'],
    color: '#f59e0b'
  }
];

const ShapeScanner = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing');
  const [model, setModel] = useState(null);
  const [targetShape, setTargetShape] = useState(SHAPES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Scanner...');
  const [detections, setDetections] = useState([]);
  const [celebrating, setCelebrating] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setStatus('Warming up AI Engine...');
      setLoadingProgress(20);
      await tf.ready();
      setLoadingProgress(50);
      const loadedModel = await cocoSsd.load();
      setLoadingProgress(100);
      setModel(loadedModel);
      setStatus('AI Scanner Online');
    } catch (err) {
      console.error(err);
      setStatus('AI Offline - Using Manual Discovery');
      setLoadingProgress(100);
    }
  };

  const generateTarget = () => {
    const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTargetShape(nextShape);
    setStatus('Find the next shape!');
    setDetections([]);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const startScan = () => {
    if (!model) return;
    setIsScanning(!isScanning);
    if (!isScanning) {
      setStatus('Scanning for ' + targetShape.name + '...');
    } else {
      setStatus('Scanner Paused');
      setDetections([]);
    }
  };

  useEffect(() => {
    let requestRef;
    
    const detect = async () => {
      if (isScanning && model && webcamRef.current) {
        const video = webcamRef.current.video;
        if (video.readyState === 4) {
          const predictions = await model.detect(video);
          setDetections(predictions);
          drawBoundingBoxes(predictions);

          const foundMatch = predictions.some(p => 
            targetShape.objects.includes(p.class) && p.score > 0.5
          );

          if (foundMatch) {
            handleSuccess();
            return; // Stop scanning
          }
        }
      }
      if (isScanning) {
        requestRef = requestAnimationFrame(detect);
      }
    };

    if (isScanning) {
      requestRef = requestAnimationFrame(detect);
    }

    return () => cancelAnimationFrame(requestRef);
  }, [isScanning, targetShape, model]);

  const drawBoundingBoxes = (predictions) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      const isMatch = targetShape.objects.includes(prediction.class);
      
      ctx.strokeStyle = isMatch ? '#22c55e' : '#3b82f6';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = isMatch ? '#22c55e' : '#3b82f6';
      ctx.font = '18px Arial';
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x, y > 20 ? y - 10 : 10
      );
    });
  };

  const handleSuccess = () => {
    setIsScanning(false);
    setCelebrating(true);
    setScore(s => s + 50);
    setStatus(`✨ AMAZING! You found the ${targetShape.name}! ✨`);
    
    if (level === 50) {
      setGameState('victory');
    } else {
      setTimeout(() => {
        setCelebrating(false);
        setLevel(l => l + 1);
        generateTarget();
      }, 3000);
    }
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('playing');
    generateTarget();
  };

  return (
    <div className="scanner-container game-container lab-bg">
      {gameState === 'victory' && (
        <div className="overlay" style={{background: 'rgba(99, 102, 241, 0.9)'}}>
          <h1 className="victory-text" style={{fontSize: '5rem'}}>🏆 VISION MASTER!</h1>
          <p style={{fontSize: '2rem'}}>Aarav, you completed all 50 hunting missions!</p>
          <button className="restart-btn" onClick={restartGame}>NEW HUNT</button>
        </div>
      )}

      <div className="score-board">SCORE: {score} | LEVEL: {level}</div>
      
      <div className="scanner-bg-effect" />
      
      {loadingProgress < 100 && (
        <div className="overlay" style={{background: 'rgba(2, 6, 23, 0.95)'}}>
          <div className="loading-bar-container">
            <div className="loading-bar-fill" style={{width: `${loadingProgress}%`}}></div>
          </div>
          <h2 style={{marginTop: '1rem'}}>{status}</h2>
        </div>
      )}

      <div className="viewfinder">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="webcam-view"
          onUserMediaError={() => setCameraError('Camera Access Denied')}
        />
        <canvas
          ref={canvasRef}
          className="scanner-canvas"
          width={640}
          height={480}
        />
        {isScanning && <div className="scan-line" />}
        {cameraError && (
          <div className="overlay" style={{background: 'rgba(239, 68, 68, 0.8)'}}>
            <h1>❌ {cameraError}</h1>
            <p>Please enable camera access in your browser.</p>
          </div>
        )}
        {celebrating && (
          <div className="celebration-overlay">
            <div className="success-content">
              <div className="shape-icon">🎉</div>
              <h1>{targetShape.name} FOUND!</h1>
              <p>Excellent scanning skills!</p>
            </div>
          </div>
        )}
      </div>

      <div className="instruction-panel">
        <div className="target-display">
          <p>SEARCH MISSION:</p>
          <h1 className="target-shape" style={{color: targetShape.color}}>
            {targetShape.icon} {targetShape.name}
          </h1>
        </div>
        
        <div className="control-group">
          <button 
            className="submit-btn" 
            onClick={startScan}
            disabled={!model || cameraError}
            style={{ 
              background: isScanning ? '#ef4444' : '#22c55e',
              opacity: (!model || cameraError) ? 0.5 : 1
            }}
          >
            {isScanning ? 'STOP SCANNER' : 'START SCANNER'}
          </button>
          
          <button className="skip-btn" onClick={handleSuccess}>
            SKIP / FOUND IT!
          </button>
        </div>
      </div>

      <div className="ai-feedback-panel">
        <div className="status-indicator">
          <div className={`status-dot ${model ? 'ready' : 'loading'}`}></div>
          {status}
        </div>
        <div className="detection-list">
          VISIBLE: {detections.length > 0 ? detections.map(d => d.class).join(', ') : 'Scanning environment...'}
        </div>
      </div>
    </div>
  );
};

export default ShapeScanner;
