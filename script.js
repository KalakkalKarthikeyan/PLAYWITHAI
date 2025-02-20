const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const toggleModeButton = document.getElementById("toggleMode");

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let vsAI = false;

function createBoard() {
    board.innerHTML = "";
    boardState.forEach((cell, index) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.textContent = cell;
        div.addEventListener("click", () => handleMove(index));
        board.appendChild(div);
    });
}

function handleMove(index) {
    if (boardState[index] !== "" || checkWinner()) return;

    boardState[index] = currentPlayer;
    createBoard();

    if (checkWinner()) {
        statusText.textContent = `${currentPlayer} Wins! 🎉`;
        return;
    }

    if (!boardState.includes("")) {
        statusText.textContent = "It's a Draw! 🤝";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Your Turn (${currentPlayer})`;

    if (vsAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return boardState[a] !== "" && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

function aiMove() {
    let bestMove = minimax(boardState, "O").index;
    boardState[bestMove] = "O";
    createBoard();

    if (checkWinner()) {
        statusText.textContent = "O Wins! 🤖";
        return;
    }

    if (!boardState.includes("")) {
        statusText.textContent = "It's a Draw!";
        return;
    }

    currentPlayer = "X";
    statusText.textContent = "Your Turn (X)";
}

function minimax(newBoard, player) {
    let emptySpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    if (checkWinnerForAI(newBoard, "X")) return { score: -10 };
    if (checkWinnerForAI(newBoard, "O")) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i of emptySpots) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        newBoard[i] = "";
        moves.push(move);
    }

    return moves.reduce((bestMove, move) => {
        if ((player === "O" && move.score > bestMove.score) || (player === "X" && move.score < bestMove.score)) {
            return move;
        }
        return bestMove;
    }, { score: player === "O" ? -Infinity : Infinity });
}

function checkWinnerForAI(boardState, player) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return boardState[a] === player && boardState[b] === player && boardState[c] === player;
    });
}

resetButton.addEventListener("click", () => {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    statusText.textContent = "Your Turn (X)";
    createBoard();
});

toggleModeButton.addEventListener("click", () => {
    vsAI = !vsAI;
    toggleModeButton.textContent = vsAI ? "Play Against Human" : "Play Against AI";
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    statusText.textContent = "Your Turn (X)";
    createBoard();
});

createBoard();
