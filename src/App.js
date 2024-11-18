import React, { useState, useEffect } from "react";
import leaderboardData from "./leaderboard.json";

const App = () => {
  const gridSize = 20; // Size of the grid
  const initialSnake = [[10, 10]]; // Initial position of the snake
  const initialFood = [5, 5]; // Initial position of the food

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState(leaderboardData);
  const [playerName, setPlayerName] = useState("");

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
      setScore(score + 1); // Increase score when food is eaten
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
    setScore(0);
  };

  // Submit player name to the leaderboard
  const submitScore = () => {
    if (playerName.trim()) {
      const updatedLeaderboard = [...leaderboard, { name: playerName, score }];
      updatedLeaderboard.sort((a, b) => b.score - a.score); // Sort by highest score
      setLeaderboard(updatedLeaderboard);
      setPlayerName(""); // Reset player name
      restartGame(); // Restart game after submission
    }
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
    <div className="bg-gray-800 text-white min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-2 bg-gray-900">
        <h1 className="text-2xl font-bold">Snake Game</h1>
        <a
          href="https://github.com/ivflit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            className="w-6 h-6"
          />
          GitHub
        </a>
      </nav>

      {/* Title and Subtitle */}
      <header className="text-center mt-6">
        <h2 className="text-3xl font-bold">Snake Game</h2>
        <p className="text-gray-400">A React app made by Ivan Flitcroft</p>
      </header>

      {/* Score Display */}
      <div className="text-center mt-4">
        <h3 className="text-xl font-bold">Score: {score}</h3>
      </div>

      {/* Main Game */}
      <div className="flex items-center justify-center mt-4">
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
          <div className="fixed top-0 left-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white w-full h-screen">
            <h1 className="text-4xl font-bold">Game Over</h1>
            <p className="text-lg mt-2">Your Score: {score}</p>
            <input
              type="text"
              placeholder="Enter your name"
              className="mt-4 px-4 py-2 rounded bg-gray-700 text-white"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
              onClick={submitScore}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <section className="mt-8 px-4">
        <h3 className="text-xl font-bold text-center">Leaderboard</h3>
        <ul className="mt-4 max-w-md mx-auto bg-gray-900 p-4 rounded shadow">
          {leaderboard.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between py-2 border-b border-gray-700 last:border-none"
            >
              <span>{entry.name}</span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
