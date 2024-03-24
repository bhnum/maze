import { executeSolver, showExecutions } from './execution.js';
import { generateMaze } from './generation.js';
import { Maze } from './maze.js';

const maze = new Maze(document.getElementById('mazeContainer'), 16, 16);

document.getElementById('generateButton').onclick = () => {
    generateMaze(maze);
    maze.save();
};

document.getElementById('solveButton').onclick = () => {
    executeSolver(maze);
};

showExecutions();

if (maze.hasSaved) {
    try {
        maze.load();
    } catch (e) {
        console.error(e);

        maze.initialize();
        generateMaze(maze);
        maze.save();
    }
} else {
    maze.initialize();
    generateMaze(maze);
    maze.save();
}
