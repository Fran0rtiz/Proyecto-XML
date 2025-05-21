// Variables 
let questions, current = 0, score = 0, timer = 0, interval, selectedAnswers = [];
let xmlFile = "";

// Seleccionar el archivo XML
function setLanguage(file) {
  xmlFile = file;
  // Habilita el botón de inicio 
  document.getElementById("start-btn").disabled = false;
}

// Iniciar el cuestionario
function startQuiz() {
  clearInterval(interval);  
  timer = 0;
  score = 0;
  current = 0;
  selectedAnswers = [];

  //Oculta la selección de idioma y botón de inicio
  document.getElementById("quiz-section").style.display = "block";
  document.getElementById("start-section").style.display = "none";
  document.getElementById("language-selection").style.display = "none";
  document.getElementById("score").innerHTML = "";

  // Carga el archivo XML con las preguntas
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const xmlDoc = this.responseXML;
      questions = xmlDoc.getElementsByTagName("question");
      startTimer(); 
      showQuestion(); 
    }
  };
  xhttp.open("GET", xmlFile, true);
  xhttp.send();
}

// Inicia el temporizador y lo actualiza 
function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = `⏱️ Tiempo: ${timer}s`;
  }, 1000);
}

// Muestra la pregunta actual
function showQuestion() {
  if (!questions || current >= questions.length || current < 0) return;

  const q = questions[current];
  const wording = q.getElementsByTagName("wording")[0].textContent;
  const choices = q.getElementsByTagName("choice");

  // Muestra la pregunta con su número
  document.getElementById("question").innerHTML = `${current + 1}. ${wording}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  // Crea un div para cada respuesta
  for (let i = 0; i < choices.length; i++) {
    const div = document.createElement("div");
    div.className = "respuesta";
    div.textContent = choices[i].textContent;

    if (selectedAnswers[current] === i) {
      div.classList.add("seleccionada");
    }

    div.onclick = function () {
      const all = document.querySelectorAll('.respuesta');
      all.forEach(r => r.classList.remove('seleccionada'));
      div.classList.add("seleccionada");
      
      selectedAnswers[current] = i;

      // Si la respuesta es correcta aumentamos la puntuación
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

// Muestra la siguiente pregunta si hay
function nextQuestion() {
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    // Fin del test
    clearInterval(interval);
    document.getElementById("question").innerHTML = "¡Fin del test!";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("score").innerHTML = `Puntuación: ${score}/${questions.length}`;
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    showQuestion();
  }
}
