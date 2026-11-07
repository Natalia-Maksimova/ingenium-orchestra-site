
const data = [
    {
        question: "А когда с человеком может произойти дрожемент?",
        answers: [
            { text: "Когда он влюбляется", correct: false },
            { text: "Когда он идет шопиться", correct: false },
            { text: "Когда он слышит смешную шутку", correct: false },
            { text: "Когда он боится, пугается", correct: true }
        ],
        explanation: "«Дрожемент» — состояние крайнего напряжения и страха."
    },
    {
        question: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            { text: "Как так, заовнил? Ну и хамло.", correct: false },
            { text: "Антон всех задолбал", correct: false },
            { text: "Молодец, Антон, всех победил!", correct: true },
            { text: "Антон тщательно выбирает друзей", correct: false }
        ],
        explanation: "«Заовнить» означает победить, завладеть или получить."
    },
    {
        question: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            { text: "Разозлить родителей", correct: false },
            { text: "Увлекаться археологией", correct: false },
            { text: "Развести недотепу на деньги", correct: true },
            { text: "Оскорбить пожилого человека", correct: false }
        ],
        explanation: "«Заскамить мамонта» — обмануть или развести на деньги."
    },
    {
        question: "Кто такие бефефе?",
        answers: [
            { text: "Вши", correct: false },
            { text: "Милые котики", correct: false },
            { text: "Лучшие друзья", correct: true },
            { text: "Люди, которые не держат слово", correct: false }
        ],
        explanation: "Бефефе — лучшие друзья, от best friends forever."
    },
    {
        question: "Что можно назвать крашем, если ты чиллишь и залипаешь на кого-то?",
        answers: [
            { text: "Человек, который тебе нравится", correct: true },
            { text: "Тот, на кого приятно смотреть и с кем хочется общаться", correct: true },
            { text: "Сильно накрашенная подруга", correct: false },
            { text: "Трэш в мягкой интерпретации", correct: false }
        ],
        explanation: "Краш — объект симпатии. Чиллить — отдыхать, залипать — засматриваться."
    }
];

const questionsBlock = document.querySelector("#questions");
const testBlock = document.querySelector("#test");
const statusBlock = document.querySelector("#status");

let questions = [];
let current = 0;
let score = 0;
let answered = false;
let finished = false;

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function startTest() {
    questionsBlock.innerHTML = "";
    questions = shuffle(data.map((item, id) => ({
        ...item,
        id,
        answers: shuffle(item.answers)
    })));

    current = 0;
    score = 0;
    answered = false;
    finished = false;

    statusBlock.textContent = "";
    showQuestion();
}

function renderQuestions() {

    questions.forEach((item, index) => {
        const button = document.createElement("button");
        button.className = "question";
        button.textContent = `${index + 1}. ${item.question}`;
        button.type = "button";

        if (index === current && !finished) {
            button.classList.add("active");
            questionsBlock.appendChild(button);
        }

        button.addEventListener("click", () => {
            if (finished) {
                showReview(item);
            }
        });

    });
}

function showQuestion() {
    answered = false;
    const item = questions[current];

    testBlock.innerHTML = "";

    const title = document.createElement("div");
    title.className = "question-title";
    title.textContent = `${current + 1}. ${item.question}`;

    const answers = document.createElement("div");
    answers.className = "answers";

    item.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer";
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer.text}`;

        button.addEventListener("click", () => {
            chooseAnswer(button, answer, item);
        });

        answers.appendChild(button);
    });

    testBlock.append(title, answers);
    statusBlock.textContent = `Вопрос ${current + 1} из ${questions.length}`;
    renderQuestions();
}

function chooseAnswer(button, answer, item) {
    if (answered || finished) return;

    answered = true;

    const buttons = [...testBlock.querySelectorAll(".answer")];
    const questionButtons = document.querySelectorAll(".question");
    const questionIndex = current;

    if (answer.correct) {
        score++;
        button.classList.add("correct");
        const explanation = document.createElement("div");
        explanation.className = "explanation";
        explanation.textContent = item.explanation;
        testBlock.appendChild(explanation);
        questionButtons[questionIndex].classList.add("correct");

    } else {
        button.classList.add("wrong");
        questionButtons[questionIndex].classList.add("wrong");
    }

    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        buttons.forEach((btn, index) => {
            setTimeout(() => {
                if (answer.correct && btn === button) {
                    return;
                }
                btn.classList.add("depart");
            }, index * 150);
        });

        setTimeout(() => {
            if (answer.correct) {
                button.classList.add("depart");
            }

            const next = document.createElement("button");
            next.className = "next";
            next.textContent = current === questions.length - 1
                ? "Завершить тест"
                : "Следующий вопрос";

            next.addEventListener("click", () => {
                current++;

                if (current < questions.length) {
                    showQuestion();
                } else {
                    showResults();
                }
            });

            testBlock.appendChild(next);
        }, buttons.length * 150 + 700);
    }, 2000);
}

function showResults() {
    finished = true;
    testBlock.innerHTML = "";
    statusBlock.textContent = "Вопросы закончились";

    const result = document.createElement("div");
    result.className = "question-title";
    result.innerHTML = `<h2>Результат</h2>
        <p>Правильных ответов: ${score} из ${questions.length}</p>`;

    const restart = document.createElement("button");
    restart.className = "restart";
    restart.textContent = "Пройти ещё раз";
    restart.addEventListener("click", startTest);

    result.appendChild(restart);
    testBlock.appendChild(result);
}

function showReview(item) {
    testBlock.innerHTML = "";

    const title = document.createElement("div");
    title.className = "question-title";
    title.textContent = item.question;

    const answers = document.createElement("div");
    answers.className = "answers";

    item.answers.forEach((answer, index) => {
        const block = document.createElement("div");
        block.className = "answer";

        block.textContent = `${String.fromCharCode(65 + index)}. ${answer.text}`;

        if (answer.correct) {
            block.classList.add("correct");
        }

        answers.appendChild(block);
    });

    const explanation = document.createElement("div");
    explanation.className = "explanation";
    explanation.textContent = item.explanation;

    const restart = document.createElement("button");
    restart.className = "restart";
    restart.textContent = "Пройти ещё раз";
    restart.addEventListener("click", startTest);

    testBlock.append(title, answers, explanation, restart);
    statusBlock.textContent = "Просмотр правильного ответа";

}

startTest();
