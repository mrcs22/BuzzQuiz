let score = 0;
let selectedQuizzData = null;
start();

function newQuizz() {
  console.log("mee");
  const landingScreen = document.querySelector(".landingScreen");
  const quizzCreation = document.querySelector(".quizz-creation");

  landingScreen.classList.add("ocult");
  quizzCreation.classList.remove("ocult");
}
function start() {
  spinner("start");
  renderQuizzes();
}

async function renderQuizzes() {
  const quizzesList = document.querySelector(".quizzes");
  const landingScreen = document.querySelector(".landingScreen");
  const quizzes = await getQuizzes();

  quizzes.forEach((quizz) => {
    const li = document.createElement("li");
    li.classList.add("quizz");
    li.setAttribute("onclick", `startQuizz(${quizz.id})`);

    const img = document.createElement("img");
    img.setAttribute("src", quizz.image);
    img.setAttribute("alt", quizz.title);

    const p = document.createElement("p");
    p.innerHTML = quizz.title;

    li.appendChild(img);
    li.appendChild(p);

    quizzesList.appendChild(li);
  });

  spinner("stop");
  landingScreen.classList.remove("ocult");
}

async function getQuizzes() {
  const response = await axios.get(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes"
  );

  return response.data;
}

async function startQuizz(quizzId) {
  score = 0;
  const landingScreen = document.querySelector(".landingScreen");
  const quizzPlayer = document.querySelector(".quizz-player");

  const restartQuizzButton = document.querySelector(
    ".quizz-finish-options button"
  );

  landingScreen.classList.add("ocult");
  spinner("start");
  const quizz = await getQuizz(quizzId);

  restartQuizzButton.setAttribute("onclick", `restartQuizz(${quizzId})`);

  renderBanner(quizz.title, quizz.image);
  renderQuestions(quizz.questions, quizzId);

  spinner("stop");
  quizzPlayer.classList.remove("ocult");

  window.scrollTo(0, 0);
}

async function getQuizz(id) {
  const response = await axios.get(
    `https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`
  );

  selectedQuizzData = response.data;

  return response.data;
}

function renderBanner(title, imageLink) {
  const banner = document.querySelector(".banner");
  banner.innerHTML = "";

  const img = document.createElement("img");
  img.setAttribute("src", imageLink);
  img.setAttribute("alt", title);

  const p = document.createElement("p");
  p.innerHTML = title;

  banner.appendChild(img);
  banner.appendChild(p);

  banner.classList.remove("ocult");
}

function renderQuestions(questions, quizzId) {
  const questionsList = document.querySelector(".quizz-player ul");
  questionsList.innerHTML = "";

  questions.forEach((question, questionIndex) => {
    const answers = question.answers;

    answers.sort(() => {
      return ive - serverMath.random() - 0.5;
    });

    const li = document.createElement("li");
    li.classList.add("quizz-question");
    li.setAttribute("id", `question${questionIndex}`);

    const header = document.createElement("div");
    header.classList.add("question-header");
    header.style.backgroundColor = question.color;

    const title = document.createElement("strong");
    title.innerHTML = question.title;

    const options = document.createElement("div");
    options.classList.add("answers");

    answers.forEach((answer, answerIndex) => {
      const div = document.createElement("div");
      div.setAttribute("id", `answer${answerIndex}`);
      div.setAttribute(
        "onclick",
        `checkAnswer(this, ${quizzId}, ${questionIndex}, ${answerIndex})`
      );

      const img = document.createElement("img");
      img.setAttribute("src", answer.image);
      img.setAttribute("alt", answer.text);

      const text = document.createElement("strong");
      text.innerHTML = answer.text;

      div.appendChild(img);
      div.appendChild(text);

      options.appendChild(div);
    });

    header.appendChild(title);
    li.appendChild(header);
    li.appendChild(options);

    questionsList.appendChild(li);
  });
}

async function checkAnswer(selectedAnswer, quizzId, questionIndex) {
  const question = document.getElementById(`question${questionIndex}`);
  let answers = question.querySelector(".answers").children;
  answers = Array.prototype.slice.call(answers);

  const correctAnswerId = getCorrectAnswerId(quizzId, questionIndex);

  answers.forEach((answer) => {
    if (answer.id === correctAnswerId) {
      answer.classList.add("unselected", "correct-answer");
    } else {
      answer.classList.add("unselected", "wrong-answer");
    }
    answer.setAttribute("onclick", "");
  });

  selectedAnswer.classList.remove("unselected");

  if (selectedAnswer.id === correctAnswerId) {
    score++;
  }

  scrollToNextQuestion(questionIndex);
}

function getCorrectAnswerId(quizzId, questionIndex) {
  const selectedQuestionAnswers =
    selectedQuizzData.questions[questionIndex].answers;

  const indexOfCorrectAswer = selectedQuestionAnswers.findIndex(
    (answer) => answer.isCorrectAnswer
  );

  return `answer${indexOfCorrectAswer}`;
}

function scrollToNextQuestion(questionIndex) {
  setTimeout(() => {
    const nextQuestion = document.getElementById(
      `question${questionIndex + 1}`
    );
    if (nextQuestion !== null) {
      nextQuestion.scrollIntoView({ behavior: "smooth" });
    } else {
      renderResultScreen();
    }
  }, 2000);
}

function renderResultScreen() {
  const resultDiv = document.getElementById("resultDiv");

  const optionsDiv = document.querySelector(".quizz-finish-options");
  const scorePercentage =
    (score / selectedQuizzData.questions.length).toFixed(2) * 100;
  const reachedLevel = getReachedLevel(scorePercentage);

  const header = document.createElement("div");
  header.classList.add("question-header");
  header.style.backgroundColor = "#EC362D";

  const title = document.createElement("strong");
  title.innerHTML = `${scorePercentage}% de acerto: ${selectedQuizzData.levels[reachedLevel].title}`;

  const content = document.createElement("div");

  const img = document.createElement("img");
  img.setAttribute("src", selectedQuizzData.levels[reachedLevel].image);

  const p = document.createElement("p");
  p.innerHTML = selectedQuizzData.levels[reachedLevel].text;

  content.appendChild(img);
  content.appendChild(p);

  header.appendChild(title);
  resultDiv.appendChild(header);
  resultDiv.appendChild(content);
  resultDiv.scrollIntoView({ behavior: "smooth" });

  resultDiv.classList.remove("ocult");
  optionsDiv.classList.remove("ocult");

  resultDiv.scrollIntoView({ behavior: "smooth" });
}

function getReachedLevel(scorePercentage) {
  const levelsList = selectedQuizzData.levels.map((level) => level.minValue);

  let reachedLevel = 0;

  levelsList.forEach((level, index) => {
    if (scorePercentage >= level) {
      reachedLevel = index;
    }
  });

  return reachedLevel;
}

function restartQuizz(quizzId) {
  const resultDiv = document.getElementById("resultDiv");
  const optionsDiv = document.querySelector(".quizz-finish-options");

  resultDiv.innerHTML = "";

  optionsDiv.classList.add("ocult");
  resultDiv.classList.add("ocult");

  startQuizz(quizzId);
  window.scrollTo(0, 0);
}

function backHome() {
  const banner = document.querySelector(".banner");
  const resultDiv = document.getElementById("resultDiv");
  const landingScreen = document.querySelector(".landingScreen");
  const quizzPlayer = document.querySelector(".quizz-player");

  banner.classList.add("ocult");
  landingScreen.classList.remove("ocult");
  quizzPlayer.classList.add("ocult");

  resultDiv.innerHTML = "";
  window.scrollTo(0, 0);
}

function spinner(action) {
  const spinner = document.querySelector(".spinner");

  if (action === "start") {
    spinner.classList.remove("ocult");
  }
  if (action === "stop") {
    spinner.classList.add("ocult");
  }
}
