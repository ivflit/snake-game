import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [snake, setSnake] = useState([[10,10]])
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const gridSize = 20;
  return (
    
  );
}

export default App;
