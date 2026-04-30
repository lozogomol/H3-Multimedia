import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import car1Img from '../assets/cars/car1.png';
import car2Img from '../assets/cars/car2.png';
import car3Img from '../assets/cars/car3.png';
import './Nivel3Game.css';

/* ─── Layout ─────────────────────────────────────────────────
   Canvas is LANDSCAPE. Hero crosses LEFT → RIGHT.
   3 vertical lane COLUMNS. Cars fall TOP → BOTTOM.
   START zone on left edge, META zone on right edge.
────────────────────────────────────────────────────────────── */
const GAME_W = 960;
const GAME_H = 560;

const ZONE_W = 90;            // width of start / finish zones
const ROAD_LEFT = ZONE_W;
const ROAD_RIGHT = GAME_W - ZONE_W;
const ROAD_W = ROAD_RIGHT - ROAD_LEFT;

const LANES = 3;
const LANE_W = ROAD_W / LANES;   // ~260px per lane column

const CAR_W = 130;           // drawn as-is, no rotation
const CAR_H = 72;
const HERO_R = 22;
const HERO_SPEED = 2.6;      // px/frame — constant velocity

/* Hero starts center of start zone */
const HERO_START = { x: ZONE_W / 2, y: GAME_H / 2 };

const NUM_CARS = 7;

function randomBetween(a, b) { return a + Math.random() * (b - a); }

/* Lane x-range: lane 0 = leftmost column inside road */
function laneX(lane) { return ROAD_LEFT + lane * LANE_W; }

function initCars() {
  const imgs = [car1Img, car2Img, car3Img];
  return Array.from({ length: NUM_CARS }, (_, i) => ({
    id: i,
    lane: i % LANES,
    // random x within the lane column, centered
    xOffset: randomBetween(10, LANE_W - CAR_W - 10),
    y: -CAR_H - randomBetween(0, 700),
    speed: randomBetween(3.5, 6.5),
    img: imgs[i % 3],
    scale: randomBetween(0.9, 1.1),
  }));
}

function initParticles() {
  return Array.from({ length: 40 }, () => ({
    x: Math.random() * GAME_W, y: Math.random() * GAME_H,
    r: Math.random() * 1.3 + 0.3,
    dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.3 + 0.08,
    hue: Math.random() * 50 + 170,
  }));
}

/* ── Animated character widget (CSS canvas) ─────────────────── */
function Character3D() {
  const cRef = useRef(null);
  useEffect(() => {
    const canvas = cRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0, id;
    const draw = () => {
      t += 0.025;
      ctx.clearRect(0, 0, 200, 230);
      const cx = 100, cy = 100;
      // outer rings
      for (let i = 3; i > 0; i--) {
        ctx.beginPath();
        ctx.arc(cx, cy, 50 + i * 11 + Math.sin(t) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,77,109,${0.07 * i})`;
        ctx.lineWidth = 3; ctx.stroke();
      }
      // body
      const p = 0.9 + Math.sin(t * 3) * 0.1;
      const g = ctx.createRadialGradient(cx - 10, cy - 12, 5, cx, cy, 50 * p);
      g.addColorStop(0, '#ffddaa'); g.addColorStop(0.4, '#ff8c42'); g.addColorStop(1, '#c0392b');
      ctx.save(); ctx.shadowBlur = 28; ctx.shadowColor = '#ff4d6d';
      ctx.beginPath(); ctx.arc(cx, cy, 50 * p, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill(); ctx.restore();
      // eyes
      const ex = Math.sin(t * 0.8) * 3;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 15, cy - 10, 9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 15, cy - 10, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a0a0a';
      ctx.beginPath(); ctx.arc(cx - 15 + ex, cy - 10, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 15 + ex, cy - 10, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 13 + ex, cy - 13, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 17 + ex, cy - 13, 2, 0, Math.PI * 2); ctx.fill();
      // mouth
      ctx.strokeStyle = '#7a1a00'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx, cy + 14, 15, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      // label
      ctx.fillStyle = 'rgba(255,77,109,0.8)';
      ctx.font = 'bold 10px Orbitron, monospace'; ctx.textAlign = 'center';
      ctx.fillText('PERSONAJE', cx, 180);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('NIVEL 3 · EXPERTO', cx, 198);
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={cRef} width={200} height={210} style={{ width: '100%', height: '100%' }} />;
}

/* ── Main component ─────────────────────────────────────────── */
export default function Nivel3Game() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('playing');
  const [hits, setHits] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const canvasRef = useRef(null);
  const heroRef = useRef({ ...HERO_START });
  const targetRef = useRef({ ...HERO_START });
  const carsRef = useRef(initCars());
  const particlesRef = useRef(initParticles());
  const animRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const stateRef = useRef('playing');
  const hitsRef = useRef(0);
  const carImgEls = useRef({});
  const lastHitRef = useRef(0);

  // Preload images
  useEffect(() => {
    const load = (src) => { const i = new Image(); i.src = src; return i; };
    carImgEls.current = {
      [car1Img]: load(car1Img),
      [car2Img]: load(car2Img),
      [car3Img]: load(car3Img),
    };
  }, []);

  // Timer — runs until win
  useEffect(() => {
    const t = setInterval(() => {
      if (stateRef.current === 'playing')
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const resetHero = useCallback(() => {
    heroRef.current = { ...HERO_START };
    targetRef.current = { ...HERO_START };
  }, []);

  // Click → set target (hero moves there continuously)
  const handleClick = useCallback((e) => {
    if (stateRef.current !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = GAME_W / rect.width, sy = GAME_H / rect.height;
    targetRef.current = {
      x: Math.max(HERO_R, Math.min((e.clientX - rect.left) * sx, ROAD_RIGHT - HERO_R)),
      y: Math.max(HERO_R, Math.min((e.clientY - rect.top) * sy, GAME_H - HERO_R)),
    };
  }, []);

  /* ── Game loop ──────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const loop = () => {
      t += 0.016;
      ctx.clearRect(0, 0, GAME_W, GAME_H);

      /* Background */
      const bg = ctx.createLinearGradient(0, 0, 0, GAME_H);
      bg.addColorStop(0, '#0a0a14'); bg.addColorStop(1, '#12122a');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, GAME_W, GAME_H);

      /* Particles */
      particlesRef.current.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.alpha})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > GAME_W) p.dx *= -1;
        if (p.y < 0 || p.y > GAME_H) p.dy *= -1;
      });

      /* ── START zone (left) */
      const sg = ctx.createLinearGradient(0, 0, ZONE_W, 0);
      sg.addColorStop(0, 'rgba(0,255,135,0.25)'); sg.addColorStop(1, 'rgba(0,255,135,0.05)');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, ZONE_W, GAME_H);
      // border
      ctx.save(); ctx.shadowBlur = 12; ctx.shadowColor = '#00ff87';
      ctx.strokeStyle = 'rgba(0,255,135,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ZONE_W, 0); ctx.lineTo(ZONE_W, GAME_H); ctx.stroke();
      ctx.restore();
      // label rotated
      ctx.save(); ctx.translate(ZONE_W / 2, GAME_H / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#00ff87'; ctx.font = 'bold 13px Orbitron, monospace'; ctx.textAlign = 'center';
      ctx.fillText('▶  INICIO', 0, 5); ctx.restore();

      /* ── FINISH zone (right) */
      const fg = ctx.createLinearGradient(ROAD_RIGHT, 0, GAME_W, 0);
      fg.addColorStop(0, 'rgba(255,77,109,0.05)'); fg.addColorStop(1, 'rgba(255,77,109,0.25)');
      ctx.fillStyle = fg; ctx.fillRect(ROAD_RIGHT, 0, ZONE_W, GAME_H);
      ctx.save(); ctx.shadowBlur = 12; ctx.shadowColor = '#ff4d6d';
      ctx.strokeStyle = 'rgba(255,77,109,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ROAD_RIGHT, 0); ctx.lineTo(ROAD_RIGHT, GAME_H); ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.translate(ROAD_RIGHT + ZONE_W / 2, GAME_H / 2); ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#ff4d6d'; ctx.font = 'bold 13px Orbitron, monospace'; ctx.textAlign = 'center';
      ctx.fillText('🏁  META', 0, 5); ctx.restore();

      /* ── Road */
      ctx.fillStyle = '#14142a'; ctx.fillRect(ROAD_LEFT, 0, ROAD_W, GAME_H);

      /* Lane dividers (vertical) */
      for (let l = 1; l < LANES; l++) {
        const x = ROAD_LEFT + l * LANE_W;
        ctx.setLineDash([28, 22]); ctx.strokeStyle = 'rgba(255,214,10,0.28)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke();
        ctx.setLineDash([]);
      }

      /* Road top/bottom neon edges */
      ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = '#00d4ff';
      ctx.strokeStyle = 'rgba(0,212,255,0.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ROAD_LEFT, 0); ctx.lineTo(ROAD_RIGHT, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ROAD_LEFT, GAME_H); ctx.lineTo(ROAD_RIGHT, GAME_H); ctx.stroke();
      ctx.restore();

      if (stateRef.current !== 'playing') {
        animRef.current = requestAnimationFrame(loop); return;
      }

      /* ── Move hero toward target at constant speed */
      const hero = heroRef.current, tgt = targetRef.current;
      const dx = tgt.x - hero.x, dy = tgt.y - hero.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > HERO_SPEED) {
        heroRef.current = {
          x: hero.x + (dx / dist) * HERO_SPEED,
          y: hero.y + (dy / dist) * HERO_SPEED,
        };
      }

      /* ── Move & draw cars (top → bottom, NO ROTATION) */
      carsRef.current = carsRef.current.map(car => {
        let ny = car.y + car.speed;
        // reset to above the canvas when it exits the bottom
        if (ny > GAME_H + 20) ny = -CAR_H * car.scale - randomBetween(50, 420);
        return { ...car, y: ny };
      });

      carsRef.current.forEach(car => {
        const carX = laneX(car.lane) + car.xOffset;
        const cw = CAR_W * car.scale, ch = CAR_H * car.scale;
        const cimg = carImgEls.current[car.img];

        ctx.save();
        ctx.shadowBlur = 18; ctx.shadowColor = '#ff4d6d';
        if (cimg && cimg.complete && cimg.naturalWidth > 0) {
          // Draw car image as-is (no rotation)
          ctx.drawImage(cimg, carX, car.y, cw, ch);
        } else {
          // Fallback colored rect
          ctx.fillStyle = '#ff4d6d';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(carX, car.y, cw, ch, 8);
          else ctx.rect(carX, car.y, cw, ch);
          ctx.fill();
        }
        ctx.restore();
      });

      /* ── Draw hero (pulsing neon circle) */
      const hx = heroRef.current.x, hy = heroRef.current.y;
      const pulse = 0.88 + Math.sin(t * 5) * 0.12;
      ctx.save();
      ctx.shadowBlur = 26 * pulse; ctx.shadowColor = '#00ff87';
      const hg = ctx.createRadialGradient(hx, hy - 6, 4, hx, hy, HERO_R * pulse);
      hg.addColorStop(0, '#aaffdd'); hg.addColorStop(0.55, '#00ff87'); hg.addColorStop(1, '#006a35');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hx, hy, HERO_R * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // face
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(hx - 7, hy - 5, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hx + 7, hy - 5, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0a0a14';
      ctx.beginPath(); ctx.arc(hx - 7, hy - 5, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hx + 7, hy - 5, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hx, hy + 5, 7, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      ctx.restore();

      /* ── Collision (400ms cooldown to avoid multi-hit) */
      const now = Date.now();
      carsRef.current.forEach(car => {
        const carX = laneX(car.lane) + car.xOffset;
        const cw = CAR_W * car.scale, ch = CAR_H * car.scale;
        // AABB vs circle — shrink hitbox slightly for fairness
        const closestX = Math.max(carX + 6, Math.min(hx, carX + cw - 6));
        const closestY = Math.max(car.y + 6, Math.min(hy, car.y + ch - 6));
        const distSq = (hx - closestX) ** 2 + (hy - closestY) ** 2;
        if (distSq < (HERO_R - 4) ** 2 && now - lastHitRef.current > 400) {
          lastHitRef.current = now;
          hitsRef.current += 1;
          setHits(hitsRef.current);
          setShowFlash(true);
          setTimeout(() => setShowFlash(false), 500);
          resetHero(); // back to INICIO — counters keep running
        }
      });

      /* ── Win: hero reaches right edge (META) */
      if (heroRef.current.x >= ROAD_RIGHT - HERO_R) {
        stateRef.current = 'win'; setGameState('win');
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [resetHero]);

  const handleRestart = () => {
    stateRef.current = 'playing'; setGameState('playing');
    hitsRef.current = 0; setHits(0); setElapsed(0);
    startTimeRef.current = Date.now();
    carsRef.current = initCars(); resetHero();
  };

  return (
    <div className="n3-wrapper">
      {/* HUD */}
      <div className="n3-hud">
        <button className="n3-back-btn" onClick={() => navigate('/levels')}>← NIVELES</button>
        <div className="n3-hud-center">
          <span className="n3-level-badge">NIVEL</span>
          <span className="n3-level-num">3</span>
          <span className="n3-level-tag">EXPERTO</span>
        </div>
        <div className="n3-stats">
          <div className="n3-stat n3-stat--red">
            <span>💀</span><strong>{hits}</strong><small>GOLPES</small>
          </div>
          <div className="n3-stat n3-stat--blue">
            <span>⏱</span><strong>{elapsed}s</strong><small>TIEMPO</small>
          </div>
        </div>
      </div>

      {/* Game area: canvas + sidebar */}
      <div className="n3-game-area">
        <div className="n3-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={GAME_W}
            height={GAME_H}
            className="n3-canvas"
            onClick={handleClick}
          />
          <AnimatePresence>
            {showFlash && (
              <motion.div className="n3-hit-flash"
                initial={{ opacity: 0.75 }} animate={{ opacity: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="n3-sidebar">
          <div className="n3-spline-label">PERSONAJE</div>
          <div className="n3-spline-container"><Character3D /></div>
          <div className="n3-info-pills">
            <div className="n3-info-pill">🚗 {NUM_CARS} vehículos</div>
            <div className="n3-info-pill">🛣 {LANES} carriles</div>
            <div className="n3-info-pill">⬇ Caída rápida</div>
          </div>
          <div className="n3-legend">
            <div className="n3-legend-row"><span className="n3-dot" style={{ background: '#00ff87' }} /><span>Tú (izq→der)</span></div>
            <div className="n3-legend-row"><span className="n3-dot" style={{ background: '#ff4d6d' }} /><span>Autos (arriba↓)</span></div>
          </div>
          <p className="n3-side-hint">Clic en la pista para guiar al personaje hacia la META</p>
        </div>
      </div>

      {/* Win overlay */}
      <AnimatePresence>
        {gameState === 'win' && (
          <motion.div className="n3-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="n3-result-card"
              initial={{ scale: 0.6, y: 60 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}>
              <div className="n3-win-stars">⭐⭐⭐</div>
              <h2 className="n3-win-title">¡NIVEL 3 COMPLETADO!</h2>
              <div className="n3-win-stats">
                <div className="n3-win-stat"><span>💀 Golpes</span><strong>{hits}</strong></div>
                <div className="n3-win-divider" />
                <div className="n3-win-stat"><span>⏱ Tiempo</span><strong>{elapsed}s</strong></div>
              </div>
              <p className="n3-win-rating">
                {hits === 0 ? '🏆 ¡Perfecto! Sin un rasguño.' :
                  hits <= 3 ? '👏 ¡Muy bien! Casi perfecto.' : '🎮 ¡Completado! Sigue practicando.'}
              </p>
              <div className="n3-win-actions">
                <motion.button className="n3-btn-primary" whileHover={{ scale: 1.05 }} onClick={handleRestart}>↺ REINICIAR</motion.button>
                <motion.button className="n3-btn-secondary" whileHover={{ scale: 1.05 }} onClick={() => navigate('/levels')}>☰ NIVELES</motion.button>
                <motion.button className="n3-btn-home" whileHover={{ scale: 1.05 }} onClick={() => navigate('/')}>🏠 INICIO</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
