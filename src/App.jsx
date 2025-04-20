import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

const easyEmojis = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍍", "🥝"];
const normalEmojis = ["😀", "😂", "😍", "😎", "😭", "😡", "🤓", "😴"];
const hardEmojis = ["👻", "💀", "👽", "👺", "👹", "🧟", "🧛", "🧙"];

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (gameMode) {
      let timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode]);

  useEffect(() => {
    if (matchedIndices.length && matchedIndices.length === cards.length) {
      setGameWon(true);
    }
  }, [matchedIndices, cards.length]);

  const generateCards = (mode) => {
    let emojis = [];
    let time = 60;

    switch (mode) {
      case "easy":
        emojis = easyEmojis.slice(0, 6); // 6 pairs = 12 cards
        time = 60;
        break;
      case "normal":
        emojis = normalEmojis.slice(0, 8); // 8 pairs = 16 cards
        time = 45;
        break;
      case "hard":
        emojis = hardEmojis.slice(0, 8); // 8 pairs = 16 cards
        time = 30;
        break;
      default:
        break;
    }

    const pairedEmojis = shuffleArray([...emojis, ...emojis]);
    setCards(pairedEmojis);
    setGameMode(mode);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setScore(0);
    setTimeLeft(time);
    setGameOver(false);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedIndices.includes(index)
    )
      return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatchedIndices([...matchedIndices, first, second]);
        setScore((prev) => prev + 1);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setCards([]);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameWon(false);
  };

  const modeLabel =
    gameMode === "easy" ? "Easy" : gameMode === "normal" ? "Normal" : "Hard";

  return (
    <div className="app-wrapper">
      {gameWon && <Confetti />}
      <div className={`game-container ${gameMode}`}>
        <h1>🎮 Emoji Guesser</h1>

        {gameMode && (
          <div className="info-bar">
            <div className="timer">⏱ Time: {timeLeft}</div>
            <div className="score">⭐ Score: {score}</div>
          </div>
        )}

        {!gameMode && (
          <div className="menu">
            <button onClick={() => generateCards("easy")}>Easy</button>
            <button onClick={() => generateCards("normal")}>Normal</button>
            <button onClick={() => generateCards("hard")}>Hard</button>
          </div>
        )}

        {gameMode && (
          <>
            <div className="card-container">
              {cards.map((emoji, index) => (
                <div
                  key={index}
                  className={`card ${
                    flippedIndices.includes(index) ||
                    matchedIndices.includes(index)
                      ? "flipped"
                      : ""
                  }`}
                  onClick={() => !gameOver && handleCardClick(index)}
                >
                  {flippedIndices.includes(index) ||
                  matchedIndices.includes(index)
                    ? emoji
                    : "❓"}
                </div>
              ))}
            </div>

            {gameOver && !gameWon && (
              <div className="completion-message">Game Over! Try again?</div>
            )}

            {gameWon && (
              <div className="completion-message">
                🎉 Congrats! You completed {modeLabel} mode!
              </div>
            )}

            <button onClick={resetGame} className="back-button">
              🔙 Back to Menu
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
