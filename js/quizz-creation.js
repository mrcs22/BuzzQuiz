// start

const newQuizzObj = {};
let isImgURLValid;


function validadeStartQuizzCreation() {
    const start = document.querySelector(".start")
    validateQuizzImgUrl(start);
    const isTitleValid = validateQuizzTitle(start);
    const isQuestionsLevelsValid = validadeHowManyQuestionsLevels(start);

    setTimeout(function (bool, bool2) { if(bool && bool2 && isImgURLValid) { startToQuestions(); }}, 350, isTitleValid, isQuestionsLevelsValid);
}

function startToQuestions() {
    document.querySelector(".start").classList.add("ocult");
    document.querySelector(".questions").classList.remove("ocult");
}

function validateQuizzTitle(stage) {
    
    const quizzTitle = stage.querySelector("input:first-child").value;
    const greaterEqual20 = quizzTitle.length >= 20;
    const lessEqual65 = quizzTitle.length <= 65;
    
    if(greaterEqual20 && lessEqual65) {
        newQuizzObj.title = quizzTitle;
        return true;
    }
    else {
        alert("O Título do quizz deve ter no mínimo 20 e no máximo 65 caracteres");
        return false;
    }
}

function validateQuizzImgUrl(stage) {
    const quizzImgURL = stage.querySelector("input:nth-child(2)").value;
    const isValidURL = validURL(quizzImgURL);

    if(isValidURL) {
        const imgURLTest = '<img style="display: none" id="image" onerror="errorCallback()" onload="loadCallback()" />'
        const innerHTML = stage.querySelector("div").innerHTML;
        stage.querySelector("div").innerHTML += imgURLTest;
        document.getElementById('image').src = quizzImgURL;
        newQuizzObj.image = quizzImgURL;
        setTimeout((innerHTML, stage) => stage.querySelector("div").innerHTML = innerHTML, 300, innerHTML, stage);
    }
    else {
        alert("URL inválida");
        isImgURLValid = false;
    }
}

function errorCallback() {
    alert("A imagem não existe");
    isImgURLValid = false;
}

function loadCallback() {
    isImgURLValid = true;
}



function validadeHowManyQuestionsLevels(stage) {
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

function validURL(str) { // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function proceedToCreateQuestions() {

}

// questions
