import {
    addNewHabitService, checkDoneHabitService, getStatusService,
    listHabitsService,
    removeHabitByIdService,
    updateHabitService
} from "../services/habits.service.js";

export const listHabits =()=> {
   return listHabitsService().then((data) => console.table(data))
}

export const addHabit = (payload) => {
   return addNewHabitService(payload).then(() =>
       console.log( 'Habit was added'
       ), (e)=> {
       console.log(`Something went wrong with message: ${e}`);
   })
}

export const removeHabit = (payload) => {
    if (!payload.id) {
        console.log('Please provide id');
        return []
    }

    return removeHabitByIdService(payload)
        .then(() =>
             console.log( `Habit ${payload.id} was deleted`
        ), (e)=> {
            console.log(`Something went wrong with message: ${e}`);
        })
}

export const updateHabit = (payload) => {
    if (!payload.id) {
        console.log('Please provide id');
        return []
    }

    return updateHabitService(payload)
        .then(() =>
            console.log( `Habit ${payload.id} was updated`
            ), (e)=> {
            console.log(`Something went wrong with message: ${e}`);
        })
}
export const checkDoneHabit =(payload) => {
    if (!payload.id) {
        console.log('Please provide id');
        return []
    }

    return checkDoneHabitService(payload)
        .then(() =>
            console.log( `Habit ${payload.id} was DONE`
            ), (e)=> {
            console.log(`Something went wrong with message: ${e}`);
        })
}
export const getStatus = () => getStatusService();