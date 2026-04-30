import React from "react";
import "./Nivel-2.css";

export default function Escenario({ children, collisions, time, phase, onStart }) {
  return (
    <div className="avenida-container">

      {}
      {phase === "playing" && (
        <div className="hud">
          <div className="hud-item">
            <span className="hud-icon"></span>
            <span className="hud-label">Choques</span>
            <span className="hud-val">{collisions}</span>
          </div>
          <div className="hud-sep" />
          <div className="hud-item">
            <span className="hud-icon"></span>
            <span className="hud-label">Tiempo</span>
            <span className="hud-val">{time}s</span>
          </div>
        </div>
      )}

      {}
      {phase === "idle" && (
        <div className="overlay">
          <div className="overlay-card">
            <div className="overlay-emoji">gatito 2</div>
            <h2 className="overlay-title">Nivel 2</h2>
            <p className="overlay-hint">
              Mueve el <strong>mouse arriba</strong> o <strong>abajo</strong> para cambiar de carril.
            </p>
            <p className="overlay-hint">
              El gatito avanza solo — ¡esquiva los bloques que caen!
            </p>
            <button className="overlay-btn" onClick={onStart}>
              ¡Empezar!
            </button>
          </div>
        </div>
      )}

      {/* ── Pantalla de victoria ────────────────────────── */}
      {phase === "won" && (
        <div className="overlay">
          <div className="overlay-card">
            <div className="overlay-emoji"></div>
            <h2 className="overlay-title">¡Llegaste a la meta!</h2>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-icon"></span>
                <span className="result-num">{collisions}</span>
                <span className="result-label">choques</span>
              </div>
              <div className="result-item">
                <span className="result-icon"></span>
                <span className="result-num">{time}s</span>
                <span className="result-label">tiempo</span>
              </div>
            </div>
            <button className="overlay-btn" onClick={onStart}>
              Jugar de nuevo
            </button>
          </div>
        </div>
      )}

      {}
      <div className="carril-unico">{children}</div>

      <div className="meta-inicio">INICIO</div>
      <div className="meta-fin">META</div>
    </div>
  );
}