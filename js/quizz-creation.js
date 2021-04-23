// quizz-creation

function validateStringLen(string) {
    let lessEqual;
    const greaterEqual = string.text.length >= string.minValue;

    if(string.maxValue) {
        lessEqual = string.text.length <= string.maxValue;
    }
    else {
        lessEqual = true;
    }
    
    if(greaterEqual && lessEqual) {
        return true;
    }
    else {
        alert(string.message);
        return false;
    }
}

function validURL(str) { // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function validateQuizzImgUrl(stage, ImgURL) {
    const isValidURL = validURL(ImgURL);

    if(isValidURL) {
        const imgURLTest = '<img style="display: none" id="image" onerror="errorCallback()" onload="loadCallback()" />'
        const innerHTML = stage.querySelector("div").innerHTML;
        stage.querySelector("div").innerHTML += imgURLTest;
        document.getElementById('image').src = ImgURL;
        setTimeout((innerHTML, stage) => stage.querySelector("div").innerHTML = innerHTML, 300, innerHTML, stage);
        return true;
    }
    else {
        alert("URL inválida");
        return false;
    }
}

function foldControl(element, parentElementClass) {
    
    document.querySelectorAll(parentElementClass).forEach((parentElement) => parentElement.classList.add("fold"));
    element.parentElement.classList.remove("fold");
}

// start

const newQuizzObj = {};
let isImgURLValid;


function validateStartQuizzCreation() {

    const start = document.querySelector(".start")
    const imgURL = start.querySelector("input:nth-child(2)").value;
    isImgURLValid = validateQuizzImgUrl(start, imgURL);
    newQuizzObj.image = imgURL;

    const quizzTitle = start.querySelector("input:first-child").value;
    const quizzTitleObj = { text: quizzTitle, minValue: 20, maxValue: 65, message: "O Título do quizz deve ter no mínimo 20 e no máximo 65 caracteres" }
    const isTitleValid = validateStringLen(quizzTitleObj);
    newQuizzObj.title = quizzTitle;

    const isQuestionsLevelsValid = validateHowManyQuestionsLevels(start);

    setTimeout(function (bool, bool2) { if(bool && bool2 && isImgURLValid) { startToQuestions(); }}, 350, isTitleValid, isQuestionsLevelsValid);
}

function startToQuestions() {
    buildQuestions();
    document.querySelector(".start").classList.add("ocult");
    document.querySelector(".questions").classList.remove("ocult");
}

function errorCallback() {
    alert("A imagem não existe");
    isImgURLValid = false;
}

function loadCallback() {
    console.log("img existe");
    isImgURLValid = true;
}



function validateHowManyQuestionsLevels(stage) {
    const questions = parseInt(stage.querySelector("input:nth-child(3)").value);
    const levels = parseInt(stage.querySelector("input:last-child").value);

    if(!questions) {
        alert("Insira um número para Qtd de perguntas");
        return false;
    }
    if(!levels) {
        alert("Insira um número para Qtd de níveis");
        return false; 
    }
    
    const isNumQuestionsValid = questions >= 3;
    const isNumLevelsValid = levels >= 2;

    if(isNumQuestionsValid && isNumLevelsValid) {
        newQuizzObj.questions = new Array(questions);
        newQuizzObj.levels = new Array(levels);
        return true
    }
    else {
        alert("Quantidade de perguntas: no mínimo 3 perguntas\nQuantidade de níveis: no mínimo 2 níveis")
        return false;
    }

}

// questions

function buildQuestions() {
    const questions = document.querySelector(".questions")
    
    questions.innerHTML =  `<div>
                                <h2>Crie suas perguntas</h2>
                            </div>`
    

    for(let i = 1; i < newQuizzObj.questions.length + 1; i++) {

        let fold = ""
        if (i >= 2) { fold = " fold"; }

        questions.innerHTML +=  `<div class="question${fold}">
                                    <div class="question-head" onclick="foldControl(this, '.question')">
                                        <h3>Pergunta ${i}</h3>
                                        <ion-icon name="create-outline"></ion-icon>
                                    </div>
                                    <div class="question-body">
                                    <div class="text-field">
                                        <input type="text" placeholder="Texto da pergunta" />
                                        <input type="text" placeholder="Cor de fundo da pergunta" />
                                    </div>
                                    <div>
                                        <h3>Resposta correta</h3>
                                    </div>
                                    <div class="text-field">
                                        <input type="text" placeholder="Resposta correta" />
                                        <input type="text" placeholder="URL da imagem" />
                                    </div>
                                    <div>
                                        <h3>Respostas incorretas</h3>
                                    </div>
                                    <div class="text-field">
                                        <input type="text" placeholder="Resposta incorreta 1" />
                                        <input type="text" placeholder="URL da imagem 1" />
                                    </div>
                                    <div class="text-field">
                                        <input type="text" placeholder="Resposta incorreta 2" />
                                        <input type="text" placeholder="URL da imagem 2" />
                                    </div>
                                    <div class="text-field">
                                        <input type="text" placeholder="Resposta incorreta 3" />
                                        <input type="text" placeholder="URL da imagem 3" />
                                    </div>
                                    </div>
                                </div>`

    }

    questions.innerHTML +=  `<div>
                                <button onclick="validateQuestionsQuizzCreation()">Prosseguir pra criar níveis</button>
                            </div>`
}

function validateQuestionsQuizzCreation() {
    const questions = document.querySelector(".questions");
    const questionsList = questions.querySelectorAll(".question-body");

    newQuizzObj.questions = [];
    let isValid = true;
    for(let i = 0; i < questionsList.length; i++) {
        const textFieldList = questionsList[i].querySelectorAll(".text-field");

        // question

        const questionTitle = textFieldList[0].querySelector("input:first-child").value;
        const questionTitleObj = { text: questionTitle, minValue: 20, message: `O Título da pergunta ${i+1} deve ter no mínimo 20 caracteres` };
        const isQuestionTitleValid = validateStringLen(questionTitleObj);
        if(!isQuestionTitleValid) {isValid = false;}
        newQuizzObj.questions[i] = ({ title: questionTitle});

        const questionColor = textFieldList[0].querySelector("input:last-child").value
        const isColorValid = isColor(questionColor, i);
        if(!isColorValid) {isValid = false;}
        newQuizzObj.questions[i].color = questionColor;

        // correct answer

        newQuizzObj.questions[i].answers = [];
        const correctAnswerText = textFieldList[1].querySelector("input:first-child").value;
        const correctAnswerTextObj = { text: correctAnswerText, minValue: 1, message: `A resposta da pergunta ${i+1} não pode ser vazia` };
        const isCorrectAnswerTextValid = validateStringLen(correctAnswerTextObj);
        if(!isCorrectAnswerTextValid) {isValid = false;}
        newQuizzObj.questions[i].answers[0] = { text: correctAnswerText};

        const correctAnswerURL = textFieldList[1].querySelector("input:last-child").value
        const isCorrectAnswerURLValid = validateQuizzImgUrl(questions, correctAnswerURL);
        if(!isCorrectAnswerURLValid) {isValid = false;}
        newQuizzObj.questions[i].answers[0].image = correctAnswerURL;

        newQuizzObj.questions[i].answers[0].isCorrectAnswer = true;

        // wrong answers

        const atLeastOneIncorrectAnswer = [];
        for(let j = 2; j < textFieldList.length; j++) {
        
            const incorrectAnswerText = textFieldList[j].querySelector("input:first-child").value;
            newQuizzObj.questions[i].answers[j-1] = { text: incorrectAnswerText};

            const incorrectAnswerURL = textFieldList[j].querySelector("input:last-child").value
            let isInCorrectAnswerURLValid = false;
            if(incorrectAnswerURL) {
                isInCorrectAnswerURLValid = validateQuizzImgUrl(questions, incorrectAnswerURL);
            }
            newQuizzObj.questions[i].answers[j-1].image = incorrectAnswerURL;

            newQuizzObj.questions[i].answers[j-1].isCorrectAnswer = false;
            
            if (incorrectAnswerText && incorrectAnswerURL) {
                atLeastOneIncorrectAnswer.push(true);
            }
            else {
                atLeastOneIncorrectAnswer.push(false);
            }
        }
        if (!atLeastOneIncorrectAnswer.find(bool => bool === true )) {
            alert(`Deve ter pelos menos uma resposta incorreta na pergunta ${i+1}`)
            isValid = false
        }      
    }
    if(isValid) {
        questionsToLevels();
    }
}

function isColor(strColor, index){
    const s = new Option().style;
    s.color = strColor;
    if(s.color != strColor) { alert(`Código de cor da pergunta ${index+1} inválido!`); }
    return s.color == strColor;
}

function questionsToLevels() {
    buildLevels();
    document.querySelector(".questions").classList.add("ocult");
    document.querySelector(".levels").classList.remove("ocult");
}

// levels

function buildLevels() {
    const levels = document.querySelector(".levels")
    
    levels.innerHTML =  `<div>
                                <h2>Crie suas perguntas</h2>
                            </div>`
    

    for(let i = 1; i < newQuizzObj.levels.length + 1; i++) {

        let fold = ""
        if (i >= 2) { fold = " fold"; }

        levels.innerHTML += `<div class="level${fold}">
                                    <div class="level-head" onclick="foldControl(this, '.level')">
                                    <h3>Nível ${i}</h3>
                                    <ion-icon name="create-outline"></ion-icon>
                                    </div>
                                    <div class="level-body">
                                    <div class="text-field">
                                        <input type="text" placeholder="Título do nível" />
                                        <input type="text" placeholder="% de acerto mínima" />
                                        <input type="text" placeholder="URL da imagem do nível" />
                                        <input
                                        type="text"
                                        placeholder="Descrição do nível"
                                        class="description"
                                        />
                                    </div>
                                    </div>
                                </div>`

    }

    levels.innerHTML +=  `<div>
                                <button onclick="validateLevelsQuizzCreation()">Finalizar Quizz</button>
                            </div>`
}

function validateLevelsQuizzCreation() {
    const levels = document.querySelector(".levels");
    const levelsList = levels.querySelectorAll(".level-body");

    let atLeastOneZero = false;
    let isValid = true

    newQuizzObj.levels = [];
    for(let i = 0; i < levelsList.length; i++) {
        const textFieldList = levelsList[i].querySelector(".text-field");

        const levelTitle = textFieldList.querySelector("input:first-child").value;
        const levelTitleObj = { text: levelTitle, minValue: 10, message: `O Título do nível ${i+1} deve ter no mínimo 10 caracteres` };
        const isLevelTitleValid = validateStringLen(levelTitleObj);
        if(!isLevelTitleValid) { isValid = false; }
        newQuizzObj.levels.push({ title: levelTitle});

        const levelMinValue = textFieldList.querySelector("input:nth-child(2)").value;
        if(levelMinValue == 0) { atLeastOneZero = true; }
        console.log(levelMinValue);
        const isLevelMinValueValid = isInRange(levelMinValue, 0, 100);
        if(!isLevelMinValueValid) { isValid = false; }
        if(!isLevelMinValueValid) { alert("% de acerto mínima deve ser entra 0 e 100") }
        newQuizzObj.levels[i].minValue = levelMinValue;

        const levelURL = textFieldList.querySelector("input:nth-child(3)").value
        const islevelURLValid = validateQuizzImgUrl(levels, levelURL);
        if(!islevelURLValid) { isValid = false; }
        newQuizzObj.levels[i].image = levelURL;

        const levelDescription = textFieldList.querySelector("input:last-child").value;
        const levelDescriptionObj = { text: levelDescription, minValue: 30, message: `A descrição do nível ${i+1} deve ter no mínimo 30 caracteres` };
        const isLevelDescriptionValid = validateStringLen(levelDescriptionObj);
        if(!isLevelDescriptionValid) { isValid = false; }
        newQuizzObj.levels[i].text = levelDescription;
    }
    console.log(newQuizzObj);
    console.log(isValid);
    console.log(atLeastOneZero);
    if(isValid && atLeastOneZero) {
        levelToFinished()
    }
}   

function isInRange(num, a, b) {
    const greaterEqual = num >= a;
    const lessEqual = num <= b;
    if(greaterEqual && lessEqual){
        return true;
    } 
    else {
        return false;
    }
}

function levelToFinished() {
    // buildFinished();
    document.querySelector(".levels").classList.add("ocult");
    document.querySelector(".finished").classList.remove("ocult"); 
}