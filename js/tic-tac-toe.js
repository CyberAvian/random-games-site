class Player {
    constructor(symbol) {
        this.symbol = symbol;
        this.move = null;
        this.state = 'inactive';
    }

    get move() {
        return this._move;
    }

    set move(newMove) {
        this._move = newMove;
    }

    getMove(clickEvent) {
        this.state == 'active' ? this.move = clickEvent.target : this.move = null;
    }

    markCell() {
        if (this.move == null) return false;
        
        let cellContent = this.move.childNodes[0].textContent;
        if (cellContent != '') return false;
        
        cellContent = this.symbol;
        this.move = null;
        return true;
    }
}

class Robot extends Player{
    constructor(symbol, difficulty) {
        super(symbol);
        // [difficulty 0: easy, difficulty 1: medium, difficulty 2: hard]
        this.difficulty = difficulty;
        this.move = null;
    }

    getMove() {
        let selectedMove;
        switch(this.difficulty) {
            case 0:
                move = this.getRandomMove();
                break;
            case 1:
                break;
            case 2:
                break;
        }

        return selectedMove;
    }

    getRandomMove() {
        let randomChoice = Math.floor(Math.random() * 8);
        return randomChoice;
    }

    setMove(cell) {
        this.move = cell;
    }

    markCell() {
        let cellContent = this.move.childNodes[0].textContent;
        if (cellContent != '') return false;
        
        cellContent = this.symbol;
        this.move = null;
        return true;
    }
}

class GameBoard {
    constructor() {
        this.gameBoardRows = 3;
        this.gameBoardColumns = 3;
        this.cells = new Array();
        this.board = document.querySelector("#game-board");
        this.text = this.board.querySelector("#game-result");
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
        let counter = 0;
        
        rows.forEach(row => {
            let cellFragment = this.#createCells(counter);
            row.appendChild(cellFragment);
            counter += 3;
        });
    }

    // Create the cells used in the board, which is only done the first time the game is launched
    #createCells(counter) {
        // Creating the cell element once and cloning in a loop to limit DOM manipulations
        let cell = document.createElement("div");
        cell.classList = "cell";

        let cellContent = document.createElement("p");
        cell.appendChild(cellContent);

        // Document Fragments are stored in memory rather than the live DOM,
        // allowing us to build the child element before appending it once
        let documentFragment = document.createDocumentFragment();

        for (let cellNum = counter; cellNum < counter + 3; cellNum++) {
            // Cloning deep to pick up the p element within the cell
            let cellClone = cell.cloneNode(true);
            cellClone.id = `cell${cellNum}`

            // There are 9 cells, 3 per row. The last row contains cells 6-8.
            if (cellNum > 5) {
                cellClone.classList.add("cell-last-row");
            }
            // Determine if a cell is in the last column. 
            // The first cell of each row is evenly divisible by the number of columns. 
            // Must add 1 since index starts at 0.
            if ((cellNum + 1) % this.gameBoardColumns == 0) {
                cellClone.classList.add("cell-last-column");
            }
            
            this.cells[cellNum] = cellClone;
            documentFragment.appendChild(cellClone);
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
        // [gameState 0: startGame, gameState 1: playerOneTurn, gameState2: playerTwoTurn, gameState3: endGame]
        this.gameState = 0;
        this.playerOne = new Player('X');
        this.playerTwo = new Robot('O', 0);
    }

    init() {
        let endTurn;
        switch (this.gameState) {
            case 0:
                this.startGame();
                this.gameState++;
                break;
            case 1:
                if (typeof this.playerOne == Player) this.playerOne.state = 'active';
                endTurn = this.playerTurn(this.playerOne);
                if (endTurn) {
                    this.gameState++;
                    if (typeof this.playerOne == Player) this.playerOne.state = 'inactive';
                }
                break;
            case 2:
                if (typeof this.playerOne == Player) this.playerTwo.state = 'active';
                endTurn = this.playerTurn(this.playerTwo);
                if (endTurn) {
                    this.gameState++;
                    if (typeof this.playerOne == Player) this.playerTwo.state = 'inactive';
                }
                break;
            case 3:
                break;
        }
    }

    startGame() {
        this.#setUpGameField();
        this.#setUpPlayers();
        if (typeof this.playerOne == Player) this.#setUpCells;
        if (typeof this.playerTwo == Player) this.#setUpCells;
    }

    playerTurn(player) {
        let endTurn = false;
        if (typeof player == Robot) {
            let cellId = player.getMove();
            cell = this.gameBoard.cells[cellId];
            this.player.setMove(cell);
        }
        endTurn = player.markCell();
        return endTurn;
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

    #setUpCells(player) {
        this.gameBoard.cells.forEach(cell => {
            cell.addEventListener('click', player.getMove())
        });
    }
}

let gameMaster = new Controller();
document.addEventListener('DOMContentLoaded', gameMaster.init());

// function countBlankCells() {
//     let numBlankCells = 0;

//     for (let row = 0; row < 3; row++) {
//         for (let col = 0; col < 3; col++) {
//             if (cells[row][col].textContent === "") {
//                 numBlankCells++;
//             }
//         }
//     }

//     return numBlankCells;
// }

// function checkWin() {
//     let xCount;
//     let oCount;

//     // Check Rows
//     for (let row = 0; row < 3; row++) {
//         xCount = 0;
//         oCount = 0;

//         for (let col = 0; col < 3; col++) {
//             switch (cells[row][col].textContent) {
//                 case "":
//                     break;
//                 case "X":
//                     xCount++;
//                     break;
//                 case "O":
//                     oCount++;
//                     break;
//             }
//         }

//         if (xCount === 3) {
//             cells[row].forEach(col => {
//                 col.classList.add("player-win");
//             });
//             return true;
//         } else if (oCount === 3) {
//             cells[row].forEach(col => {
//                 col.classList.add("computer-win");
//             });
//             return true;
//         }
//     }

//     // Check Columns
//     for (let col = 0; col < 3; col++) {
//         xCount = 0;
//         oCount = 0;

//         for (let row = 0; row < 3; row++) {
//             switch (cells[row][col].textContent) {
//                 case "":
//                     break;
//                 case "X":
//                     xCount++;
//                     break;
//                 case "O":
//                     oCount++;
//                     break;
//             }
//         }

//         if (xCount === 3) {
//             for (let row = 0; row < 3; row++) {
//                 cells[row][col].classList.add("player-win");
//             }
//             return true;
//         } else if (oCount === 3) {
//             for (let row = 0; row < 3; row++) {
//                 cells[row][col].classList.add("computer-win");
//             }
//             return true;
//         }
//     }

//     // Check Diagonal
//     if (cells[0][0].textContent !== "" && cells[1][1].textContent !== "" && cells[2][2].textContent !== "") {
//         if (cells[0][0].textContent === cells[1][1].textContent && cells[0][0].textContent === cells[2][2].textContent) {
//             if (cells[0][0].textContent === 'X') {
//                 cells[0][0].classList.add("player-win");
//                 cells[1][1].classList.add("player-win");
//                 cells[2][2].classList.add("player-win");
//             } else if (cells[0][0].textContent === 'O') {
//                 cells[0][0].classList.add("computer-win");
//                 cells[1][1].classList.add("computer-win");
//                 cells[2][2].classList.add("computer-win");
//             }
//             return true;
//         }
//     } else if (cells[0][2].textContent !== "" && cells[2][0].textContent !== "") {
//         if (cells[0][2].textContent === cells[1][1].textContent && cells[0][2].textContent === cells[2][0].textContent) {
//             if (cells[0][2].textContent === 'X') {
//                 cells[0][2].classList.add("player-win");
//                 cells[1][1].classList.add("player-win");
//                 cells[2][0].classList.add("player-win");
//             } else if (cells[0][2].textContent === 'O') {
//                 cells[0][2].classList.add("computer-win");
//                 cells[1][1].classList.add("computer-win");
//                 cells[2][0].classList.add("computer-win");
//             }
 
//             return true;
//         }
//     }

//     // No` winning moves on board
//     return false;
// }