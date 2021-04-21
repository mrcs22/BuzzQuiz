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
  renderQuestions(quizz.questions);

  landingScreen.classList.add("ocult");
  quizzPlayer.classList.remove("ocult");
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

function renderQuestions(questions) {
  const questionsList = document.querySelector(".quizz-player ul");

  questions.forEach((question) => {
    const answers = question.answers;

    const li = document.createElement("li");
    li.classList.add("quizz-question");

    const header = document.createElement("div");
    header.classList.add("question-header");

    const title = document.createElement("strong");
    title.innerHTML = question.title;

    const options = document.createElement("div");
    options.classList.add("answers");

    answers.forEach((answer) => {
      const div = document.createElement("div");

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
const question = ` <li class="quizz-question">
            <div class="question-header">
              <strong> jahjash askjdhkjadh kjahsdkjhas?</strong>
            </div>
            <div class="answers">
              <div>
                <img
                  src="https://s3cf.recapguide.com:444/img/tv/24/7x24/Friends-Season-7-Episode-24-2-e9d3.jpg"
                  alt=""
                />
                <strong>Alguma coisa</strong>
              </div>
            </div>
          </li>`;
