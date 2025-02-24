function aiMove() {
    if (!gameActive) return;
    
    let emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    
    let move;
    let winProbability = {
        easy: 0.35,  // 35% chance AI wins (65% player wins)
        normal: 0.55, // 55% chance AI wins (45% player wins)
        hard: 0.95    // 95% chance AI wins (5% player wins)
    };

    if (Math.random() < winProbability[aiDifficulty]) {
        move = bestMove();  // AI plays the best move
    } else {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)]; // AI makes a random mistake
    }

    board[move] = "O";
    createBoard();
    checkWin();
}

// Minimax algorithm for best move
function bestMove() {
    return minimax(board, "O").index;
}

// Minimax Algorithm for AI decision-making
function minimax(newBoard, player) {
    let availableSpots = newBoard.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

    if (checkWinner("X")) return { score: -10 }; // Player wins
    if (checkWinner("O")) return { score: 10 };  // AI wins
    if (availableSpots.length === 0) return { score: 0 }; // Draw

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove = 0;
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

// Function to check winner
function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}
