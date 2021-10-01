let gameOver = false;

let newGame = document.querySelector("#new-game");
newGame.addEventListener('click', clearGameBoard);

class Player {
    constructor(number) {
        this.number = number;
        this.symbol = number == 1 ? 'X' : 'O';
        this.type = '';
    }

    get type() {
        return this._type;
    }

    set type(newType) {
        let validTypes = ['human', 'robot'];
        newType = newType.trim();
        if (!validTypes.includes(newType)) {
            return;
        }

        this._type = newType;
    }
}

class GameBoard {
    constructor() {
        this.gameBoardRows = 3;
        this.gameBoardColumns = 3;
        this.cells = new Array();
        this.board = document.querySelector("#game-board");
        this.text = this.board.querySelector("#game-result");
    }

    // Create the board, which is only done the first time the game is launched
    create() {
        createdCells = this.#createCells();
        this.board.append(createdCells);
    }

    // Remove all X's and O's from cells, remove formatting, and clear the game result text
    reset() {
        this.#resetBoard();
        this.#resetBoardText();
    }

    // Create the cells used in the board, which is only done the first time the game is launched
    #createCells() {
        // Creating the cell element once and cloning in a loop to limit DOM manipulations
        let cell = document.createElement("div");
        cell.classList = "cell";
        cell.addEventListener('click', playRound);

        let cellContent = document.createElement("p");
        columnElement.appendChild(cellContent);

        // Document Fragments are stored in memory rather than the live DOM,
        // allowing us to build the child element before appending it once
        let documentFragment = document.createDocumentFragment();

        for (let cellNum = 0; cellNum < this.cells.length; cellNum++) {
            // Cloning deep to pick up the p element within the cell
            cellClone = cell.cloneNode(true);
            cell.id = `cell${cellNum}`

            // Determine if the cell is in the last row by checking if a cell exists column spaces away 
            // (immediately below it in a new row)
            if (cellNum + this.columns > this.columns) {
                cell.classList.add("cell-last-row");
            }
            // Determine if a cell is in the last column. The first cell in each row is evenly divisible
            // by the number of columns
            if (cellNum > 0 && cellNum % this.columns == 0) {
                cell.classList.add("cell-last-column");
            }
            
            this.cells[cellNum] = cell;
            documentFragment.appendChild(cell);
        }

        return documentFragment;
    }

    #resetBoard() {
        this.cells.forEach(cell => {
            cell.classList.remove("player-one-win-cell", "player-two-win-cell");
            cell.childNodes[0].textContent = "";
        });
    }

    #resetBoardText() {
        this.text.textContent = "";
        this.text.classList.remove("player-one-win-text", "draw-text", "player-two-win-text");
    }
}

class ScoreBoard {
    constructor() {
        playerOneScore = 0;
        drawScore = 0;
        playerTwoScore = 0;
        playerOneScoreText = document.querySelector("#player-one-score");
        drawScoreText = document.querySelector("#draw-score");
        playerTwoScoreText = document.querySelector('#player-two-score');
    }

    // The ScoreBoard is persistent as it tracks who won each game.
    // Therefore, the update method is used for both initial creation and to update the scores after every game is decided.
    update() {
        playerOneScoreText.textContent = `Player One: ${playerOneScore}`;
        drawScoreText.textContent = `Draw: ${drawScore}`;
        playerTwoScoreText.textContent = `Player Two: ${playerTwoScore}`;
    }
}

class Controller {
    constructor() {
        this.gameBoard = new GameBoard();
        this.scoreBoard = new ScoreBoard();
        // [gameState 0: startGame, gameState 1: playerOneTurn, gameState2: playerTwoTurn, gameState3: endGame]
        this.gameState = 0;
        this.playerOne = new Player(1);
        this.playerTwo = new Player(2);
    }

    init() {
        // The game runs indefinitely while the page is open
        while (true) {
            switch (gameState) {
                case 0:
                    this.startGame();
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }
    }

    startGame() {
        this.#setUpGameField();
        this.#setUpPlayers();
    }

    #setUpGameField() {
        // The gameBoard cells array is only empty on a fresh launch of the game. 
        // After initial creation, the array's contents are modified but never erased.
        this.gameBoard.cells.length == 0 ? this.gameBoard.create() : this.gameBoard.reset();
        this.scoreBoard.update();
    }

    #setUpPlayers() {
        this.playerOne.type = 'human';
        this.playerTwo.type = 'robot';
    }

    playRound() {
        if (gameState == 3) return;

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