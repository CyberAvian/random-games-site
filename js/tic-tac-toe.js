let gameOver = false;
let playerWins = 0;
let computerWins = 0;
let draws = 0;
let cells = new Array(3).fill("").map(() => new Array(3).fill(""));
let gameBoard = document.querySelector("#game-board");
let gameBoardText = gameBoard.querySelector("p");
let playerWinCount = document.querySelector("#player-win-count");
let drawCount = document.querySelector("#draw-count");
let computerWinCount = document.querySelector('#computer-win-count');
createGameBoard();

let newGame = document.querySelector("#new-game");
newGame.addEventListener('click', clearGameBoard);

function createGameBoard() {
    for (let rowNum = 0; rowNum < 3; rowNum++) {
        let rowElement = document.createElement("div");
        rowElement.id = `row${rowNum}`;
        rowElement.classList = "row";
    
        for (let columnNum = 0; columnNum < 3; columnNum++) {
            let columnElement = document.createElement("div");
            columnElement.id = `cell${rowNum}${columnNum}`
            columnElement.classList = "cell";
    
            if (rowNum !== 2) {
                columnElement.style.borderBottom = "solid 1px white";
            }
            if (columnNum !== 2) {
                columnElement.style.borderRight = "solid 1px white";
            } 

            columnElement.addEventListener('click', playRound);
            
            let contentElement = document.createElement("p");
            columnElement.appendChild(contentElement);
            rowElement.appendChild(columnElement);

            cells[rowNum][columnNum] = columnElement;
        }
    
        gameBoard.appendChild(rowElement);
    }

    playerWinCount.textContent = `Player: ${playerWins}`;
    drawCount.textContent = `Draw: ${draws}`;
    computerWinCount.textContent = `Computer: ${computerWins}`;
}

function clearGameBoard() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.classList.remove("player-win");
        cell.classList.remove("computer-win");
        let cellTextElement = cell.querySelector("p");
        cellTextElement.textContent = "";
    });
    gameOver = false;
    gameBoardText.textContent = "";
    gameBoardText.style.background = "none";
    gameBoardText.style.backgroundClip = "none";
}

function playRound() {
    if (gameOver) return;

    let cellTextElement = this.querySelector("p");
    if (cellTextElement.textContent !== "") return;
    cellTextElement.textContent = "X";
    cellTextElement.style.color = "#549BCD";
    
    if (checkWin()) {
        gameBoardText.style.color = "#549BCD";
        gameBoardText.textContent = "You win!";
        playerWins++;
        gameOver = true;
    } else if (countBlankCells() === 0) {
        gameBoardText.style.background = "linear-gradient(#CF6060, #549BCD)";
        gameBoardText.style.backgroundClip = "text";
        gameBoardText.style.color = "transparent";
        gameBoardText.textContent = "Draw";
        draws++;
        gameOver = true;
    } else {
        let computerPlayed;
        do {
            computerPlayed = computerMove();
        } while (!computerPlayed)
        if (checkWin()) {
            gameBoardText.style.color = "#CF6060";
            gameBoardText.textContent = "You lose!";
            computerWins++;
            gameOver = true;
        }
    }

    playerWinCount.textContent = `Player: ${playerWins}`;
    drawCount.textContent = `Draw: ${draws}`;
    computerWinCount.textContent = `Computer: ${computerWins}`;
}

function computerMove() {
    let rowNum = Math.floor(Math.random() * 3);
    let colNum = Math.floor(Math.random() * 3);
    
    let computerCell = cells[rowNum][colNum];
    let cellText = computerCell.querySelector("p");
    if (cellText.textContent === "") {
        cellText.textContent = "O";
        cellText.style.color = "#CF6060";
        return true;
    }
    return false;
}

function countBlankCells() {
    let numBlankCells = 0;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (cells[row][col].textContent === "") {
                numBlankCells++;
            }
        }
    }

    return numBlankCells;
}

function checkWin() {
    let xCount;
    let oCount;

    // Check Rows
    for (let row = 0; row < 3; row++) {
        xCount = 0;
        oCount = 0;

        for (let col = 0; col < 3; col++) {
            switch (cells[row][col].textContent) {
                case "":
                    break;
                case "X":
                    xCount++;
                    break;
                case "O":
                    oCount++;
                    break;
            }
        }

        if (xCount === 3) {
            cells[row].forEach(col => {
                col.classList.add("player-win");
            });
            return true;
        } else if (oCount === 3) {
            cells[row].forEach(col => {
                col.classList.add("computer-win");
            });
            return true;
        }
    }

    // Check Columns
    for (let col = 0; col < 3; col++) {
        xCount = 0;
        oCount = 0;

        for (let row = 0; row < 3; row++) {
            switch (cells[row][col].textContent) {
                case "":
                    break;
                case "X":
                    xCount++;
                    break;
                case "O":
                    oCount++;
                    break;
            }
        }

        if (xCount === 3) {
            for (let row = 0; row < 3; row++) {
                cells[row][col].classList.add("player-win");
            }
            return true;
        } else if (oCount === 3) {
            for (let row = 0; row < 3; row++) {
                cells[row][col].classList.add("computer-win");
            }
            return true;
        }
    }

    // Check Diagonal
    if (cells[0][0].textContent !== "" && cells[1][1].textContent !== "" && cells[2][2].textContent !== "") {
        if (cells[0][0].textContent === cells[1][1].textContent && cells[0][0].textContent === cells[2][2].textContent) {
            if (cells[0][0].textContent === 'X') {
                cells[0][0].classList.add("player-win");
                cells[1][1].classList.add("player-win");
                cells[2][2].classList.add("player-win");
            } else if (cells[0][0].textContent === 'O') {
                cells[0][0].classList.add("computer-win");
                cells[1][1].classList.add("computer-win");
                cells[2][2].classList.add("computer-win");
            }
            return true;
        }
    } else if (cells[0][2].textContent !== "" && cells[2][0].textContent !== "") {
        if (cells[0][2].textContent === cells[1][1].textContent && cells[0][2].textContent === cells[2][0].textContent) {
            if (cells[0][2].textContent === 'X') {
                cells[0][2].classList.add("player-win");
                cells[1][1].classList.add("player-win");
                cells[2][0].classList.add("player-win");
            } else if (cells[0][2].textContent === 'O') {
                cells[0][2].classList.add("computer-win");
                cells[1][1].classList.add("computer-win");
                cells[2][0].classList.add("computer-win");
            }
 
            return true;
        }
    }

    // No` winning moves on board
    return false;
}