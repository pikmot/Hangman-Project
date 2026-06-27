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

//words used
let wordsUsed = [];

//streak counter
let streak = 0;

//live counter
let lives = 0;

//max lives
const maxLives = 10;

//end game flag
let wonGame = 0;

//loss game flag
let lossGame = 0;

//image counter
let imgCounter = 0;

//grabbing word - assinging - splitting
let pracWord;
let pracWordList;

let currentWordList;

//sections
const keyboard = document.getElementById("keyboard");

const keyDownFun = () => {
  // console.log(event.key);

  if (!letters.includes(event.key.toUpperCase())) {
    return;
  }

  if (
    document.getElementById(event.key.toUpperCase()).className !==
    "keyboard keyboard__key keyboard__key--disabled"
  ) {
    document.getElementById(event.key.toUpperCase()).className =
      "keyboard keyboard__key keyboard__key--disabled";

    notifyChange(event.key);
  }
};

//add listener for key down
document.addEventListener("keydown", keyDownFun);

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
    pickWord(0);

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

  lossGame = 1;
  console.log("removing");
  document.removeEventListener("keydown", keyDownFun);

  setTimeout(() => {
    alert("YOU LOST!!!, REFRESH TO PLAY AGAIN!!");
  }, 100);
};

const disableAllWin = () => {
  for (const key of keyboard.children) {
    key.className += " keyboard__key--disabled";
  }

  wonGame = 1;
  console.log("removing2");
  document.removeEventListener("keydown", keyDownFun);

  setTimeout(() => {
    alert("YOU'RE A GENIUS!!!, YOU GUESSED EVERYTHING!!!");
  }, 100);
};

const resetState = () => {
  console.log(wonGame, lossGame);
  if (wonGame || lossGame) {
    return;
  } else {
    //resetting status
    lives = 0;
    streak += 1;

    renderStreak(streak);

    renderLives(lives);

    pickWord(0);

    renderWord();

    console.log("hit");

    // if (wordsUsed.length === words.length) {
    //   return;
    // }

    if (!wonGame) {
      setTimeout(() => {
        alert("YOU WON, Close to continue STREAK!!");
      }, 100);
    }

    createKeyboard();
  }
};

const pickWord = (num) => {
  if (wordsUsed.length === words.length) {
    console.log("maxed out list");
    wonGame = 1;
    disableAllWin();
    return;
  }

  pracWord = words[Math.floor(Math.random() * words.length)].toLowerCase();

  console.log(pracWord);

  if (wordsUsed.includes(pracWord)) {
    //make sure word isn't used
    console.log("repeat word");
    pickWord(1);
  }

  if (num) {
    return;
  }

  pracWordList = pracWord.split("");

  currentWordList = pracWordList.map(() => "*");

  wordsUsed.push(pracWord);
};

//fucntion to update/render html
const renderWord = () => {
  if (wonGame) {
    return;
  }

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
    if (lossGame || wonGame) {
      disableAll();
    } else {
      lives += 1;
      renderLives(lives);
    }
  }

  if (lives == maxLives) {
    lossGame = 1;
    disableAll();
  }
};

//create keys
const createKeyboard = () => {
  if (wonGame) {
    return;
  }

  console.log(keyboard);

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
