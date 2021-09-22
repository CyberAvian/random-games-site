let gameBoard = document.querySelector("#game-board");
 
for (let rowNum = 0; rowNum < 3; rowNum++) {
    let rowElement = document.createElement("div");
    rowElement.id = `row-${rowNum}`;
    rowElement.classList = "row";

    for (let columnNum = 0; columnNum < 3; columnNum++) {
        let columnElement = document.createElement("div");
        columnElement.id = `col-${columnNum}}`;
        columnElement.classList = "col";
    }
}