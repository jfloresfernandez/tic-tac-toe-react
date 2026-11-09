import { useState } from 'react';

// Nombre y apellidos del alumno: se muestra arriba del todo, encima del tablero
const NOMBRE = 'Javier Flores';

//Definicion del componente hijo
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// El tablero ya no guarda el estado: lo recibe del componente Game (props)
// xIsNext: true si le toca a la X; squares: las 9 casillas; onPlay: función que avisa a Game de una jugada
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // Si ya hay ganador o la casilla está ocupada, no se hace nada
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Se copia el array: el estado no se modifica directamente (inmutabilidad)
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // Renderizado condicional del texto de estado
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Componente principal: guarda el historial de jugadas y la jugada que se está viendo
export default function Game() {
  // history: lista de tableros, uno por cada jugada (el primero es el tablero vacío)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // currentMove: posición del historial que se muestra ahora
  const [currentMove, setCurrentMove] = useState(0);
  // Los turnos se calculan a partir del número de jugada: pares X, impares O
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Se llama cuando alguien juega: se descarta lo que había "en el futuro" y se añade el nuevo tablero
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Viaje en el tiempo: vuelve a una jugada anterior
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Un botón por cada jugada del historial
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <h1>{NOMBRE}</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

// Devuelve "X", "O" o null según quién tenga tres en línea
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
