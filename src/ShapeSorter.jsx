import React, { useState, useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './index.css';

const SHAPE_MAP = {
  'circle': ['sports ball', 'apple', 'orange', 'clock'],
  'rectangle': ['cell phone', 'laptop', 'book', 'remote', 'keyboard'],
  'cylinder': ['bottle', 'cup', 'vase', 'wine glass'],
  'triangle': ['pizza', 'umbrella', 'sandwich']
};

const ShapeSorter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetShape, setTargetShape] = useState('circle');
  const [status, setStatus] = useState('Initializing AI Camera...');
  const [score, setScore] = useState(0);
  const [detectedObject, setDetectedObject] = useState(null);

  const shapes = ['circle', 'rectangle', 'cylinder', 'triangle'];

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
        setStatus('AI Ready! Find a CIRCLE object (like a ball)');
        startVideo();
      } catch (err) {
        setStatus('Camera Error. Please allow access.');
      }
    };
    loadModel();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  };

  useEffect(() => {
    let interval;
    if (model && !loading) {
      interval = setInterval(() => {
        detect();
      }, 500);
    }
    return () => clearInterval(interval);
  }, [model, loading, targetShape]);

  const detect = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const predictions = await model.detect(videoRef.current);
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 640, 480);
      
      predictions.forEach(prediction => {
        if (prediction.score > 0.6) {
          const [x, y, width, height] = prediction.bbox;
          
          // Draw Box
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);
          
          // Label
          ctx.fillStyle = '#6366f1';
          ctx.font = '20px Outfit';
          ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x, y > 20 ? y - 10 : 20);

          // Check Match
          if (SHAPE_MAP[targetShape].includes(prediction.class)) {
            handleMatch(prediction.class);
          }
        }
      });
    }
  };

  const handleMatch = (className) => {
    setScore(s => s + 50);
    setStatus(`✨ AMAZING! ${className} matches the ${targetShape.toUpperCase()}!`);
    const nextShape = shapes[(shapes.indexOf(targetShape) + 1) % shapes.length];
    
    // Pause detection briefly
    setTimeout(() => {
      setTargetShape(nextShape);
      setStatus(`Now find a ${nextShape.toUpperCase()}!`);
    }, 3000);
  };

  return (
    <div className="game-container lab-bg" style={{background: '#1e293b'}}>
      <div className="score-board">SCORE: {score}</div>
      
      <div className="lab-header">
        <h1 className="menu-title" style={{fontSize: '3rem', marginBottom: '1rem'}}>AI Shape Sorter</h1>
        <div className="target-shape-indicator">
          <span className="target-label">MISSION: FIND A </span>
          <span className="target-name">{targetShape.toUpperCase()}</span>
        </div>
      </div>

      <div className="scanner-main">
        <div className="viewfinder">
          <video ref={videoRef} autoPlay muted playsInline className="video-feed" />
          <canvas ref={canvasRef} width="640" height="480" className="detection-canvas" />
          
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>AI is warming up...</p>
            </div>
          )}

          <div className="scan-line"></div>
        </div>

        <div className="shape-vault">
          {shapes.map(s => (
            <div key={s} className={`vault-item ${s === targetShape ? 'active-target' : ''}`}>
              <div className={`shape-icon ${s}`}></div>
              <p>{s.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="status-bar" style={{background: 'rgba(99, 102, 241, 0.2)', border: '1px solid #6366f1'}}>{status}</div>
    </div>
  );
};

export default ShapeSorter;
