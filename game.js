
/* @type {HTMLCanvasElement} */

import Player from "./player.js";
import Maze from "./maze.js";
import {
  GameModes,
  Difficulties,
  DifficultyDimensions,
  MazeColors,
  Sounds,
} from "./utilities.js";

// Timer properties
var timer;
var seconds;

// Used to count the number of calls of the render function
var index = 0;

class Game {
  /*
  * Class containing information and functions for updating and rendering the maze game.
  *
  * @param {canvas} canvas - The HTML canvas the game is drawn to.
  */
  constructor(canvas) {
    this.canvas = canvas
    this.difficulty = Difficulties.easy;
    this.gameMode = GameModes["defaultMode"];

    this.gameWidth = canvas.width;
    this.gameHeight = canvas.height;

    this.isRunning = false;
    this.isPlaying = false;
    this.isPaused = false;
    this.isGameOver = false;

    this.mazeGenerationComplete = false;
    this.mazeWallColor = MazeColors.white;
    this.mazeBackground = "";

    this.maze;
    this.updateMaze();
    this.player = new Player(this);

    this.gameDuration = 0;

    this.gameOverAudio = new Audio(`${Sounds.gameOver}`)
    this.rotateWallsAudio = new Audio(`${Sounds.rotateWalls}`)
    this.gameOverAudio.volume = 0.5
    this.rotateWallsAudio.volume = 0.5

    this.fps = 90;
    this.timer = 0;
    this.interval = 1000 / this.fps;
  }

  /*
  * Starts the game timer.
  */
  startTimer() {
    if (!this.isPaused) seconds = 0;
    this.isPaused = false;
    timer = setInterval(function () {
      seconds++;
    }, 1000);
  }

  /*
  * Pauses the game timer.
  */
  pauseTimer() {
    this.isPaused = true;
    clearInterval(timer);
  }

  /*
  * Ends the game timer.
  */ 
  stopTimer() {
    clearInterval(timer);
  }

  /*
  * Generates the maze and draws it to the canvas.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  setupMaze(context) {
    this.maze.setupMaze();
    while (!this.mazeGenerationComplete) {
      context.clearRect(0, 0, this.gameWidth, this.gameHeight);
      this.maze.draw(context);
    }
  }

  /*
  * Setter for the 'mazeGenerationComplete' game class variable.
  *
  * @param {bool} isComplete - Whether the maze is finished generating.
  */
  setMazeGenerationComplete(isComplete) {
    this.mazeGenerationComplete = isComplete;
  }

  /*
  * Getter for the 'mazeGenerationComplete' game class variable.
  */
  getMazeGenerationComplete() {
    return this.mazeGenerationComplete;
  }

  /*
  * Updates the current game's difficulty based on input from the user. Updates the maze
  * with this new difficulty.
  *
  * @param {string} newDifficulty - The new difficulty used to re-generate the maze.
  */
  changeDifficulty(newDifficulty) {
    this.difficulty = newDifficulty;
    this.updateMaze();

    let newCellSize = this.maze.size / this.maze.rows;
    this.player.updateCellHeight(newCellSize);
  }

  /*
  * Updates the current game's game mode based on input from the user
  *
  * @param {string} newGameMode - The new game mode.
  */
  changeGameMode(newGameMode) {
    this.gameMode = newGameMode;
  }

  /*
  * Updates the maze's wall color based on user input. Updates the maze with
  * this new color.
  *
  * @param {string} newColor - The new wall color to draw the maze walls with.
  */
  updateWallColor(newColor) {
    this.mazeWallColor = MazeColors[newColor];
    this.updateMaze();
  }

  /*
  * Updates information about the maze and regenerates it.
  */
  updateMaze() {
    this.mazeGenerationComplete = false;

    let dimensions = DifficultyDimensions[this.difficulty];

    this.maze = new Maze(
      this,
      this.gameHeight,
      dimensions[0],
      dimensions[1],
      this.mazeWallColor
    );
  }

  /*
  * Restarts the game with the same maze.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  restartGame(context) {
    this.endGame();
    this.setupMaze(context);
    this.isPaused = false;
    this.startGame();
  }

  /*
  * Restarts the game with a newly generated maze.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  newGame(context) {
    this.endGame();
    this.updateMaze();
    this.setupMaze(context);

    this.startGame();
  }

  /*
  * Starts the game timer and updates the game's current state properties.
  */
  startGame() {
    $("#gameOverState").hide();
    this.player.x = 0;
    this.player.y = 0;
    this.startTimer();
    this.isPlaying = true;
    this.isGameOver = false;
  }

  /*
  * Stops the game timer and updates the game's current state properties. Pushes the 
  * 'GameOver' state.
  */
  gameOver() {
    this.playing = false;
    this.isGameOver = true;
    this.stopTimer();

    this. gameOverAudio.play()

    $("#gameOverTimer").html(`${this.gameDuration} Seconds`);
    $("#gameOverState").show();
  }

  /*
  * Stops the game timer and updates the game's current state properties.
  */
  endGame() {
    this.isPaused = false;
    this.isPlaying = false;
    this.stopTimer();
  }

  /*
  * Monitors the game's duration and updates the displayed timer.
  */
  update() {
    if (this.isPlaying && !this.isPaused && !this.isGameOver) {
      this.gameDuration = seconds;

      $("#timer").html(`${this.gameDuration}`);
    }
  }

  /*
  * Renders the maze and player icon to the screen.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  renderMazeAndPlayer(context) {
    if (this.mazeGenerationComplete) {
        this.maze.drawGeneratedMaze(context);
        this.player.render(context);
    }
  }

  /*
  * Renders the game specific to the current game mode.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  * @param {number} deltaTime - The change in time since the last call of the function.
  */
  render(context, deltaTime) {
    // Renders game at defined frames per second
    if (this.timer > this.interval && this.isPlaying) {
      this.timer = 0;
      context.clearRect(0, 0, this.gameWidth, this.gameHeight);

      if (this.gameMode === GameModes["memoryMode"]) {
        this.renderMemoryMode(context);
      } else if (this.gameMode === GameModes["franticMode"]) {
        this.renderFranticMode(context);
      } else {
        this.renderMazeAndPlayer(context);
      }
    }

    this.timer += deltaTime;
  }

  /*
  * Controls rendering for the 'Memory' game mode.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  renderMemoryMode(context) {
    // Starting after 3 seconds
    if (this.gameDuration > 3 && !this.isGameOver) {

      // Only render the maze and player at specified interval
      if ((this.gameDuration % 5) - 3 == 0) {
        this.renderMazeAndPlayer(context)
      } 
    // Render the maze and player during the intial 3 seconds
    } else {
        this.renderMazeAndPlayer(context)
    }
  }

  /*
  * Controls rendering for the 'Frantic' game mode. Also controls rotation of cell walls. 
  * The 'rotateCellWalls' function can only be called 46 times. 45 times to rotate the 
  * wall by 2 degrees for a total 90 degree rotation. And one time to reset the walls
  * data.
  *
  * @param {canvas context} context - The context of the canvas used to draw the player.
  */
  renderFranticMode(context) {
    this.maze.isRotating = true;

    // Rotate the walls every 3 seconds.
    if (this.gameDuration !== 0 && this.gameDuration % 3 === 0) {
      // Only call the 'rotateCellWalls' function 46 times
      if (index <= 45) {
        // Select cells to rotate once
        if (index === 0) {
          this.maze.selectCellsToRotate();
          this.rotateWallsAudio.play();
        }

        this.maze.rotateCellWalls(index);
        index++;
      } else {
        this.maze.isRotating = false;
      }
    } else {
      index = 0;
    }

    this.renderMazeAndPlayer(context)
  }

  init() {
    this.isRunning = true;
  }
}

export default Game;
