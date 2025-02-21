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

function aiMove() {
    if (!gameActive) return;
    
    let emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    
    let move;
    let winProbability = {
        easy: 0.65, // 65% chance player wins
        normal: 0.45, // 45% chance player wins
        hard: 0.05 // 5% chance player wins
    };

    if (Math.random() > winProbability[aiDifficulty]) {
        move = bestMove();
    } else {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    board[move] = "O";
    createBoard();
    checkWin();
}

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

function updateLeaderboard(winner) {
    if (winner === "X") {
        playerWins++;
        localStorage.setItem("playerWins", playerWins);
    } else if (winner === "O") {
        aiWins++;
        localStorage.setItem("aiWins", aiWins);
    }
    document.getElementById("playerWins").innerText = playerWins;
    document.getElementById("aiWins").innerText = aiWins;
}
