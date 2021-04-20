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
