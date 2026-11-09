# Evaluación continua · React · Respuestas

Tutorial: https://es.react.dev/learn/tutorial-tic-tac-toe · Código en `src/App.js`.

## Pregunta 1: Componentes

¿Qué es un componente en React? Explica la relación entre los componentes Square, Board y Game que se construyen en el tutorial.

Un componente es una función de JavaScript que devuelve JSX y describe un trozo de la interfaz (un botón, una sección, una página entera). Su nombre empieza siempre por mayúscula y se puede reutilizar tantas veces como haga falta. En el tutorial hay tres, uno dentro de otro:

- `Square` es una casilla: un `<button>` que muestra `X`, `O` o nada.
- `Board` es el tablero: pinta 9 `Square` en tres filas y el texto de estado.
- `Game` es el componente principal: guarda el historial de jugadas (`history`), decide qué jugada se ve (`currentMove`) y dibuja el `Board` y la lista de movimientos.

La relación es de padre a hijo (`Game` → `Board` → `Square`): los datos bajan por las props y los avisos suben llamando a las funciones que cada padre pasa a su hijo.

## Pregunta 2: JSX

¿Qué es JSX y qué regla debe cumplir siempre lo que devuelve un componente en cuanto al número de elementos raíz?

JSX es una extensión de la sintaxis de JavaScript que permite escribir marcado parecido a HTML dentro del código (`<button className="square">...</button>`). Por debajo se convierte en llamadas normales de JavaScript. Dentro de las llaves `{}` se puede meter cualquier expresión de JavaScript, como `{value}` o `{status}`, y todas las etiquetas deben cerrarse (`<Square ... />`).

La regla es que un componente solo puede devolver **un único elemento raíz**. Si hay varios hermanos hay que envolverlos en un contenedor, como un `<div>`, o en un fragmento `<>...</>`, que no añade ningún elemento extra al HTML. `Board` lo hace así: devuelve un fragmento que contiene el `status` y las tres filas.

## Pregunta 3: Props

¿Qué son las props en React? ¿Por qué se dice que son de solo lectura y para qué se usan en el componente Square?

Las props son los datos que un componente padre pasa a un hijo, igual que los atributos de una etiqueta HTML: `<Square value={squares[0]} onSquareClick={...} />`. El hijo las recibe como un objeto, que normalmente se desestructura en los parámetros: `function Square({ value, onSquareClick })`.

Son de solo lectura porque un componente no debe cambiar sus propias props: son una "foto" de lo que le manda el padre, y quien las modifica es el padre, pasando valores nuevos en el siguiente renderizado. Así los datos fluyen siempre en una dirección y el comportamiento es predecible.

En `Square` se usan dos: `value` (lo que muestra la casilla: `"X"`, `"O"` o `null`) y `onSquareClick` (la función que se ejecuta cuando se hace clic en ella).

## Pregunta 4: Estado con useState

¿Para qué sirve el hook useState? ¿Qué dos elementos devuelve y qué representa cada uno?

`useState` es un hook que da memoria a un componente: sirve para guardar datos que cambian con el tiempo y hacer que React vuelva a dibujar el componente cuando cambian. Una variable normal se perdería en cada renderizado.

Devuelve un array de dos elementos, que se suelen desestructurar:

- El **valor actual** del estado.
- Una **función para actualizarlo**, que además provoca un nuevo renderizado.

```js
const [currentMove, setCurrentMove] = useState(0);   // valor actual y su función
const [history, setHistory] = useState([Array(9).fill(null)]);
```

El argumento de `useState` es el valor inicial. En `Game` se guardan `history` y `currentMove`.

## Pregunta 5: Manejo de eventos

¿Cómo se asocia una función a un evento de clic en un elemento JSX? Pon como ejemplo el manejador handleClick del Square.

Se añade el atributo `onClick` al elemento (en camelCase) y se le pasa **la función**, entre llaves, sin llamarla: `onClick={miFuncion}`. React la ejecuta cuando ocurre el clic.

En el tutorial, `Square` empieza con su propio manejador:

```js
function Square({ value }) {
  function handleClick() {
    console.log('¡clic!');
  }
  return <button className="square" onClick={handleClick}>{value}</button>;
}
```

Después el manejador se mueve a `Board` (`handleClick(i)`), y `Square` recibe la función por la prop `onSquareClick`: `<button className="square" onClick={onSquareClick}>`. Así, el clic en una casilla acaba ejecutando el `handleClick` del tablero.

## Pregunta 6: Elevar el estado (Lifting State Up)

¿En qué consiste la técnica de "elevar el estado" (lifting state up)? ¿Por qué fue necesario mover el estado de Square a Board en el tutorial?

Consiste en mover el estado al ancestro común más cercano de los componentes que necesitan ese dato, para que el padre lo guarde y lo reparta a los hijos por props. Los hijos avisan de los cambios llamando a funciones que reciben del padre.

Al principio cada `Square` guardaba su propio valor con `useState`. Eso no sirve porque una casilla no sabe qué hay en las otras, y el juego necesita ver las 9 a la vez para saber de quién es el turno y si hay ganador. Por eso el estado `squares` se movió a `Board`, que pasa a cada `Square` su `value` y su `onSquareClick`.

Más adelante se eleva otra vez, de `Board` a `Game`, para poder guardar el historial completo de tableros y viajar a jugadas anteriores.

## Pregunta 7: Inmutabilidad

¿Qué significa que los datos en React deben tratarse de forma inmutable? ¿Qué ventajas aporta copiar el array squares (por ejemplo con slice()) en lugar de modificarlo directamente?

Inmutable significa no modificar los datos originales: para cambiar algo se hace una **copia**, se cambia la copia y se entrega al estado con su función (`setSquares`, `onPlay`). En `Board`:

```js
const nextSquares = squares.slice();   // copia del array
nextSquares[i] = "X";                  // se cambia la copia
onPlay(nextSquares);
```

Ventajas: se conservan las versiones anteriores, lo que permite el historial y "volver a la jugada N" (`jumpTo`); React detecta que algo cambió comparando referencias, que es muy barato; los componentes que no cambian no se vuelven a dibujar (mejor rendimiento); y el código es más predecible, porque nada cambia por sorpresa en otro sitio.

## Pregunta 8: Renderizado condicional

¿Cómo se muestra en el tutorial un mensaje distinto según si hay un ganador o si la partida continúa? Explica el uso de if / else para construir el texto de status.

En cada renderizado, `Board` llama a `calculateWinner(squares)`, que devuelve `"X"`, `"O"` o `null`. Con ese resultado se decide el texto con un `if / else` normal de JavaScript y se guarda en la variable `status`:

```js
const winner = calculateWinner(squares);
let status;
if (winner) {
  status = "Winner: " + winner;
} else {
  status = "Next player: " + (xIsNext ? "X" : "O");
}
// ...
<div className="status">{status}</div>
```

Si hay ganador se muestra "Winner: X" (o "O"); si no, "Next player:" con el jugador al que le toca. Como el componente se vuelve a ejecutar tras cada jugada, el mensaje se actualiza solo. El mismo `calculateWinner` se usa al principio de `handleClick` para bloquear el tablero cuando la partida ha terminado.

## Pregunta 9: Funciones flecha como callbacks

¿Por qué se usa () => handleClick(0) en lugar de handleClick(0) directamente al pasar la función al onClick de un Square?

`onClick` necesita recibir una **función** que React ejecutará más tarde, cuando se haga clic. Si se escribe `onSquareClick={handleClick(0)}`, la llamada se ejecuta **en ese mismo momento, mientras se dibuja el tablero**, y lo que se pasa a `onClick` es el resultado (`undefined`), no una función.

Además, `handleClick(0)` cambia el estado con `setSquares`/`onPlay`, y cambiar el estado durante el renderizado provoca otro renderizado, que vuelve a llamar a `handleClick(0)`, y así sin parar: React lanza el error "Too many re-renders" (bucle infinito).

Con `() => handleClick(0)` se pasa una función flecha que solo llama a `handleClick(0)` cuando ocurre el clic. También es la forma de indicar el argumento (qué casilla es), cosa que no se podría hacer pasando `handleClick` a secas.

## Cómo ejecutarlo

```bash
npm install
npm start
```

Se abre en http://localhost:3000. Para generar la versión de producción: `npm run build`.
