import React from 'react';
import Nivel2 from './Nivel-2/Nivel-2'; // 👈 importa el nivel completo
import './App.css';

function App() {
  return (
    <main className="game-wrapper">
      <h1 className="game-title">Nivel 2:</h1>

      <Nivel2 /> {}

      <footer className="game-footer">
      </footer>
    </main>
  );
}

export default App;