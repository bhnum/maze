import { executeSolver, showExecutions } from './execution.js';
import { generateMaze } from './generation.js';
import { Maze } from './maze.js';

/**
 * @param {number} seconds
 * @returns {Promise<void>}
 */
function wait(seconds) {
    const { promise, resolve } = Promise.withResolvers();
    setTimeout(resolve, seconds * 1000);
    return promise;
}

const mazeContainer = document.getElementById('mazeContainer');
const maze = new Maze(mazeContainer, 18, 18);

async function handleMazeGeneration() {
    mazeContainer.classList.add('generating');

    generateMaze(maze);
    maze.save();

    await wait((maze.height + 1) * 0.025 + 0.2);
    mazeContainer.classList.remove('generating');
}

document.getElementById('generateButton').onclick = () =>
    handleMazeGeneration();

document.getElementById('solveButton').onclick = () => executeSolver(maze);

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
