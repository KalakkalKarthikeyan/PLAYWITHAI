let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = "human";
let aiDifficulty = "easy";
let gameActive = true;
let timer;
let seconds = 0;

// Load leaderboard
let playerWins = localStorage.getItem("playerWins") || 0;
let aiWins = localStorage.getItem("aiWins") || 0;
document.getElementById("playerWins").innerText = playerWins;
document.getElementById("aiWins").innerText = aiWins;

// Start timer
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").innerText = `Time: ${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }, 1000);
}

// Initialize board
function createBoard() {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board.forEach((cell, index) => {
        let cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell;
        cellDiv.onclick = () => makeMove(index);
        boardDiv.appendChild(cellDiv);
    });
}
createBoard();

function makeMove(index) {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    createBoard();
    checkWin();

    if (gameMode === "ai" && gameActive) {
        setTimeout(aiMove, 500);
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    winPatterns.forEach(pattern => {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            document.getElementById("status").innerText = `${board[a]} Wins! 🎉`;
            clearInterval(timer);
            updateLeaderboard(board[a]);
        }
    });

    if (!board.includes("") && gameActive) {
        gameActive = false;
        document.getElementById("status").innerText = "It's a Draw!";
        clearInterval(timer);
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// AI Move with Probability-based Difficulty
function aiMove() {
    if (!gameActive) return;

    let emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

    let move;
    let winChance;

    // Adjust AI difficulty probability
    if (aiDifficulty === "easy") {
        winChance = 0.35;  // AI plays best move 35% of the time
    } else if (aiDifficulty === "normal") {
        winChance = 0.55;  // AI plays best move 55% of the time
    } else if (aiDifficulty === "hard") {
        winChance = 0.90;  // AI plays best move 90% of the time
    }

    if (Math.random() < winChance) {
        move = bestMove();  // AI plays the best move
    } else {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];  // AI makes a random move
    }

    board[move] = "O";
    createBoard();
    checkWin();
}

// AI's best move logic (Minimax can be implemented later for smarter AI)
function bestMove() {
    return board.indexOf("");
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("status").innerText = "Player's Turn";
    createBoard();
    startTimer();
}

function setGameMode(mode) {
    gameMode = mode;
    restartGame();
}

function setDifficulty(level) {
    aiDifficulty = level;
    restartGame();
}

// Update leaderboard
function updateLeaderboard(winner) {
    if (winner === "X") {
        playerWins++;
        localStorage.setItem("playerWins", playerWins);
        document.getElementById("playerWins").innerText = playerWins;
    } else if (winner === "O") {
        aiWins++;
        localStorage.setItem("aiWins", aiWins);
        document.getElementById("aiWins").innerText = aiWins;
    }
}


