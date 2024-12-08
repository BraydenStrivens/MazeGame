
export const GameModes = {
    "defaultMode": "default",
    "memoryMode": "memory",
    "franticMode": "frantic",
}

export const GameModeDescriptions = {
    "default": "Default Mode: Solve the maze in the shortest amount of time.",
    "memory": "Memory Mode: \
                    Starting after 3 seconds has passed, \
                    the maze is visible for 1 second every 5 seconds. \
                    Try to remember the layout of the maze to solve it in the \
                    least amount of time.",
    "frantic": "Frantic Mode: \
                    A random number of walls within the maze shift every three seconds.\
                    Try to avoid getting boxed in to solve the maze in the least \
                    amount of time.",
}

export const Difficulties = {
    easy: "easy",
    medium: "medium",
    hard: "hard",
    impossible: "impossible"
}

export const DifficultyDimensions = {
    "easy": [10, 10],
    "medium": [15, 15],
    "hard": [20, 20],
    "impossible": [25, 25]
}

export const Colors = [
    "rgb(255, 255, 255)",
    "rgb(255, 0, 0)",
    "rgb(0, 0, 255)",
    "rgb(0, 255, 0)",
    "rgb(255, 255, 0)",
    "rgb(255, 127, 0)",
    "rgb(0, 255, 255)",
    "rgb(255, 0, 255)",
    "rgb(127, 0, 255)", 
]

export const MazeColors = {
    "white": "rgb(255, 255, 255)",
    "red": "rgb(255, 0, 0)",
    "blue": "rgb(0, 0, 255)",
    "green": "rgb(0, 255, 0)",
    "yellow": "rgb(255, 255, 0)",
    "orange": "rgb(255, 127, 0)",
    "cyan": "rgb(0, 255, 255)",
    "pink": "rgb(255, 0, 255)",
    "purple": "rgb(127, 0, 255)",
    "mixed": "mixed",
    "mixed-animated": "mixed-animated",
}

export const MazeBackgrounds = {
    "default": "default.jfif",
    "galaxy1": "galaxy1.jpg",
    "galaxy2": "galaxy2.jpg",
    "clouds": "clouds.jpeg",
    "retro": "retro-futuristic.jpg",
    "futuristicCity": "futuristic-city.jpg",
}

export const PlayerIcons = {
    "default": "default-icon.png",
    "default-red": "default-icon-red.png",
    "default-blue": "default-icon-blue.png",
    "default-green": "default-icon-green.png",
    "rainbow": "rainbow-dot-icon.png",
    "warm-rainbow": "warm-rainbow-icon.png",
    "cool-rainbow": "cool-rainbow-icon.png",
}

export const Sounds = {
    background: "./assets/audio/backgroundMusic/the_ano_interval.mp3",
    buttonClick: "./assets/audio/gameSounds/button_click.mp3",
    gameOver: "./assets/audio/gameSounds/game_over.mp3",
    rotateWalls: "./assets/audio/gameSounds/rotate_walls.mp3"
}