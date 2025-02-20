let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let aiLevel = "easy";

// Set Background Image
document.body.style.backgroundImage = "url('your-background-image.jpg')";

// Load leaderboard from local storage
let wins = localStorage.getItem("wins") || 0;
let losses = localStorage.getItem("losses") || 0;
document.getElementById("wins").innerText = wins;
document.getElementById("losses").innerText = losses;

function startGame(level) {
    aiLevel = level;
    resetGame();
    gameActive = true;
}

function playerMove(index) {
    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        updateBoard();
        checkWinner();
        if (gameActive) aiMove();
    }
}

function aiMove() {
    let emptyCells = board.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
    if (emptyCells.length === 0) return;

    let move;
    if (aiLevel === "easy") {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (aiLevel === "medium") {
        move = emptyCells.length > 1 ? emptyCells[0] : emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else {
        move = minimax(board, "O").index;
    }

    board[move] = "O";
    updateBoard();
    checkWinner();
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            announceWinner(board[a]);
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        announceWinner("draw");
    }
}

function announceWinner(winner) {
    let status = document.getElementById("status");

    if (winner === "draw") {
        status.innerText = "It's a Draw!";
    } else if (winner === "X") {
        status.innerText = "You Win!";
        localStorage.setItem("wins", ++wins);
    } else {
        status.innerText = "AI Wins!";
        localStorage.setItem("losses", ++losses);
    }

    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    document.getElementById("status").innerText = "";
    updateBoard();
}

function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.innerText = board[index];
    });
}

function resetLeaderboard() {
    localStorage.setItem("wins", 0);
    localStorage.setItem("losses", 0);
    document.getElementById("wins").innerText = 0;
    document.getElementById("losses").innerText = 0;
}
