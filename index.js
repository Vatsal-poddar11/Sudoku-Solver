console.log("Soduku Solver");

("use strict");

let cellContent = document.getElementById("sudoku-board");
// Limiting content of the cell to a singe digit and checking if the input is valid

cellContent.addEventListener("keyup", function (event) {
  if (event.target && event.target.nodeName == "TD") {
    var validNum = /[1-9]/;
    var tdEl = event.target;
    if (tdEl.innerText.length > 0 && validNum.test(tdEl.innerText[0])) {
      tdEl.innerText = tdEl.innerText[0];
    } else {
      tdEl.innerText = "";
    }
  }
});

// Solve the Sudoku Board
let solveSudoku = document.getElementById("solve-btn");

solveSudoku.addEventListener("click", function (event) {
  var boardString = boardToString();
  var solution = solve(boardString);
  if (solution) {
    stringToBoard(solution);
  } else {
    alert("Invalid Inputs to Sudoku Board");
  }
});

let clearBoard = document.getElementById("clear-btn");
clearBoard.addEventListener("click", clear);

function clear() {
  var allTds = document.getElementsByTagName("td");
  for (var i = 0; i < allTds.length; i++) {
    allTds[i].innerText = "";
  }
}

function boardToString() {
  var string = "";
  var validNum = /[1-9]/;
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    if (validNum.test(tds[i].innerText[0])) {
      string += tds[i].innerText;
    } else {
      string += "-";
    }
  }
  return string;
}

function stringToBoard(string) {
  var currentCell;
  var validNum = /[1-9]/;
  var cells = string.split("");
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    currentCell = cells.shift();
    if (validNum.test(currentCell)) {
      tds[i].innerText = currentCell;
    }
  }
}

function solve(boardString) {
  var boardArray = boardString.split("");
  if (boardIsInvalid(boardArray)) {
    return false;
  }
  return recursiveSolve(boardString);
}

function solveAndPrint(boardString) {
  var solvedBoard = solve(boardString);
  console.log(toString(solvedBoard.split("")));
  return solvedBoard;
}

function recursiveSolve(boardString) {
  var boardArray = boardString.split("");
  if (boardIsSolved(boardArray)) {
    return boardArray.join("");
  }
  var cellPossibilities = getNextCellAndPossibilities(boardArray);
  var nextUnsolvedCellIndex = cellPossibilities.index;
  var possibilities = cellPossibilities.choices;
  for (var i = 0; i < possibilities.length; i++) {
    boardArray[nextUnsolvedCellIndex] = possibilities[i];
    var solvedBoard = recursiveSolve(boardArray.join(""));
    if (solvedBoard) {
      return solvedBoard;
    }
  }
  return false;
}

function boardIsInvalid(boardArray) {
  return !boardIsValid(boardArray);
}

function boardIsValid(boardArray) {
  return (
    allRowsValid(boardArray) &&
    allColumnsValid(boardArray) &&
    allBoxesValid(boardArray)
  );
}

function boardIsSolved(boardArray) {
  for (var i = 0; i < boardArray.length; i++) {
    if (boardArray[i] === "-") {
      return false;
    }
  }
  return true;
}

function getNextCellAndPossibilities(boardArray) {
  for (var i = 0; i < boardArray.length; i++) {
    if (boardArray[i] === "-") {
      var existingValues = getAllIntersections(boardArray, i);
      var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(
        function (num) {
          return existingValues.indexOf(num) < 0;
        }
      );
      return { index: i, choices: choices };
    }
  }
}

function getAllIntersections(boardArray, i) {
  return getRow(boardArray, i)
    .concat(getColumn(boardArray, i))
    .concat(getBox(boardArray, i));
}

function allRowsValid(boardArray) {
  return [0, 9, 18, 27, 36, 45, 54, 63, 72]
    .map(function (i) {
      return getRow(boardArray, i);
    })
    .reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
}

function getRow(boardArray, i) {
  var startingEl = Math.floor(i / 9) * 9;
  return boardArray.slice(startingEl, startingEl + 9);
}

function allColumnsValid(boardArray) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8]
    .map(function (i) {
      return getColumn(boardArray, i);
    })
    .reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
}

function getColumn(boardArray, i) {
  var startingEl = Math.floor(i % 9);
  return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
    return boardArray[startingEl + num * 9];
  });
}

function allBoxesValid(boardArray) {
  return [0, 3, 6, 27, 30, 33, 54, 57, 60]
    .map(function (i) {
      return getBox(boardArray, i);
    })
    .reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
}

function getBox(boardArray, i) {
  var boxCol = Math.floor(i / 3) % 3;
  var boxRow = Math.floor(i / 27);
  var startingIndex = boxCol * 3 + boxRow * 27;
  return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) {
    return boardArray[startingIndex + num];
  });
}

function collectionIsValid(collection) {
  var numCounts = {};
  for (var i = 0; i < collection.length; i++) {
    if (collection[i] != "-") {
      if (numCounts[collection[i]] === undefined) {
        numCounts[collection[i]] = 1;
      } else {
        return false;
      }
    }
  }
  return true;
}

function toString(boardArray) {
  return [0, 9, 18, 27, 36, 45, 54, 63, 72]
    .map(function (i) {
      return getRow(boardArray, i).join(" ");
    })
    .join("\n");
}
