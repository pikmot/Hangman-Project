console.log("script working...");

//loading letters
const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

//words var
let words = [];

//streak counter
let streak = 0;

//live counter
let lives = 0;

//max lives
const maxLives = 10;

//image counter
let imgCounter = 0;

//grabbing word - assinging - splitting
let pracWord;
let pracWordList;

let currentWordList;

//sections
const keyboard = document.getElementById("keyboard");
const word = document.getElementById("word");
const streakCounter = document.getElementById("streak");
const livesCounter = document.getElementById("lives");
let playerStatus = document.getElementById("image");
const image = document.getElementById("image");

//data
const init = async () => {
  // console.log("load data");
  try {
    //wait for response
    let res = await fetch("./assets/example-words.json");

    //data in promise format
    let data = await res.json();

    //assigning data
    words = data;

    //dynamcally render streak
    renderStreak(streak);

    //dynamcally render lives
    renderLives(lives);

    //randomly pick word
    pickWord();

    //dynamically create word
    renderWord();

    //dynamically creating keyboard letters
    createKeyboard();
  } catch (err) {
    console.error("Data didn't load:", err);
  }
};

//rendering streak
const renderStreak = (streak) => {
  streakCounter.textContent = `Streak : ${streak}`;
};

//rendering lives
const renderLives = (lives) => {
  livesCounter.textContent = `Lives Lost : ${lives} / 10`;

  playerStatus.src = `./assets/img/h-${lives}.jpg`;
};

//disable all
const disableAll = () => {
  for (const key of keyboard.children) {
    key.className += " keyboard__key--disabled";
  }

  setTimeout(() => {
    alert("YOU LOST!!!, REFRESH TO PLAY AGAIN!!");
  }, 100);
};

const resetState = () => {
  //resetting status
  lives = 0;
  streak += 1;

  renderStreak(streak);

  renderLives(lives);

  pickWord();

  renderWord();

  createKeyboard();

  setTimeout(() => {
    alert("YOU WON, Close to continue STREAK!!");
  }, 100);
};

const pickWord = () => {
  pracWord = words[Math.floor(Math.random() * words.length)].toLowerCase();

  console.log(pracWord);
  pracWordList = pracWord.split("");
  ``;
  currentWordList = pracWordList.map(() => "*");
};

//fucntion to update/render html
const renderWord = () => {
  //clear existing word
  word.replaceChildren();
  for (const char of currentWordList) {
    //create elements
    let newDiv = document.createElement("div");
    let newP = document.createElement("p");

    //assign class and text body
    newDiv.className = "word-container word-container__pair";

    newP.textContent = char;
    newP.className = "word-container__pair word-container__pair--letter";

    //append content
    newDiv.appendChild(newP);
    word.appendChild(newDiv);
  }
};

const notifyChange = (letter) => {
  //check if letter matches -> change Else ignore
  if (pracWordList.includes(letter.toLowerCase())) {
    //1.check count of letter and loop that many times OR
    //e.map as a faster solution
    pracWordList.map((char) => {
      if (char.toLowerCase() === letter.toLowerCase()) {
        currentWordList[pracWordList.indexOf(char)] = letter;
        pracWordList[pracWordList.indexOf(char)] = "*";
      }
    });
    renderWord();

    //check if success
    if (currentWordList.join("").toLowerCase() === pracWord) {
      resetState();
    }
  } else {
    lives += 1;
    renderLives(lives);
  }

  if (lives == maxLives) {
    disableAll();
  }
};

//create keys
const createKeyboard = () => {
  keyboard.replaceChildren();
  for (const val of letters) {
    let newDiv = document.createElement("div");
    newDiv.textContent = val;
    newDiv.className = "keyboard keyboard__key";
    newDiv.id = val;

    keyboard.appendChild(newDiv);

    //add event listeners for click
    newDiv.addEventListener("click", () => {
      document.getElementById(newDiv.id).className =
        "keyboard keyboard__key keyboard__key--disabled";

      notifyChange(document.getElementById(newDiv.textContent).textContent);
    });
  }
};

//load Data
init();
