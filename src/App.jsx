import React, { useState } from 'react';
import Nivel1 from './Nivel-1/Nivel-1';
import Nivel2 from './Nivel-2/Nivel-2';
import './App.css';

function App() {
  const [nivel, setNivel] = useState(1);

  return (
    <div className="App">

      {nivel === 1 && (
        <>
          <Nivel1 />
          <button onClick={() => setNivel(2)}>
            Ir al Nivel 2
          </button>
        </>
      )}

      {nivel === 2 && <Nivel2 />}

    </div>
  );
}

export default App;