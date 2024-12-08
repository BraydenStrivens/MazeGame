
import Game from "./game.js";
import {
  GameModes,
  PlayerIcons,
  MazeColors,
  MazeBackgrounds,
  GameModeDescriptions,
  Sounds,
} from "./utilities.js";

let game;
var renderAnimatedBackground = true

window.addEventListener("load", function () {

  // Initializes the canvas for drawing the maze
  const mazeCanvas = document.getElementById("gameCanvas");
  const context = mazeCanvas.getContext("2d");

  mazeCanvas.width = 1080;
  mazeCanvas.height = 1080;

  // Initializes game object
  game = new Game(mazeCanvas);
  game.init();

  // AUDIO -Start ---------------------------------------------------
  let backgroundMusic = $("#backgroundMusic")[0]
  let buttonClickSound = new Audio(`${Sounds.buttonClick}`)

  backgroundMusic.autoplay = true

  backgroundMusic.volume = 0.05;
  buttonClickSound.volume = 0.5;

  var newMusicVolume = 0.05
  var newGameVolume = 0.5

  $("button").click(function () {
    buttonClickSound.play()
  });

  document.addEventListener("mousemove", (event) => {
    backgroundMusic.play()
  });
  // AUDIO -End ------------------------------------------------------

  $("#modeDescription").html(GameModeDescriptions[game.gameMode]);

  // Moves the player within the maze
  document.addEventListener("keydown", (event) => {
    if (game.isPaused == false) {
      game.maze.move(event);
    }
  });

  // ANIMATED BACKGROUND -Start --------------------------------------
  const starColors = [
    "rgb(255, 255, 255)",
    "rgb(66, 236, 245)",
    "rgb(125, 179, 189)",
    "rgb(247, 5, 5)",
    "rgb(107, 45, 41)",
    "rgb(223, 230, 34)",
  ];
  let numColors = starColors.length;

  function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * numColors);
    return starColors[randomIndex];
  }

  function generateRandomPercent(min = 0, max = 100) {
    const randomInteger = Math.floor(Math.random() * (max + 1));
    return `${randomInteger}%`;
  }

  function generateRadomDelay(interval = 3) {
    const randomInteger = Math.random() * (interval + 1);
    return `${randomInteger}s`;
  }

  function createStar() {
    const star = document.createElement("div");
    star.classList.add("star");
    let randomColor = getRandomColor();
    star.style.backgroundColor = `${randomColor}`;
    star.style.border = `${randomColor} 0px solid`;
    star.style.zIndex = `${-1}`;
    star.style.top = generateRandomPercent();
    star.style.left = generateRandomPercent();
    star.style.animationDelay = generateRadomDelay();
    return star;
  }

  function renderStars(amount = 300) {
    if (renderAnimatedBackground) {
      const container = document.getElementById("animatedBackground");
      const placeholdersArray = Array(amount).fill("star_placeholder");
      const starsArray = placeholdersArray.map((starPlacholder, index) =>
        createStar()
      );
      container.append(...starsArray);
    }
  }

  renderStars();
  // ANIMATED BACKGROUND -End ----------------------------------------

  // Game States
  let mainMenuState = $("#mainMenu");
  let selectModeState = $("#selectMode");
  let playState = $("#playState");
  let pauseState = $("#pauseGame");
  let customizeState = $("#customizeState");
  let gameOverState = $("#gameOverState");
  let settingsState = $("#settingsContainer");

  // MAIN MENU STATE -Start -------------------------------------
  let menuPlayButton = $("#playButton");
  let menuCustomizeButton = $("#customizeButton");
  let menuSettingsButton = $("#settingsButton");

  menuPlayButton.click(function () {
    mainMenuState.hide();
    selectModeState.show();
  });
  menuCustomizeButton.click(function () {
    mainMenuState.hide();
    customizeState.show();
  });
  menuSettingsButton.click(function () {
    settingsState.css("display", "flex");
  });
  // MAIN MENU STATE -End ---------------------------------------

  // MODE SELECT STATE -Start -----------------------------------
  let modeSelectBackArrow = $("#selectBackArrow");

  modeSelectBackArrow.click(function () {
    selectModeState.hide();
    mainMenuState.show();
  });

  // Difficulties
  let difficultyButton = $(".difficulty-button");

  difficultyButton.click(function () {
    let ids = ["easyButton", "mediumButton", "hardButton", "impossibleButton"];

    ids.forEach((button) => {
      if ($(this).attr("id") == button) {
        $(`#${button}`).css("filter", "brightness(200%)");
        game.changeDifficulty(button.split("B")[0]);
      } else {
        $(`#${button}`).css("filter", "brightness(100%)");
      }
    });
  });

  // Game Modes
  let gameModeButton = $(".game-mode-button");

  gameModeButton.click(function () {
    let ids = ["defaultMode", "memoryMode", "franticMode"];

    ids.forEach((button) => {
      if ($(this).attr("id") == button) {
        let newGameMode = GameModes[button];

        $("#modeDescription").html(GameModeDescriptions[newGameMode]);
        game.changeGameMode(newGameMode);

        $(`#${button}`).css("filter", "brightness(200%)");
      } else {
        $(`#${button}`).css("filter", "brightness(100%)");
      }
    });
  });

  // Navigation Buttons
  let modeSelectPlayButton = $("#modePlayButton");

  modeSelectPlayButton.click(function () {
    game.setupMaze(context);
    game.startGame();

    selectModeState.hide();
    playState.show();
  });
  // MODE SELECT STATE -End -------------------------------------

  // PLAY STATE -Start ------------------------------------------
  let pauseButton = $("#pauseButton");

  pauseButton.click(function () {
    game.pauseTimer();
    pauseState.show();
  });
  // PLAY STATE -End --------------------------------------------

  // PAUSE STATE -Start -----------------------------------------
  let resumeButton = $("#pauseResumeButton");
  let restartButton = $("#pauseRestartButton");
  let pauseSettingsButton = $("#pauseSettingsButton");
  let quitButton = $("#pauseQuitButton");

  resumeButton.click(function () {
    game.startTimer();
    pauseState.hide();
  });

  restartButton.click(function () {
    pauseState.hide();
    game.restartGame(context);
  });

  pauseSettingsButton.click(function () {
    settingsState.css("display", "flex");
  });

  quitButton.click(function () {
    game.endGame();
    game.updateMaze()
    pauseState.hide()
    playState.hide()
    mainMenuState.show()
  });
  // PAUSE STATE -End ---------------------------------------------

  // CUSTOMIZE STATE -Start ---------------------------------------
  let customizeBackArrow = $("#customizeBackArrow");
  let iconSelectBox = $("#playerIconSelect");
  let mazeColorSelectBox = $("#mazeColorSelect");
  let mazeBackgroundColorSelectBox = $("#mazeBackgroundColorSelect");
  let customizeSaveButton = $("#customizeSaveButton");

  let backgroundImage = document.getElementById("backgroundImage");
  let iconPreview = document.getElementById("iconPreview");
  let colorPreview = document.getElementById("mazeColorPreview");
  let backgroundPreview = document.getElementById("backgroundPreview");

  let newIcon;
  let newColor;
  let newBackground;
  
  customizeBackArrow.click(function () {
    customizeState.hide();
    mainMenuState.show();

  });

  iconSelectBox.on("change", function () {
    let keys = Object.keys(PlayerIcons);

    keys.forEach((icon) => {
      if (icon == $(this).val()) {
        var path = `./assets/images/playerIcons/${PlayerIcons[icon]}`;

        iconPreview.src = path;
        newIcon = icon
      }
    });
  });

  mazeColorSelectBox.on("change", function () {
    let keys = Object.keys(MazeColors);

    keys.forEach((color) => {
      if (color == $(this).val()) {
        let path = `./assets/images/previews/${color}.PNG`;
        console.log( $(this).val())
        if ($(this).val() == "mixed-animated") {
          path = "./assets/images/previews/mixed.PNG"
          console.log("TREU")
        }
        colorPreview.src = path;
        newColor = color
        
      }
    });
  });

  mazeBackgroundColorSelectBox.on("change", function () {
    let keys = Object.keys(MazeBackgrounds);

    keys.forEach((background) => {
      if (background == $(this).val()) {
        let path = `./assets/images/backgroundImages/${MazeBackgrounds[background]}`;
        newBackground = path
        backgroundPreview.src = path;
      }
    });
  });

  customizeSaveButton.click(function () {
    if (newIcon) game.player.updatePlayerIcon(newIcon);
    if (newColor) game.updateWallColor(newColor);
    if (newBackground) backgroundImage.src = newBackground;
    customizeState.hide();
    selectModeState.show();
  });
  // CUSTOMIZE STATE -End ----------------------------------------

  // GAME OVER STATE -Start --------------------------------------
  let playAgainButton = $("#playAgainButton")
  let mainMenuButton = $("#gameOverMainMenuButton")

  playAgainButton.click(function () {
    gameOverState.hide();
    game.newGame(context);
  });

  mainMenuButton.click(function () {
    game.endGame();
    game.updateMaze()
    gameOverState.hide()
    playState.hide()
    mainMenuState.show()
  });
  // GAME OVER STATE -End ----------------------------------------

  // SETTINGS STATE -Start ---------------------------------------
  let closeButton = $(".close-settings-button");
  let masterVolumeSlider = $("#masterVolume")[0]
  let masterVolumeValue = $("#masterVolumeValue");
  let musicVolumeSlider = $("#musicVolume")[0]
  let musicVolumeValue = $("#musicVolumeValue");
  let gameVolumeSlider = $("#gameVolume")[0]
  let gameVolumeValue = $("#gameVolumeValue")
  let saveSettingsButton = $("#saveSettingsButton")

  closeButton.click(function() {
    settingsState.hide()
  });

  masterVolumeSlider.addEventListener('mouseup', function() {
    masterVolumeValue.html(this.value);

    musicVolumeSlider.value = this.value
    musicVolumeValue.html(this.value);

    gameVolumeSlider.value = this.value
    gameVolumeValue.html(this.value);

    newMusicVolume = this.value / 1000
    newGameVolume = this.value / 100
  });

  musicVolumeSlider.addEventListener('mouseup', function() {
    musicVolumeValue.html(this.value);
    
    newMusicVolume = this.value / 1000
  });

  gameVolumeSlider.addEventListener('mouseup', function() {
    gameVolumeValue.html(this.value);

    newGameVolume = this.value / 100
  });

  saveSettingsButton.click(function() {
    backgroundMusic.volume = newMusicVolume
    buttonClickSound.volume = newGameVolume
    game.rotateWallsAudio.volume = newGameVolume
    game.gameOverAudio.volume = newGameVolume
  });
  // SETTINGS STATE -End ----------------------------------------

  // Game loop and fps setting
  let lastTime = 0;

  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.update();
    game.render(context, deltaTime);

    if (game.isRunning) requestAnimationFrame(gameLoop);
  }

  gameLoop(0);
});
