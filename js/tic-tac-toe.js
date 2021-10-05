class Player {
    constructor(symbol, number) {
        this.symbol = symbol;
        this.number = number;
    }

    markCell(cell) {
        let cellContent = cell.childNodes[0];
        if (cellContent.textContent != '') return false;
        
        cellContent.textContent = this.symbol;
        cell.classList.add(`player-${this.number}-color`);
        return true;
    }
}

class Robot extends Player{
    constructor(symbol, number, difficulty) {
        super(symbol, number);
        // [difficulty 0: easy, difficulty 1: medium, difficulty 2: hard]
        this.difficulty = difficulty;
    }

    getMove() {
        let selectedMove;
        switch(this.difficulty) {
            case 0:
                selectedMove = this.getRandomMove();
                break;
            case 1:
                break;
            case 2:
                break;
        }

        return selectedMove;
    }

    getRandomMove() {
        let randomRow = Math.floor(Math.random() * 3);
        let randomColumn = Math.floor(Math.random() * 3);
        let randomChoice = [randomRow, randomColumn]
        return randomChoice;
    }
}

class GameBoard {
    constructor() {
        this.gameBoardRows = 3;
        this.gameBoardColumns = 3;
        this.cells = new Array(3).fill('').map(() => new Array(3).fill(''));
        this.board = document.querySelector("#game-board");
        this.resultText = this.board.querySelector("#game-result");
        this.newGameButton = document.querySelector("#new-game");
    }

    // Create the board, which is only done the first time the game is launched
    create() {
        let createdRows = this.#createRows();
        this.board.append(createdRows);
        this.newGameButton.addEventListener('click', this.reset());
    }

    // Remove all X's and O's from cells, remove formatting, and clear the game result text
    reset() {
        this.#resetBoard();
        this.#resetBoardText();
    }

    #createRows() {
        let rows = document.querySelectorAll(".row");
        let rowCounter = 0;
        
        rows.forEach(row => {
            let cellFragment = this.#createCells(rowCounter);
            row.appendChild(cellFragment);
            rowCounter++;
        });
    }

    // Create the cells used in the board, which is only done the first time the game is launched
    #createCells(rowNumber) {
        // Creating the cell element once and cloning in a loop to limit DOM manipulations
        let cell = document.createElement("div");
        cell.classList = "cell";

        let cellContent = document.createElement("p");
        cell.appendChild(cellContent);

        // Document Fragments are stored in memory rather than the live DOM,
        // allowing us to build the child element before appending it once
        let documentFragment = document.createDocumentFragment();

        for (let columnNumber = 0; columnNumber < this.gameBoardColumns; columnNumber++) {
            // Cloning deep to pick up the p element within the cell
            let cellClone = cell.cloneNode(true);
            cellClone.id = `cell${rowNumber}${columnNumber}`;

            // There are 9 cells, 3 per row. The last row contains cells 6-8.
            if (rowNumber == this.gameBoardRows - 1) {
                cellClone.classList.add("cell-last-row");
            }
            // Determine if a cell is in the last column. 
            // The first cell of each row is evenly divisible by the number of columns. 
            // Must add 1 since index starts at 0.
            if (columnNumber == this.gameBoardColumns - 1) {
                cellClone.classList.add("cell-last-column");
            }
            
            this.cells[rowNumber][columnNumber] = cellClone;
            documentFragment.appendChild(cellClone);
        }

        return documentFragment;
    }

    #resetBoard() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.classList.remove("player-one-win-cell", 
                                      "player-two-win-cell", 
                                      "player-one-color", 
                                      "player-two-color",
                                      "draw-color");
                cell.childNodes[0].textContent = "";
            });
        });
    }

    #resetBoardText() {
        this.resultText.textContent = "";
        this.resultText.classList.remove("player-one-color", "draw-color", "player-two-color");
    }
}

class ScoreBoard {
    constructor() {
        this.playerOneScore = 0;
        this.drawScore = 0;
        this.playerTwoScore = 0;
        this.playerOneScoreText = document.querySelector("#player-one-score");
        this.drawScoreText = document.querySelector("#draw-score");
        this.playerTwoScoreText = document.querySelector('#player-two-score');
    }

    // The ScoreBoard is persistent as it tracks who won each game.
    // Therefore, the update method is used for both initial creation and to update the scores after every game is decided.
    update() {
        this.playerOneScoreText.textContent = `Player One: ${this.playerOneScore}`;
        this.drawScoreText.textContent = `Draw: ${this.drawScore}`;
        this.playerTwoScoreText.textContent = `Player Two: ${this.playerTwoScore}`;
    }
}

class Controller {
    constructor() {
        this.gameBoard = new GameBoard();
        this.scoreBoard = new ScoreBoard();
        this.playerOne = new Player('X', 'one');
        this.playerTwo = new Robot('O', 'two', 0);
        this.activePlayer = this.playerOne;
        this.gameOver = false;
        this.firstRun = true;
    }

    init() {
        this.#setUpGameField();
        this.#setUpPlayers();
        this.firstRun = false;
    }

    playerTurn(clickEvent) {
        if (this.gameOver) return;
        let endTurn = false;
        let cell;

        cell = clickEvent.target;
        endTurn = this.activePlayer.markCell(cell);
        if (endTurn) {
            let turnResult = this.#evaluateBoard(cell);
            turnResult ? this.#endGame(turnResult) : this.#switchPlayer();
            if (this.activePlayer.type == "robot") {
                this.#robotTurn();
            }
        }
    }

    #evaluateBoard(cell) {
        if (this.#isPlayerWin(cell)) return 1;
        if (this.#isDraw()) return 2;
        return false;
    }

    #endGame(gameResult) {
        this.gameOver = true;
        if (gameResult == 1) {
            let playerNumber = this.activePlayer.number;
            this.gameBoard.resultText.textContent = `Player ${playerNumber} Wins!`.toUpperCase();
            this.gameBoard.resultText.classList.add(`player-${playerNumber}-color`);
            this.activePlayer == this.playerOne ? this.scoreBoard.playerOneScore++ : this.scoreBoard.playerTwoScore++;
        } else if (gameResult == 2) {
            this.gameBoard.resultText.textContent = 'Draw!';
            this.gameBoard.resultText.classList.add('draw-color');
            this.scoreBoard.drawScore++;
        }
        this.scoreBoard.update();
    }

    #robotTurn() {
        let endTurn = false;
        let cell;
        while (!endTurn) {
            let cellLocation = this.activePlayer.getMove();
            let cellRow = cellLocation[0];
            let cellColumn = cellLocation[1];
            cell = this.gameBoard.cells[cellRow][cellColumn];
            endTurn = this.activePlayer.markCell(cell);
        }
        let turnResult = this.#evaluateBoard(cell);
        turnResult ? this.#endGame(turnResult) : this.#switchPlayer();
        if (typeof this.activePlayer == Robot) {
            this.#robotTurn();
        }
    }

    #switchPlayer() {
        if (this.activePlayer == this.playerOne) {
            this.activePlayer = this.playerTwo;
        } else {
            this.activePlayer = this.playerOne;
        }
    }

    #setUpGameField() {
        this.firstRun ? this.gameBoard.create() : this.gameBoard.reset();
        this.scoreBoard.update();
    }

    #setUpPlayers() {
        this.playerOne.type = 'human';
        this.playerTwo.type = 'robot';
    }

    #isDraw() {
        for (let rowNum = 0; rowNum < this.gameBoard.gameBoardRows; rowNum++) {
            for (let columnNum = 0; columnNum < this.gameBoard.gameBoardColumns; columnNum++) {
                let cell = this.gameBoard.cells[rowNum][columnNum];
                if (cell.childNodes[0].textContent == '') return false;
            }
        }
        return true;
    }

    #isPlayerWin(cell) {
        let cellRow = this.#getRow(cell);
        let cellColumn =  this.#getColumn(cell, cellRow);
        
        if (this.#checkRow(cellRow)) return true;
        if (this.#checkColumn(cellColumn)) return true;
        if (this.#checkDiagonal(cellRow, cellColumn)) return true;
        return false;
    }

    #getRow(cell) {
        for (let rowNum = 0; rowNum < this.gameBoard.gameBoardRows; rowNum++) {
            if (this.gameBoard.cells[rowNum].includes(cell)) {
                return rowNum;
            }
        }
    }

    #getColumn(cell, row) {
        let column = this.gameBoard.cells[row].indexOf(cell);
        return column;
    }

    #checkRow(rowNum) {
        let row = this.gameBoard.cells[rowNum];
        for (let cellNum = 0; cellNum < row.length; cellNum++) {
            let cellText = row[cellNum].childNodes[0].textContent;
            if (cellText != this.activePlayer.symbol) {
                return false;
            }
        }
        return true;
    }

    #checkColumn(column) {
        for (let rowNum = 0; rowNum < this.gameBoard.gameBoardRows; rowNum++) {
            let row = this.gameBoard.cells[rowNum];
            let cellText = row[column].childNodes[0].textContent;
            console.log(`Cell Text: ${cellText} Symbol: ${this.activePlayer.symbol}`);
            if (cellText != this.activePlayer.symbol) {
                console.log('Mismatch');
                return false;
            }
        }
        return true;
    }

    #checkDiagonal(row, column) {
        // We can use the difference of row and column numbers to figure out if a cell lies on a diagonal
        // The cells not on a diagonal are (0, 1) (1, 0) (1, 2) (2, 1) which each have a difference of 1. 
        // The cells on the top-left to bottom-right diagonal are (0, 0) (1, 1) (2, 2) which have a difference of 0
        // The cells on the bottom-left to top-right diagonal are (0, 2) (1, 1) (2, 0) which have a difference of 2 or 0
        let difference = Math.abs(row - column);
        switch (difference) {
            case 1:
                break;
            case 0:
                if (this.#checkDiagonalCells(0, 'right')) return true;
                if (row != 1 || column != 1 ) break;
            case 2:
                let columns = this.gameBoard.gameBoardColumns - 1;
                if (this.#checkDiagonalCells(columns, 'left')) return true;
                break;
        }
        return false;
    }

    #checkDiagonalCells(columnNum, direction) {
        // direction specifies which diagonal to use.
        // For the diagonal going left to right, we use direction right and go from (0, 0) to (2, 2)
        // For the diagonal going right to left, we use direction left adn go from (0, 2) to (2, 0)
        for (let rowNum = 0; rowNum < this.gameBoard.gameBoardRows; rowNum++) {
            let row = this.gameBoard.cells[rowNum];
            let cellText = row[columnNum].childNodes[0].textContent;
            if (cellText != this.activePlayer.symbol) {
                return false;
            }
            direction == 'right' ? columnNum++ : columnNum--;
        }
        return true;
    }
}

let gameMaster = new Controller();
gameMaster.init();
gameMaster.gameBoard.cells.forEach(row => {
    row.forEach(cell => {
        cell.addEventListener('click', function (e) {
            gameMaster.playerTurn(e);
        });
    });
});
gameMaster.gameBoard.newGameButton.addEventListener('click', () => {
    gameMaster.activePlayer = gameMaster.playerOne;
    gameMaster.gameOver = false;
    gameMaster.gameBoard.reset();
})