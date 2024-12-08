import Cell from "./cell.js";
import { Colors, DifficultyDimensions } from "./utilities.js";

let generation = false;

class Maze {
  /*
  * Class containing information and functions for updating and drawing a maze to the canvas.
  *
  * @param {Game} game - A reference to an initialized 'Game' object.
  * @param {number} size - The width and height of the maze in pixels.
  * @param {number} rows - The number of rows in the maze.
  * @param {number} columns - The number of columns in the maze.
  * @param {string} wallColor - String representation of a color to draw the maze walls.
  */
  constructor(game, size, rows, columns, wallColor) {
    this.game = game;
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.cellWallLength = this.size / this.rows;

    this.grid = [];
    this.stack = [];

    this.cellsToRotate = [];
    this.isRotating = false

    this.currentCell;

    this.randomColors = [];
    this.wallColor = wallColor;
  }

  /*
  * Initializes the 2D grid array with 'Cell' objects.
  */
  setupMaze() {
    for (let row = 0; row < this.rows; row++) {
      let currentRow = [];

      for (let column = 0; column < this.columns; column++) {
        let cell = new Cell(
          row,
          column,
          this.grid,
          this.size,
          this.cellWallLength
        );

        currentRow.push(cell);

        // Sets the wall color to a random color if the user selected 'mixed' wall color.
        if (this.wallColor == "mixed") {
          let randomColor = Colors[Math.floor(Math.random() * Colors.length)];
          this.randomColors.push(randomColor);
        }
      }
      this.grid.push(currentRow);
    }

    // Starting and end point of the maze
    this.currentCell = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].isGoal = true;
  }

  /*
  * Used for selecting which cells to rotate their walls. 
  * Ensures no duplicate cells are selected.
  * 
  * @param {Cell} randomCell - A random 'Cell' in the maze's grid array.
  * 
  * @returns {bool} - Whether or not the 'randomCell' has already been selected.
  */
  verifyUniqueRandomCell(randomCell) {
    if (this.cellsToRotate.length === 0) return true;

    this.cellsToRotate.forEach((cell) => {
      if (randomCell.equals(cell)) return false;
    });

    return true;
  }

  /*
  * Used for selecting which cells to rotate their walls.
  * Ensures a cell has a showing wall to rotate and that these walls
  * aren't border walls of the maze.
  * 
  * @param {Cell} randomCell - A random 'Cell' in the maze's grid array.
  * 
  * @returns {bool} - Whether or not the cell has shown walls to rotate that aren't border walls.
  */
  verifyNonBorderWallsExist(randomCell) {
    // Walls are index as [ 0:top, 1:right, 2:bottom, 3:left ]
    let availableWalls = randomCell.getShownWalls();

    // Counts the total number of shown walls
    var numberOfAvailableWalls = 0;
    availableWalls.forEach((isAvailable) => {
      if (isAvailable) numberOfAvailableWalls++;
    });

    // Counts the number of shown walls that are also border walls
    var numberOfBorderWalls = 0;

    if (availableWalls[0] && randomCell.rowNumber === 0) 
      numberOfBorderWalls++;
    if (availableWalls[1] && randomCell.columnNumber === this.grid.length - 1)
      numberOfBorderWalls++;
    if (availableWalls[2] && randomCell.rowNumber === this.grid.length - 1)
      numberOfBorderWalls++;
    if (availableWalls[3] && randomCell.columnNumber === 0)
      numberOfBorderWalls++;

    // Returns true if there are more available walls than border walls and vice versa
    return numberOfAvailableWalls > numberOfBorderWalls;
  }

  /*
  * Verifies a cell is not the goal of the maze
  *
  * @param {Cell} randomCell - A random 'Cell' in the maze's grid array.
  * 
  * @returns {bool} Whether the cell is the goal of the maze.
  */
  verifyCellIsNotGoal(randomCell) {
    return !randomCell.isGoal
  }

  /*
  * Selects a random cell from the maze's grid array. Verifies this cell
  * is not the goal cell, hasn't already been selected, and has valid
  * walls to rotate. Recursively calls until a valid cell is found.
  * 
  * @returns {Cell} randomCell - A random cell from the maze's grid array that has valid walls to rotate.
  */
  getRandomCell() {
    let randomRowIndex = Math.floor(Math.random() * this.rows);
    let randomColumnIndex = Math.floor(Math.random() * this.columns);

    var randomCell = this.grid[randomRowIndex][randomColumnIndex];

    if (
      !this.verifyCellIsNotGoal(randomCell) ||
      !this.verifyUniqueRandomCell(randomCell) ||
      !this.verifyNonBorderWallsExist(randomCell) 
    ) {
      // Recursively call if requirements aren't met
      randomCell = this.getRandomCell();
    }

    return randomCell;
  }

  /*
  * Selects random cells from the maze's grid array to rotate.
  */
  selectCellsToRotate() {
    this.cellsToRotate = [];

    // The number of rotating cells at any given moment is dependent on the difficulty
    let numberOfRotatingCells = DifficultyDimensions[this.game.difficulty][0] * 2;

    for (let index = 0; index < numberOfRotatingCells; index++) {
      let randomCell = this.getRandomCell();
      this.cellsToRotate.push(randomCell);
    }
  }

  /*
  * Selects a random wall within a cell to rotate. Verifies the wall has a non-showing
  * wall to rotate into.
  * Walls are indexed as [ 0:top, 1:right, 2:bottom, 3:left ]
  * The top wall rotates into the left wall.
  * The right wall rotates into the top wall.
  * The bottom wall rotates into the right wall.
  * The left wall rotates into the bottom wall.
  *
  * @param {Cell} randomCell - A random 'Cell' in the maze's grid array.
  * 
  * @returns {number} - The index of the wall to rotate.
  */
  selectRandomWallToRotate(randomCell) {
    let availableWalls = randomCell.getShownWalls();

    // Verify given wall has a space to rotate into
    // Top wall shown and left wall not shown and top wall is not border wall
    if (availableWalls[0] && !availableWalls[3] && randomCell.rowNumber !== 0) {
      return 0;
    }
    // Right and not Top
    if (
      availableWalls[1] &&
      !availableWalls[0] &&
      randomCell.columnNumber !== this.grid.length - 1
    ) {
      return 1;
    }
    // Bottom and not Right
    if (
      availableWalls[2] &&
      !availableWalls[1] &&
      randomCell.rowNumber !== this.grid.length - 1
    ) {
      return 2;
    }
    // Left and not Bottom
    if (
      availableWalls[3] &&
      !availableWalls[2] &&
      randomCell.columnNumber !== 0
    ) {
      return 3;
    }

    // Returns undefined if there are no valid walls
    return undefined;
  }

  /*
  * Rotates the selected wall for all the selected cells to rotate.
  * This function is called each game loop thus so it is necessary to 
  * track the number of times it has been called. Each call a walls angle is
  * incremented by 2 degrees. A full rotate consists of 90 degrees so this 
  * function must be called exactly 45 times.
  *
  * @param {number} index - The number of times the method has been called.
  */
  rotateCellWalls(index) {
    // Loop through all cells to rotate and rotate a random wall
    this.cellsToRotate.forEach((cell) => {
      
      // Selects the walls to rotate once
      if (index === 0) {
        cell.wallToRotate = this.selectRandomWallToRotate(cell);
        cell.isRotating = true;
      }

      // Rotate selected wall
      switch (cell.wallToRotate) {
        case 0:
          cell.rotateTopWall();
          break;
        case 1:
          cell.rotateRightWall();
          break;
        case 2:
          cell.rotateBottomWall();
          break;
        case 3:
          cell.rotateLeftWall();
          break;
      }

      // Rotation is complete
      if (index > 44) {
        cell.isRotating = false
        return
      }
    });

  }

  /*
  * Draws the complete generated maze every game loop.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  drawGeneratedMaze(context) {
    if (generation) {
      for (let row = 0; row < this.columns; row++) {
        for (let column = 0; column < this.rows; column++) {
          // Sets a random cell wall color if the user selected 'mixed'
          if (this.wallColor == "mixed") {
            this.grid[row][column].show(
              context,
              this.randomColors[row * this.columns + column],
              this.size,
              this.rows,
              this.columns
            );
          } else {
            this.grid[row][column].show(
              context,
              this.wallColor,
              this.size,
              this.rows,
              this.columns
            );
          }
        }
      }
    }
  }

  /*
  * Draws the maze as it is generating.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  draw(context) {
    // Set the first cell as visited
    this.currentCell.visited = true;

    // Loop through the 2d grid array and call the show method for each cell instance
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        let grid = this.grid;
        if (this.wallColor == "mixed") {
          grid[row][column].show(
            context,
            this.randomColors[row * this.columns + column],
            this.size,
            this.rows,
            this.columns
          );
        } else {
          grid[row][column].show(
            context,
            this.wallColor,
            this.size,
            this.rows,
            this.columns
          );
        }
      }
    }

    // Assigns the variable 'next' to a random cell out of the current cell's
    // available neighboring cells
    let next = this.currentCell.checkNeighbors();

    // If there is a non-visited neighbor cell
    if (next) {
      next.visited = true;

      // Add current cell to the stack for backtracking
      this.stack.push(this.currentCell);

      // Compares the current cell to the next cell and removes the relevant walls
      this.currentCell.removeWalls(this.currentCell, next);

      // Sets the next cell to the current cell
      this.currentCell = next;

    // Else if there are no available neighbors start backtracking
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      this.currentCell = cell;
    }

    // If there are no more items in the stack then all the cells have been visited and the function is complete
    if (this.stack.length === 0) {
      this.game.setMazeGenerationComplete(true);
      generation = true;
      return;
    }
  }

  /*
  * Controls player movement through the maze. Allows movement if the
  * next cell is not rotating and the wall is not shown. Sets the player's
  * position to the pixel coordinates of the cell.
  *
  * @param {event} e - An action event listener event.
  */
  move(e) {
    // Don't allow movement if the maze isn't done generating or the game is over
    if (!generation || this.game.isGameOver) return;

    let key = e.key;
    let row = this.currentCell.rowNumber;
    let col = this.currentCell.columnNumber;

    switch (key) {
      case "ArrowUp":
        if (!this.currentCell.walls.topWall.isShown) {
          let next = this.grid[row - 1][col];

          if (next.isGoal) {
            this.game.gameOver();
          }

          if (!next.isRotating) {
            this.currentCell = next;
          }

          let cords = this.currentCell.getCurrentCellCords(this.columns);
          this.game.player.setPosition(cords[0], cords[1]);
        }
        break;

      case "ArrowRight":
        if (!this.currentCell.walls.rightWall.isShown) {
          let next = this.grid[row][col + 1];

          if (next.isGoal) {
            this.game.gameOver();
          }

          if (!next.isRotating) {
            this.currentCell = next;
          }

          let cords = this.currentCell.getCurrentCellCords(this.columns);
          this.game.player.setPosition(cords[0], cords[1]);
        }
        break;

      case "ArrowDown":
        if (!this.currentCell.walls.bottomWall.isShown) {
          let next = this.grid[row + 1][col];

          if (next.isGoal) {
            this.game.gameOver();
          }

          if (!next.isRotating) {
            this.currentCell = next;
          }

          let cords = this.currentCell.getCurrentCellCords(this.columns);
          this.game.player.setPosition(cords[0], cords[1]);
        }
        break;

      case "ArrowLeft":
        if (!this.currentCell.walls.leftWall.isShown) {
          let next = this.grid[row][col - 1];

          if (next.isGoal) {
            this.game.gameOver();
          }

          if (!next.isRotating) {
            this.currentCell = next;
          }

          let cords = this.currentCell.getCurrentCellCords(this.columns);
          this.game.player.setPosition(cords[0], cords[1]);
        }
        break;
    }
  }
}

export default Maze;
