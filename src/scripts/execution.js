import { Direction, Maze } from './maze.js';
import { solveMaze } from './solution.js';

const logContainer = document.getElementById('logContainer');

export function showExecutions() {
    const logsStr = localStorage.getItem('logs');

    if (!logsStr) {
        localStorage.setItem('logs', '[]');
        return;
    }

    try {
        const logs = JSON.parse(logsStr);
        for (const log of logs) {
            showLog(log);
        }
    } catch (e) {
        console.error(e);
        localStorage.removeItem('logs');
    }
}

/**
 * @param {Maze} maze
 */
export function executeSolver(maze) {
    let solution, error;
    try {
        solution = solveMaze(maze);
        ({ error } = executeSolution(maze, solution));
    } catch (e) {
        console.error(e);
        error = e.stack;
    }

    const log = {
        time: new Date().toLocaleString(),
        solution,
        error,
    };
    addLog(log);
    showLog(log);
}

/**
 * @param {Maze} maze
 * @param {Direction[]} solution
 * @returns {{error: string}}
 */
function executeSolution(maze, solution) {
    if (
        !(solution instanceof Array) ||
        solution.some((d) => d in Object.values(Direction))
    ) {
        return {
            error: 'Return value of solveMaze() must be an array of Direction',
        };
    }

    // TODO: Check and show path of solution

    return {};
}

function addLog(log) {
    const logsStr = localStorage.getItem('logs');
    const logs = JSON.parse(logsStr);

    logs.unshift(log);

    localStorage.setItem('logs', JSON.stringify(logs));
}

function showLog({ time, solution, error }) {
    const solutionString = !(solution instanceof Array)
        ? '<i>Error</i>'
        : solution.length > 0
          ? solution.join()
          : '<i>Empty</i>';

    const logElement = document.createElement('div');
    logContainer.prepend(logElement);

    logElement.innerHTML = `
    <div class="time">${time}</div>
    <div class="output">Output: <span class="solution">${solutionString}</span></div>
    `;

    if (error) {
        logElement.innerHTML += `<div class="error">${error ?? ''}</div>`;
    }
}
