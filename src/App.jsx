import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LevelSelect from './screens/LevelSelect';
import Nivel1Game from './Nivel-1/Nivel1Game';
import Nivel3Game from './Nivel-3/Nivel3Game';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/levels" element={<LevelSelect />} />
      <Route path="/nivel/1" element={<Nivel1Game />} />
      <Route path="/nivel/3" element={<Nivel3Game />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
