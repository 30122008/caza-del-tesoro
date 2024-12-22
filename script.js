// Configuración del juego
const boardSize = 5; // Tamaño del tablero (5x5)
let treasurePosition = {}; // Guardará la posición del tesoro
let attempts = 10; // Número de intentos que cada jugador tiene para encontrar el tesoro
let turnoJugador = 1; // Jugador 1 comienza
let puntajeJugador1 = 0; // Puntaje del jugador 1
let puntajeJugador2 = 0; // Puntaje del jugador 2


// Elementos del DOM
const board = document.getElementById("game-board");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
const turnoDisplay = document.getElementById("turno");
const puntajeDisplay = document.getElementById("puntaje");

// Inicializa el juego
function initGame() {
    
    // Generar posición aleatoria del tesoro
    treasurePosition = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
    attempts = 10; // Reinicia los intentos
    message.textContent = `Tienes ${attempts} intentos para encontrar el tesoro.`;
    turnoDisplay.textContent = `Es el turno del Jugador ${turnoJugador}`;
    puntajeDisplay.textContent = `Puntajes - Jugador 1: ${puntajeJugador1} | Jugador 2: ${puntajeJugador2}`;
    board.innerHTML = ""; // Limpia el tablero
  
    // Crear celdas del tablero
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        board.appendChild(cell);
      }
    }
  }
  
// Calcular la distancia entre dos puntos
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
// Manejador de clic en las celdas
board.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell") || e.target.classList.contains("clicked")) return;
  
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const distance = calculateDistance(row, col, treasurePosition.x, treasurePosition.y);
  
    e.target.classList.add("clicked");
    attempts--;
 // Verificar si el jugador ha encontrado el tesoro
 if (row === treasurePosition.x && col === treasurePosition.y) {
    if (turnoJugador === 1) {
      puntajeJugador1++; // Incrementar puntaje de jugador 1
    } else {
      puntajeJugador2++; // Incrementar puntaje de jugador 2
    }
    message.textContent = `¡Felicidades Jugador ${turnoJugador}! Encontraste el tesoro 🎉`;
    board.querySelectorAll(".cell").forEach(cell => cell.classList.add("clicked"));
  } else if (attempts === 0) {
    message.textContent = "¡Oh no! Te quedaste sin intentos 😢";
    board.querySelectorAll(".cell").forEach(cell => cell.classList.add("clicked"));
  } else {
    message.textContent = `Intentos restantes: ${attempts}. Estás ${distance < 2 ? "¡caliente!" : "frío"}.`;
  }

  // Cambiar de turno
  turnoJugador = turnoJugador === 1 ? 2 : 1;
  turnoDisplay.textContent = `Es el turno del Jugador ${turnoJugador}`;
  puntajeDisplay.textContent = `Puntajes - Jugador 1: ${puntajeJugador1} | Jugador 2: ${puntajeJugador2}`;
});
  
// Reiniciar el juego
restartButton.addEventListener("click", initGame);

// Iniciar el juego al cargar
initGame();


// Función para establecer una cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Cookie expira en "days" días
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;  // Guardamos la cookie con su nombre y valor
  }
// Función para obtener una cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';'); // Separa todas las cookies
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);  // Devuelve el valor de la cookie si la encuentra
    }
    return null;  // Si no la encuentra, devuelve null
  }
  function endGame(messageText, finalScore) {
    setCookie('lastScore', finalScore, 7); // Guardar el puntaje en una cookie con una duración de 7 días
    message.textContent = messageText;  // Muestra el mensaje final
  }
   // Mostrar puntaje anterior si existe
window.onload = function() {
    const lastScore = getCookie('lastScore');
    if (lastScore) {
      message.textContent = `Tu puntaje anterior: ${lastScore} intentos.`;
    } else {
      message.textContent = "¡Es tu primer juego!";
    }
  };
  
  window.onload = initGame; // Llama a initGame cuando la página se carga
