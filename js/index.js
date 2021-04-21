start();

function start() {
  renderQuizzes();
}

async function renderQuizzes() {
  const quizzesList = document.querySelector(".quizzes");
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
}

async function getQuizzes() {
  const response = await axios.get(
    "https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes"
  );

  return response.data;
}

async function startQuizz(quizzId) {
  const landingScreen = document.querySelector(".landingScreen");
  const quizzPlayer = document.querySelector(".quizz-player");

  const quizz = await getQuizz(quizzId);

  renderBanner(quizz.title, quizz.image);

  landingScreen.classList.add("ocult");
  quizzPlayer.classList.remove(ocult);

  alert(quizzId);
}

async function getQuizz(id) {
  const response = await axios.get(
    `https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`
  );

  return response.data;
}

function renderBanner(title, imageLink) {
  const banner = document.querySelector(".banner");

  const img = document.createElement("img");
  img.setAttribute("src", imageLink);
  img.setAttribute("alt", title);

  const p = document.createElement("p");
  p.innerHTML = title;

  banner.appendChild(img);
  banner.appendChild(p);

  banner.classList.remove("ocult");
}
