import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,135,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="home-screen">
      <canvas ref={canvasRef} className="home-canvas" />

      <div className="road-deco">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="road-stripe" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="game-logo">
          <span className="logo-icon">🐱</span>
          <h1 className="logo-title">CROSS<span className="logo-accent">RUSH</span></h1>
          <p className="logo-sub">¿Puedes cruzar la avenida?</p>
        </div>

        <div className="home-buttons">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/levels')}
          >
            🎮 JUGAR
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/nivel/1')}
          >
            ⚡ NIVEL RÁPIDO
          </motion.button>
        </div>

        <div className="home-stats-preview">
          <div className="stat-pill">🚗 Autos Aleatorios</div>
          <div className="stat-pill">⏱ Tiempo Real</div>
          <div className="stat-pill">💀 Contador de Golpes</div>
        </div>
      </motion.div>

      <div className="home-footer">
        <span>H3 Multimedia · CrossRush Game</span>
      </div>
    </div>
  );
}
