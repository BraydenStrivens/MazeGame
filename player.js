
import { PlayerIcons } from "./utilities.js"

class Player {
    /*
    * Class containing information and functions for updating and drawing the player to the screen.
    *
    * @param {Game} game - A reference to an initialized 'Game' object.
    */
    constructor(game) {
        this.game = game

        this.x = 0
        this.y = 0

        this.playerRadius = (this.game.maze.size / this.game.maze.rows) / 3

        this.spriteWidth = 200
        this.spriteHeight = 200
        this.cellSize = this.game.maze.size / this.game.maze.rows

        this.playerImage = new Image(this.spriteWidth, this.spriteHeight)
        this.playerImage.src = "./assets/images/playerIcons/default-icon.png"
    }

    /*
    * Updates the size of the player icon.
    *
    * @param {number} newRadius - The new radius of the player icon.
    */
    updateRadius(newRadius) {
        this.playerRadius = newRadius
    }

    /*
    * Updates the size of the maze's cells, which the player icon sits in.
    *
    * @param {number} newCellSize - The new size of the maze's cells.
    */
    updateCellHeight(newCellSize) {
        this.cellSize = newCellSize
    }

    /*
    * Updates the player icon image.
    *
    * @param {string} newIcon - The file name of the new icon.
    */
    updatePlayerIcon(newIcon) {
        let iconPath = PlayerIcons[newIcon]
        this.playerImage = new Image(this.cellSize)
        this.playerImage.src = `./assets/images/playerIcons/${iconPath}`
    }

    /*
    * Sets the x and y coordinates of the player within the maze.
    *
    * @param {number} x - The new x coordinate of the player in the maze.
    * @param {number} y - The new y coordinate of the player in the maze.
    */
    setPosition(x, y) {
        this.x = x 
        this.y = y
    }

    /*
    * Renders the player icon to the canvas.
    *
    * @param {canvas context} context - The context of the canvas used to draw the player.
    */
    render(context) {
        this.drawPlayer(context)
    }

    /*
    * Translates the original size of the player icon to fit within the maze's cells. Draws the translated.
    * player icon to the canvas.
    * 
    * @param {canvas context} context - The context of the canvas used to draw the player.
    */
    drawPlayer(context) {
        context.drawImage(this.playerImage, 
            0, 0, this.spriteWidth, this.spriteHeight, 
            this.x + (this.cellSize / 6), this.y + (this.cellSize / 6), this.cellSize * 2/3, this.cellSize * 2/3)
    }
}

export default Player