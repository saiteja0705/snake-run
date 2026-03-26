import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, onScoreChange]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    setFood({ x: 15, y: 5 });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto font-mono">
      <div className="relative w-full aspect-square bg-black border-4 border-[#f0f] overflow-hidden">
        
        <div 
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {/* Food */}
          <div
            className="bg-[#f0f] shadow-[0_0_15px_#f0f] animate-pulse"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
          />
          
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${index === 0 ? 'bg-white' : 'bg-[#0ff]'} border border-black`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          ))}
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#f0f] mb-4 glitch" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
            <p className="text-[#0ff] text-3xl mb-8 bg-black border-2 border-[#0ff] p-2">YIELD: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-transparent border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black text-3xl transition-colors uppercase shadow-[4px_4px_0px_#f0f] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <h2 className="text-5xl font-bold text-[#0ff] glitch" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#f0f] text-xl flex gap-8 uppercase">
        <span><kbd className="bg-[#0ff] text-black px-2 py-1">WASD</kbd> / <kbd className="bg-[#0ff] text-black px-2 py-1">ARROWS</kbd> : OVERRIDE</span>
        <span><kbd className="bg-[#0ff] text-black px-2 py-1">SPACE</kbd> : HALT</span>
      </div>
    </div>
  );
}
