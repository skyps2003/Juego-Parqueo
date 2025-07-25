const mainCar = document.getElementById("main-car");

// Estado inicial
let carX = 15;   // Posición inicial izquierda (%)
let carY = 65;   // Posición inicial arriba (%)
let angle = -Math.PI/2; // Apunta hacia arriba inicialmente
let speed = 0;    // Velocidad actual
const maxSpeed = 0.3;    // Velocidad máxima hacia adelante
const maxReverseSpeed = 0.15; // Velocidad máxima en reversa
const acceleration = 0.01;   // Aceleración suave
const deceleration = 0.02;   // Frenado suave
const rotationSpeed = 1.5 * Math.PI / 180; // Giro suave
const minSpeedToTurn = 0.1;  // Velocidad mínima para girar

// Solo teclas de flecha
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

// Eventos de teclado
window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
    e.preventDefault();
  }
});

// Física del coche mejorada
function updateCar() {
  // Aceleración/Frenado (CORREGIDO)
  if (keys.ArrowUp && !keys.ArrowDown) {
    speed = Math.min(speed + acceleration, maxSpeed);
  } else if (keys.ArrowDown && !keys.ArrowUp) {
    speed = Math.max(speed - acceleration, -maxReverseSpeed);
  } else {
    // Desaceleración natural
    if (speed > 0) speed = Math.max(speed - deceleration/2, 0);
    else if (speed < 0) speed = Math.min(speed + deceleration/2, 0);
  }

  // Rotación (solo si el coche se mueve) (CORREGIDO)
  if (Math.abs(speed) > minSpeedToTurn) {
    const turnMultiplier = speed > 0 ? 1 : 0.7; // Giro más lento en reversa
    const effectiveTurnSpeed = rotationSpeed * (Math.abs(speed)/maxSpeed) * turnMultiplier;
    
    if (keys.ArrowLeft && !keys.ArrowRight) angle += effectiveTurnSpeed; // INVERTIDO
    if (keys.ArrowRight && !keys.ArrowLeft) angle -= effectiveTurnSpeed; // INVERTIDO
  }

  // Movimiento (CORREGIDO)
  carX -= Math.cos(angle) * speed; // INVERTIDO el signo -
  carY -= Math.sin(angle) * speed; // INVERTIDO el signo -

  // Límites del área de juego
  carX = Math.max(0, Math.min(90, carX));
  carY = Math.max(0, Math.min(90, carY));

  // Aplicar transformaciones
  mainCar.style.left = carX + "%";
  mainCar.style.top = carY + "%";
  mainCar.style.transform = `rotate(${angle + Math.PI/2}rad)`; // Ajuste visual

  checkParking();
  requestAnimationFrame(updateCar);
}

// Verificación de estacionamiento
function checkParking() {
  const parkingX = 80;
  const parkingY = 40;
  const parkingAngle = 0; // Orientación correcta (hacia la derecha)
  const angleMargin = 0.3; // Margen de error (~17°)

  // Verificar posición, orientación y velocidad
  const inPosition = Math.abs(carX - parkingX) < 3 && Math.abs(carY - parkingY) < 3;
  const goodAngle = Math.abs(((angle - parkingAngle + Math.PI) % (2 * Math.PI) - Math.PI)) < angleMargin;
  const stopped = Math.abs(speed) < 0.1;

  if (inPosition && goodAngle && stopped) {
    document.getElementById("instruction").innerText = "¡ESTACIONASTE PERFECTO! 🎉";
    speed = 0; // Detener completamente
  }
}

// Iniciar el juego
updateCar();