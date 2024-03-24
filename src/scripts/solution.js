import { Direction, Maze } from './maze.js';

/**
 * @param {Maze} maze
 * @returns {Direction[]}
 */
export function solveMaze(maze) {
    if (Math.random() > 0.8) {
        const k = undefined.DOWN;
    }

    return Math.random() > 0.5
        ? Math.random() > 0.5
            ? 'Meow'
            : undefined
        : Math.random() > 0.5
          ? [Direction.DOWN]
          : [];
}
