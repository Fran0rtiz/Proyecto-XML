// Variables globales para controlar el cuestionario
let questions, current = 0, score = 0, timer = 0, interval, selectedAnswers = [];
let xmlFile = "";

// Función para seleccionar el archivo XML según el idioma
function setLanguage(file) {
  xmlFile = file;
  // Habilitamos el botón de inicio cuando se elige idioma
  document.getElementById("start-btn").disabled = false;
}

// Función para iniciar el cuestionario
function startQuiz() {
  clearInterval(interval);  // Limpiamos cualquier temporizador previo
  timer = 0;
  score = 0;
  current = 0;
  selectedAnswers = [];

  // Mostramos la sección del quiz y ocultamos la selección de idioma y botón de inicio
  document.getElementById("quiz-section").style.display = "block";
  document.getElementById("start-section").style.display = "none";
  document.getElementById("language-selection").style.display = "none";
  document.getElementById("score").innerHTML = "";

  // Petición AJAX para cargar el archivo XML con las preguntas
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const xmlDoc = this.responseXML;
      questions = xmlDoc.getElementsByTagName("question");
      startTimer();  // Arrancamos el temporizador
      showQuestion();  // Mostramos la primera pregunta
    }
  };
  xhttp.open("GET", xmlFile, true);
  xhttp.send();
}

// Función que inicia el temporizador y actualiza el tiempo mostrado cada segundo
function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = `⏱️ Tiempo: ${timer}s`;
  }, 1000);
}

// Función para mostrar la pregunta actual y sus posibles respuestas
function showQuestion() {
  if (!questions || current >= questions.length || current < 0) return;

  const q = questions[current];
  const wording = q.getElementsByTagName("wording")[0].textContent;
  const choices = q.getElementsByTagName("choice");

  // Mostramos el texto de la pregunta con su número
  document.getElementById("question").innerHTML = `${current + 1}. ${wording}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  // Creamos un div para cada opción de respuesta
  for (let i = 0; i < choices.length; i++) {
    const div = document.createElement("div");
    div.className = "respuesta";
    div.textContent = choices[i].textContent;

    // Si ya se había seleccionado esta respuesta, la marcamos visualmente
    if (selectedAnswers[current] === i) {
      div.classList.add("seleccionada");
    }

    // Al hacer clic sobre una respuesta, la marcamos y actualizamos el estado
    div.onclick = function () {
      // Quitamos la selección de todas las opciones
      const all = document.querySelectorAll('.respuesta');
      all.forEach(r => r.classList.remove('seleccionada'));
      div.classList.add("seleccionada");

      // Guardamos la respuesta seleccionada para la pregunta actual
      selectedAnswers[current] = i;

      // Si la respuesta es correcta y no había sido contada antes, aumentamos la puntuación
      if (choices[i].getAttribute("correct") === "yes") {
        if (!div.dataset.correct) {
          score++;
          div.dataset.correct = "true";
        }
      }
    };

    choicesDiv.appendChild(div);
  }
}

// Función para mostrar la siguiente pregunta o finalizar el test si no hay más
function nextQuestion() {
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    // Fin del test: detenemos el temporizador y mostramos la puntuación final
    clearInterval(interval);
    document.getElementById("question").innerHTML = "¡Fin del test!";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("score").innerHTML = `Puntuación: ${score}/${questions.length}`;
  }
}

// Función para mostrar la pregunta anterior
function prevQuestion() {
  if (current > 0) {
    current--;
    showQuestion();
  }
}
