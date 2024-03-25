import { Direction } from './direction.js';
import { Maze } from './maze.js';

/**
 * @param {Maze} maze
 * @returns {Direction[]}
 */
export function solveMaze(maze) {
    // TODO:
    // Write your algorithm here!

    // TODO: Remove these later
    const path = solve(maze, maze.startPoint, [], []);

    if (Math.random() > 0.95) {
        path.splice(Math.floor(Math.random() * path.length), 0, 'u')[0];
    }

    if (Math.random() > 0.95) {
        return undefined;
    }

    if (Math.random() > 0.95) {
        return Direction.UP;
    }

    if (Math.random() > 0.9) {
        path.push(
            Math.random() > 0.5
                ? Math.random() > 0.5
                    ? Direction.UP
                    : Direction.DOWN
                : Math.random() > 0.5
                  ? Direction.LEFT
                  : Direction.RIGHT,
        );
    }

    if (Math.random() > 0.9) {
        path.pop();
    }

    if (Math.random() > 0.5) {
        path.splice(Math.floor(Math.random() * path.length), 1)[0];
    }

    if (Math.random() > 0.9) {
        path.push(
            Direction.UP,
            Direction.LEFT,
            Direction.DOWN,
            Direction.RIGHT,
        );
    }

    return path;
}

// TODO: Remove this later
function solve(maze, point, visited, path) {
    if (maze.isBlocked(point)) {
        return;
    }

    if (visited.some((v) => point.equals(v))) {
        return;
    }

    if (point.equals(maze.endPoint)) {
        return path;
    }

    visited.push(point);

    let sol;

    if ((sol = solve(maze, point.left, visited, [...path, Direction.LEFT]))) {
        return sol;
    }

    if ((sol = solve(maze, point.up, visited, [...path, Direction.UP]))) {
        return sol;
    }

    if ((sol = solve(maze, point.right, visited, [...path, Direction.RIGHT]))) {
        return sol;
    }

    if ((sol = solve(maze, point.down, visited, [...path, Direction.DOWN]))) {
        return sol;
    }
}
