let gameOver = false;
let cells = new Array(3).fill("").map(() => new Array(3).fill(""));
let gameBoard = document.querySelector("#game-board");
let gameBoardText = gameBoard.querySelector("p");
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
                columnElement.style.borderBottom = "solid 1px black";
            }
            if (columnNum !== 2) {
                columnElement.style.borderRight = "solid 1px black";
            } 

            columnElement.addEventListener('click', playRound);
            
            let contentElement = document.createElement("p");
            columnElement.appendChild(contentElement);
            rowElement.appendChild(columnElement);

            cells[rowNum][columnNum] = columnElement;
        }
    
        gameBoard.appendChild(rowElement);
    }
}

function clearGameBoard() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        let cellTextElement = cell.querySelector("p");
        cellTextElement.textContent = "";
    });
    gameOver = false;
    gameBoardText.textContent = "";
}

function playRound() {
    if (gameOver) return;

    let cellTextElement = this.querySelector("p");
    if (cellTextElement.textContent !== "") return;
    cellTextElement.textContent = "X";
    cellTextElement.style.color = "blue";
    
    if (checkWin()) {
        gameBoardText.textContent = "You win!";
        gameOver = true;
    } else if (countBlankCells() === 0) {
        gameBoardText.textContent = "Draw";
        gameOver = true;
    } else {
        let computerPlayed;
        do {
            computerPlayed = computerMove();
        } while (!computerPlayed)
        if (checkWin()) {
            gameBoardText.textContent = "You lose!";
            gameOver = true;
        }
    }
}

function computerMove() {
    let rowNum = Math.floor(Math.random() * 3);
    let colNum = Math.floor(Math.random() * 3);
    
    let computerCell = cells[rowNum][colNum];
    let cellText = computerCell.querySelector("p");
    if (cellText.textContent === "") {
        cellText.textContent = "O";
        cellText.style.color = "red";
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

        if (xCount === 3 || oCount === 3) {
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

        console.log(`Col xCount ${xCount} oCount ${oCount}`)
        if (xCount === 3 || oCount === 3) {
            return true;
        }
    }

    // Check Diagonal
    if (cells[0][0].textContent !== "" && cells[1][1].textContent !== "" && cells[2][2].textContent !== "") {
        if (cells[0][0].textContent === cells[1][1].textContent && cells[0][0].textContent === cells[2][2].textContent) {
            return true;
        }
    } else if (cells[0][2].textContent !== "" && cells[2][0].textContent !== "") {
        if (cells[0][2].textContent === cells[1][1].textContent && cells[0][2].textContent === cells[2][0].textContent) {
            return true;
        }
    }

    // No winning moves on board
    return false;
}