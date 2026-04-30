import React from 'react';
import Escenario from './Nivel-1/Escenario';
import './App.css';

function App() {
  return (
    <main className="game-wrapper">
      <h1 className="game-title">Nivel 1:</h1>
      
      <Escenario>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
         
        </div>
      </Escenario>

      <footer className="game-footer">
      </footer>
    </main>
  );
}
export default App;
