import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LevelSelect.css';

const levels = [
  {
    id: 1,
    title: 'NIVEL 1',
    subtitle: 'Principiante',
    desc: '3 carriles · 2 autos · Velocidad baja',
    icon: '🌱',
    color: '#00ff87',
    glow: 'rgba(0,255,135,0.4)',
    available: true,
    route: '/nivel/1',
  },
  {
    id: 2,
    title: 'NIVEL 2',
    subtitle: 'Intermedio',
    desc: '4 carriles · 4 autos · Velocidad media',
    icon: '⚡',
    color: '#ffd60a',
    glow: 'rgba(255,214,10,0.4)',
    available: false,
    route: null,
  },
  {
    id: 3,
    title: 'NIVEL 3',
    subtitle: 'Experto',
    desc: '5 carriles · 6 autos · Spline 3D · Alta velocidad',
    icon: '🔥',
    color: '#ff4d6d',
    glow: 'rgba(255,77,109,0.4)',
    available: true,
    route: '/nivel/3',
  },
];

export default function LevelSelect() {
  const navigate = useNavigate();

  return (
    <div className="level-select-screen">
      <div className="ls-bg-road" />

      <motion.div
        className="ls-content"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button className="ls-back-btn" onClick={() => navigate('/')}>
          ← VOLVER
        </button>

        <h1 className="ls-title">SELECCIONAR <span className="ls-accent">NIVEL</span></h1>
        <p className="ls-desc">Elige tu dificultad y cruza la avenida</p>

        <div className="ls-cards">
          {levels.map((lvl, i) => (
            <motion.div
              key={lvl.id}
              className={`ls-card ${!lvl.available ? 'ls-card--locked' : ''}`}
              style={{ '--card-color': lvl.color, '--card-glow': lvl.glow }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={lvl.available ? { scale: 1.04, y: -6 } : {}}
              onClick={() => lvl.available && navigate(lvl.route)}
            >
              <div className="ls-card-number">{lvl.id}</div>
              <div className="ls-card-icon">{lvl.icon}</div>
              <h2 className="ls-card-title">{lvl.title}</h2>
              <p className="ls-card-subtitle">{lvl.subtitle}</p>
              <p className="ls-card-desc">{lvl.desc}</p>
              {!lvl.available && (
                <div className="ls-locked-badge">🔒 PRÓXIMAMENTE</div>
              )}
              {lvl.available && (
                <button className="ls-play-btn">JUGAR ▶</button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
