import { Colors } from "./utilities.js";

class Cell {
  /*
  * Class that contains information and functions for updating and drawing individual cells in a maze.
  *
  * @param {number} rowNumber - The y index of the cell in the maze.
  * @param {number} columnNumber - The x index of the cell in the maze.
  * @param {array} parentGrid - The 2D maze grid the cell is apart of.
  * @param {number} parentSize - The size of the maze in pixels.
  * @param {number} wallLength - The length of a cell's walls in pixels.
  */
  constructor(rowNumber, columnNumber, parentGrid, parentSize, wallLength) {
    this.rowNumber = rowNumber;
    this.columnNumber = columnNumber;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;

    this.visited = false;
    this.isRotating = false
    this.isGoal = false;

    this.wallToRotate = 0
    this.wallLength = wallLength;

    this.walls = {
      topWall: {
        isShown: true,
        theta: 0,
        maxTheta: 90,
      },
      bottomWall: {
        isShown: true,
        theta: 180,
        maxTheta: 270,
      },
      leftWall: {
        isShown: true,
        theta: 270,
        maxTheta: 360,
      },
      rightWall: {
        isShown: true,
        theta: 90,
        maxTheta: 180,
      },
    };
  }

  /*
  * Used in maze generation. Checks if top, right, bottom, and left neighboring cells exist
  * and have been visited already. Selects a random neighbor if they exist.
  * 
  * @returns {Cell} - A random neighboring 'Cell' if available else undefined.
  */
  checkNeighbors() {
    let grid = this.parentGrid;
    let row = this.rowNumber;
    let column = this.columnNumber;
    let neighbors = [];

    // Pushes all available neighbors to the neighbors array
    // undefined is returned where the index is out of bounds
    let top = row !== 0 ? grid[row - 1][column] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][column] : undefined;
    let right = column !== grid.length - 1 ? grid[row][column + 1] : undefined;
    let left = column !== 0 ? grid[row][column - 1] : undefined;

    // If not 'undefined', push to neighbors array
    if (top && !top.visited) neighbors.push(top);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (right && !right.visited) neighbors.push(right);
    if (left && !left.visited) neighbors.push(left);

    // Chooses a random neighbor from the neighbors array
    if (neighbors.length !== 0) {
      let randomIndex = Math.floor(Math.random() * neighbors.length);
      return neighbors[randomIndex];
    } else {
      return undefined;
    }
  }

  /*
  * Draws the top wall of a cell. The top wall is drawn from the top left corner to the top
  * right corner of the cell.  
  *
  * @params {canvas context} context - The context of the canvas used to draw the player.
  * @params {number} x - The x coordinate of the top left corner of the cell in pixels.
  * @params {number} y - The y coordinate of the top left corner of the cell in pixels.
  * @params {number} theta - The angle of the wall in degrees.
  */
  drawTopWall(context, x, y, theta) {
    // Starting point
    let x1 = x;
    let y1 = y;

    // Calculates the end point based of the wall's length and angle
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  /*
  * Draws the bottom wall of a cell. The bottom wall is drawn from the bottom right to the
  * bottom left corner of the cell. 
  *
  * @params {canvas context} context - The context of the canvas used to draw the player.
  * @params {number} x - The x coordinate of the top left corner of the cell in pixels.
  * @params {number} y - The y coordinate of the top left corner of the cell in pixels.
  * @params {number} theta - The angle of the wall in degrees.
  */
  drawBottomWall(context, x, y, theta) {
    // Starting point
    let x1 = x + this.wallLength;
    let y1 = y + this.wallLength;

    // Calculates the end point based of the wall's length and angle
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  /*
  * Draws the right wall of a cell. The right wall is drawn from the top right to the
  * bottom right corner of the cell.  
  *
  * @params {canvas context} context - The context of the canvas used to draw the player.
  * @params {number} x - The x coordinate of the top left corner of the cell in pixels.
  * @params {number} y - The y coordinate of the top left corner of the cell in pixels.
  * @params {number} theta - The angle of the wall in degrees.
  */
  drawRightWall(context, x, y, theta) {
    // Starting point
    let x1 = x + this.wallLength;
    let y1 = y;

    // Calculates the end point based of the wall's length and angle
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  /*
  * Draws the left wall of a cell. The left wall is drawn from the bottom left to the
  * top left corner of the cell.
  *
  * @params {canvas context} context - The context of the canvas used to draw the player.
  * @params {number} x - The x coordinate of the top left corner of the cell in pixels.
  * @params {number} y - The y coordinate of the top left corner of the cell in pixels.
  * @params {number} theta - The angle of the wall in degrees.
  */
  drawLeftWall(context, x, y, theta) {
    // Starting point
    let x1 = x;
    let y1 = y + this.wallLength;

    // Calculates the end point based of the wall's length and angle
    let x2 = x1 + this.wallLength * Math.cos((Math.PI * theta) / 180.0);
    let y2 = y1 + this.wallLength * Math.sin((Math.PI * theta) / 180.0);

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  /*
  * Calculates the x and y coordinates of the top left corner of a cell in pixels.
  *
  * @param {number} columns - The number of columns in the maze. (same as rows)
  * 
  * @returns {array} - An array of the [x, y] coordinates of the top left corner of a cell in pixels.
  */
  getCurrentCellCords(columns) {
    let cellSize = this.parentSize / columns;

    let x = this.columnNumber * cellSize;
    let y = this.rowNumber * cellSize;

    return [x, y];
  }

  /*
  * Removes the adjacent wall between two adjacent cells. Updates the cell wall's 'isShown'
  * property to remove a wall.
  *
  * @param {Cell} cell1 - A cell from the maze's grid array.
  * @param {Cell} cell2 - A different cell from the maze's grid array.
  */
  removeWalls(cell1, cell2) {
    // Compares the two cells on the x axis
    let x = cell1.columnNumber - cell2.columnNumber;

    // Removes the relevant walls if there is a different on x axis
    if (x === 1) {
      cell1.walls.leftWall.isShown = false;
      cell2.walls.rightWall.isShown = false;
    } else if (x === -1) {
      cell1.walls.rightWall.isShown = false;
      cell2.walls.leftWall.isShown = false;
    }

    // Compares the two cells on the y axis
    let y = cell1.rowNumber - cell2.rowNumber;

    // Removes the relevant walls if there is a different on y axis
    if (y === 1) {
      cell1.walls.topWall.isShown = false;
      cell2.walls.bottomWall.isShown = false;
    } else if (y === -1) {
      cell1.walls.bottomWall.isShown = false;
      cell2.walls.topWall.isShown = false;
    }
  }

  /*
  * Draws the walls of a cell to the canvas. 
  * 
  * @param {canvas context} context - The context of the canvas used to draw the player.
  * @param {string} wallColor - The color to draw the wall with.
  * @param {number} size - The size of the maze in pixels.
  * @param {number} rows - The number of rows in the maze.
  * @param {number} columns - The number of columns in the maze.
  */
  show(context, wallColor, size, rows, columns) {
    // Calculates the x and y coords of the top left corner of the cell
    let x = (this.columnNumber * size) / columns;
    let y = (this.rowNumber * size) / rows;

    // Sets the wall color based on user input
    if (wallColor == "mixed-animated") {
      let randomColor = Colors[Math.floor(Math.random() * Colors.length)];
      context.strokeStyle = randomColor;
    } else {
      context.strokeStyle = wallColor;
    }

    context.fillStyle = "black";
    context.lineWidth = 3;

    if (this.walls.topWall.isShown)
      this.drawTopWall(context, x, y, this.walls.topWall.theta);
    if (this.walls.rightWall.isShown)
      this.drawRightWall(context, x, y, this.walls.rightWall.theta);
    if (this.walls.bottomWall.isShown)
      this.drawBottomWall(context, x, y, this.walls.bottomWall.theta);
    if (this.walls.leftWall.isShown)
      this.drawLeftWall(context, x, y, this.walls.leftWall.theta);

    if (this.isGoal) {
      context.fillStyle = "rgb(83, 247, 43)";
      context.fillRect(x + 5, y + 5, size / columns - 10, size / rows - 10);
    }
  }

  /*
  * Rotates the top wall of a cell. Rotation is done by incrementing the walls angle
  * a total of 90 degrees. Then showing the rotated into wall and resetting the data 
  * of the original wall. Updates the wall information of adjacent cells.
  * The top wall rotates into the left wall.
  */
  rotateTopWall() {
    // Removes the bottom wall of the above cell
    this.parentGrid[this.rowNumber - 1][this.columnNumber].walls.bottomWall.isShown = false

    // Rotates the wall 90 degrees
    if (this.walls.topWall.theta < this.walls.topWall.maxTheta) {
      this.walls.topWall.theta += 2
      
    } else {
      // Removes the top wall and resets it's angle
      this.walls.topWall.isShown = false
      this.walls.topWall.theta = 0
      
      // Shows the left (rotated into) wall
      this.walls.leftWall.theta = 270
      this.walls.leftWall.isShown = true

      // Shows the right wall of the left cell, which was also rotated into
      if (this.columnNumber !== 0) {
        this.parentGrid[this.rowNumber][this.columnNumber - 1].walls.rightWall.isShown = true
      }

      // Rotation is complete
      this.isRotating = false
    }
  }

  /*
  * Rotates the right wall of a cell. Rotation is done by incrementing the walls angle
  * a total of 90 degrees. Then showing the rotated into wall and resetting the data 
  * of the original wall. Updates the wall information of adjacent cells.
  * The right wall rotates into the top wall.
  */
  rotateRightWall() {
    // Removes the left wall of the right cell
    this.parentGrid[this.rowNumber][this.columnNumber + 1].walls.leftWall.isShown = false

    // Rotates the wall 90 degrees
    if (this.walls.rightWall.theta < this.walls.rightWall.maxTheta) {
      this.walls.rightWall.theta += 2

    } else {
      // Removes the right wall and resets it's angle
      this.walls.rightWall.isShown = false
      this.walls.rightWall.theta = 90

      // Shows the top (rotated into) wall
      this.walls.topWall.theta = 0
      this.walls.topWall.isShown = true

      // Shows the bottom wall of the top cell, which was also rotated into
      if (this.rowNumber !== 0) {
        this.parentGrid[this.rowNumber - 1][this.columnNumber].walls.bottomWall.isShown = true
      }

      // Rotation is complete
      this.isRotating = false
    }
  }

  /*
  * Rotates the bottom wall of a cell. Rotation is done by incrementing the walls angle
  * a total of 90 degrees. Then showing the rotated into wall and resetting the data 
  * of the original wall. Updates the wall information of adjacent cells.
  * The bottom wall rotates into the right wall.
  */
  rotateBottomWall() {
    // Removes the top wall of the bottom cell
    this.parentGrid[this.rowNumber + 1][this.columnNumber].walls.topWall.isShown = false

    // Rotates the wall 90 degrees
    if (this.walls.bottomWall.theta < this.walls.bottomWall.maxTheta) {
      this.walls.bottomWall.theta += 2

    } else {
      // Removes the bottom wall and resets it's angle
      this.walls.bottomWall.isShown = false
      this.walls.bottomWall.theta = 180

      // Shows the right (rotated into) wall
      this.walls.rightWall.theta = 90
      this.walls.rightWall.isShown = true

      // Shows the left wall of the right cell, which was also rotated into
      if (this.columnNumber !== this.parentGrid.length - 1) {
        this.parentGrid[this.rowNumber][this.columnNumber + 1].walls.leftWall.isShown = true
      }

      // Rotation is complete
      this.isRotating = false
    }
  }

  /*
  * Rotates the left wall of a cell. Rotation is done by incrementing the walls angle
  * a total of 90 degrees. Then showing the rotated into wall and resetting the data 
  * of the original wall. Updates the wall information of adjacent cells.
  * The left wall rotates into the bottom wall.
  */
  rotateLeftWall() {
    // Removes the right wall of the left cell
    this.parentGrid[this.rowNumber][this.columnNumber - 1].walls.rightWall.isShown = false

    // Rotates the wall 90 degrees
    if (this.walls.leftWall.theta < this.walls.leftWall.maxTheta) {
      this.walls.leftWall.theta += 2

    } else {
      // Removes the left wall and resets it's angle
      this.walls.leftWall.isShown = false
      this.walls.leftWall.theta = 270

      // Shows the bottom (rotated into) wall
      this.walls.bottomWall.theta = 180
      this.walls.bottomWall.isShown = true

      // Shows the top wall of the bottom cell, which was also rotated into
      if(this.rowNumber !== this.parentGrid.length - 1) {
        this.parentGrid[this.rowNumber + 1][this.columnNumber].walls.topWall.isShown = true
      }

      // Rotation is complete
      this.isRotating = false
    }
  }

  /*
  * Calculates the walls of a cell that are being shown. Returns an array of this data.
  * The walls are represented as [ 0:top, 1:right, 2:bottom, 3:left ]
  *
  * @returns {array} shownWalls - An array that shows which walls are being shown.
  */
  getShownWalls() {
    let tWall = true ? this.walls.topWall.isShown : false;
    let rWall = true ? this.walls.rightWall.isShown : false;
    let bWall = true ? this.walls.bottomWall.isShown : false;
    let lWall = true ? this.walls.leftWall.isShown : false;

    let shownWalls = [tWall, rWall, bWall, lWall];

    return shownWalls;
  }

  /*
  * Equality function for 'Cell' objects. Determines equality based on coordinates
  * in the maze.
  *
  * @param {Cell} otherCell - A cell to test for equality with.
  * 
  * @returns {bool} - Whether the two cells are the same.
  */
  equals(otherCell) {
    if (
      this.rowNumber == otherCell.rowNumber &&
      this.columnNumber == otherCell.columnNumber
    ) {
      return true;
    }

    return false;
  }

  /*
  * String representation of a cell object.
  *
  * @returns {string} string - String representation of a 'Cell' object.
  */
  toString() {
    let string = `Position: ${this.rowNumber}, ${this.columnNumber}
                  Visited: ${this.visited}
                  Walls: ${this.walls}`;

    return string;
  }
}

export default Cell;
