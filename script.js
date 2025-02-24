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
        easy: 0.65,  // 65% chance player wins
        normal: 0.45, // 45% chance player wins
        hard: 0.05    // 5% chance player wins
    };

    if (aiDifficulty === "hard") {
        if (Math.random() > 0.05) {
            move = minimax(board, "O").index;  // AI plays the best move
        } else {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)]; // 5% chance to make a mistake
        }
    } else {
        if (Math.random() > winProbability[aiDifficulty]) {
            move = minimax(board, "O").index;  // AI plays the best move
        } else {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }

    board[move] = "O";
    createBoard();
    checkWin();
}

// Simple minimax function (for AI Hard mode)
function minimax(newBoard, player) {
    let emptyCells = newBoard.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    if (checkWinAI(newBoard, "O")) return { score: 1 };
    if (checkWinAI(newBoard, "X")) return { score: -1 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
        let move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[emptyCells[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// AI Win Check
function checkWinAI(b, p) {
    return (
        (b[0] === p && b[1] === p && b[2] === p) ||
        (b[3] === p && b[4] === p && b[5] === p) ||
        (b[6] === p && b[7] === p && b[8] === p) ||
        (b[0] === p && b[3] === p && b[6] === p) ||
        (b[1] === p && b[4] === p && b[7] === p) ||
        (b[2] === p && b[5] === p && b[8] === p) ||
        (b[0] === p && b[4] === p && b[8] === p) ||
        (b[2] === p && b[4] === p && b[6] === p)
    );
}

function restartGame() {
    board.fill("");
    gameActive = true;
    createBoard();
    startTimer();
}

