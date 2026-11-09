# Tres en línea (React)

Código del [tutorial oficial de React: Tres en línea](https://es.react.dev/learn/tutorial-tic-tac-toe), con el juego completo: turnos X/O, detección del ganador y historial de jugadas para volver a cualquier movimiento. El nombre del alumno aparece arriba del tablero.

Las respuestas a las preguntas de la evaluación están en [RESPUESTAS.md](RESPUESTAS.md).

## Cómo ejecutarlo

Hace falta Node.js y npm.

```bash
npm install
npm start
```

Se abre en http://localhost:3000. Para compilar: `npm run build`.

## Estructura

- `src/App.js`: los componentes `Square`, `Board` y `Game`, y la función `calculateWinner`.
- `src/index.js`: arranca la aplicación.
- `src/styles.css`: estilos del tutorial.
