import {
    listHabits,
    addHabit,
    removeHabit,
    updateHabit,
    checkDoneHabit,
    getStatus
} from "../controllers/habits.controller.js";

function parseArgs(args) {
    const result = {};
    args.forEach((arg, i) => {
        if (arg.startsWith('--')) {
            result[arg.slice(2)] = args[i + 1];
        }
    });
    return result;
}

function route(args) {
    const command = args[0];
    const options = parseArgs(args.slice(1));

    switch (command) {
        case 'add':
            addHabit(options);
            break;
        case 'list':
            listHabits();
            break;
        case 'done':
            checkDoneHabit(options);
            break;
        case 'stats':
            getStatus();
            break;
        case 'delete':
            removeHabit(options);
            break;
        case 'update':
            updateHabit(options);
            break;
        default:
            console.log('Невідома команда');
    }
}

export {route}
