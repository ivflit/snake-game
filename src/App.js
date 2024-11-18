import React, { useState, useEffect } from "react";

const App = () => {
  const gridSize = 20; // Size of the grid
  const initialSnake = [[10, 10]]; // Initial position of the snake
  const initialFood = [5, 5]; // Initial position of the food

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  // Move the snake
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    let newHead;

    switch (direction) {
      case "UP":
        newHead = [head[0], head[1] - 1];
        break;
      case "DOWN":
        newHead = [head[0], head[1] + 1];
        break;
      case "LEFT":
        newHead = [head[0] - 1, head[1]];
        break;
      case "RIGHT":
        newHead = [head[0] + 1, head[1]];
        break;
      default:
        return;
    }

    // Check for collisions
    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= gridSize ||
      newHead[1] >= gridSize ||
      newSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
    ) {
      setGameOver(true);
      return;
    }

    newSnake.push(newHead);

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      // Generate new food position
      const newFood = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ];
      setFood(newFood);
    } else {
      newSnake.shift(); // Remove tail if no food is eaten
    }

    setSnake(newSnake);
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  // Restart the game
  const restartGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection("RIGHT");
    setGameOver(false);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveSnake, 200);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div
        className="relative grid bg-gray-700 border-4 border-gray-600"
        style={{
          width: "420px",
          height: "420px",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: "2px", // Adds spacing between cells
        }}
      >
        {/* Render grid cells */}
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={index}
              className={`w-full h-full rounded-sm ${
                isSnake
                  ? "bg-green-500"
                  : isFood
                  ? "bg-red-500"
                  : "bg-gray-600"
              }`}
            />
          );
        })}
      </div>
      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute flex flex-col items-center justify-center bg-black bg-opacity-75 text-white w-full h-full">
          <h1 className="text-4xl font-bold">Game Over</h1>
          <button
            className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
            onClick={restartGame}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
