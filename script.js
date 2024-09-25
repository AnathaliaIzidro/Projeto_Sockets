let currentPlayer = 1;
const board = [
    [null, null, 1, 1, 1, null, null],
    [null, null, 1, 1, 1, null, null],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [null, null, 1, 1, 1, null, null],
    [null, null, 1, 1, 1, null, null]
];

function initBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (board[row][col] === 1) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.dataset.row = row;
                piece.dataset.col = col;
                cell.appendChild(piece);
            } else if (board[row][col] === 0) {
                cell.classList.add('empty');
            }
            gameBoard.appendChild(cell);
        }
    }
    updateTurnIndicator();
}

function switchTurn() {
    const previousPlayer = currentPlayer;
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (!hasValidMoves()) {
        declareWinner(previousPlayer);
    } else {
        updateTurnIndicator();  
    }
}

function updateTurnIndicator() {
    const player1Indicator = document.getElementById('player1-indicator');
    const player2Indicator = document.getElementById('player2-indicator');

    if (currentPlayer === 1) {
        player1Indicator.classList.add('active');
        player2Indicator.classList.remove('active');
    } else {
        player1Indicator.classList.remove('active');
        player2Indicator.classList.add('active');
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    if (board[toRow][toCol] === 0 && Math.abs(fromRow - toRow) === 2 && fromCol === toCol) {
        return board[midRow][midCol] === 1;
    }
    if (board[toRow][toCol] === 0 && Math.abs(fromCol - toCol) === 2 && fromRow === toRow) {
        return board[midRow][midCol] === 1;
    }
    return false;
}

function hasValidMoves() {
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === 1) {

                if (isValidMove(row, col, row - 2, col) ||
                    isValidMove(row, col, row + 2, col) ||
                    isValidMove(row, col, row, col - 2) ||
                    isValidMove(row, col, row, col + 2)) {
                    return true; 
                }
            }
        }
    }
    return false;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    board[fromRow][fromCol] = 0;
    board[midRow][midCol] = 0;
    board[toRow][toCol] = 1;

    initBoard();
    switchTurn();
}

document.getElementById('game-board').addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('piece')) {
        const fromRow = parseInt(target.dataset.row);
        const fromCol = parseInt(target.dataset.col);

        document.getElementById('game-board').addEventListener('click', (e) => {
            const destination = e.target;
            if (destination.classList.contains('cell')) {
                const toRow = parseInt(destination.dataset.row);
                const toCol = parseInt(destination.dataset.col);

                if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                    movePiece(fromRow, fromCol, toRow, toCol);
                }
            }
        }, { once: true }); // Usa { once: true } para remover o evento após o primeiro clique
    }
});

function checkEndGame() {
    let remainingPieces = 0;

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === 1) {
                remainingPieces++;
            }
        }
    }

    if (remainingPieces === 1) {
        declareWinner(currentPlayer);
    }
}

function declareWinner(player) {
    document.getElementById('winner-message').textContent = `Jogador ${player} venceu!`;
    document.getElementById('winner-modal').style.display = 'block';
}

document.getElementById('restart-button').addEventListener('click', () => {
    location.reload();
});
document.getElementById('modal-restart-button').addEventListener('click', () => {
    location.reload();
});

function resetGame() {
    board = [
        [null, null, 1, 1, 1, null, null],
        [null, null, 1, 1, 1, null, null],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [null, null, 1, 1, 1, null, null],
        [null, null, 1, 1, 1, null, null]
    ];
    currentPlayer = 1;
    initBoard();
    document.getElementById('winner-modal').style.display = 'none';
}


document.getElementById('resign-button').addEventListener('click', () => {
    const confirmResign = confirm("Tem certeza que deseja desistir?");
    if (confirmResign) {
        declareWinner(currentPlayer === 1 ? 2 : 1);
    }
});


document.getElementById('send-message').addEventListener('click', () => {
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value;
    if (message) {
        const chatMessages = document.getElementById('chat-messages');
        const newMessage = document.createElement('p');
        newMessage.textContent = `Jogador ${currentPlayer}: ${message}`;
        chatMessages.appendChild(newMessage);
        messageInput.value = ''; // Limpa o campo de entrada
    }
});


window.onload = initBoard;