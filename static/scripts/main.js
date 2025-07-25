window.addEventListener("load", () => {
  const startBtn = document.getElementById("start-btn");
  const dog = document.getElementById("dog");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  let progress = 0;
  const interval = setInterval(() => {
    progress += 2; 
    if (progress > 100) progress = 100;

    // Actualizar barra de carga y texto
    progressBar.style.width = progress + "%";
    progressText.textContent = progress + "%";

    // Mover perro proporcionalmente
    const trackWidth = document.querySelector(".race-track").offsetWidth;
    const dogMaxLeft = trackWidth - dog.offsetWidth - 80;
    dog.style.left = (progress / 100) * dogMaxLeft + "px";

    if (progress === 100) {
      clearInterval(interval);
      startBtn.classList.remove("hidden"); // Mostrar botón
    }
  }, 100);

  startBtn.addEventListener("click", () => {
      window.location.href = "principal.html";
  });
});
