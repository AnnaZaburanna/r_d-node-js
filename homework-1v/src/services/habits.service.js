import * as repo from '../models/habits.model.js';
import {getRecentByDays, now} from "../utils.js";

export const listHabitsService = () => repo.getAll();
export const addNewHabitService = async (payload) => {
    const  data  = await repo.getAll();
    if (!data.find((item) => item.name === payload.name)) {
        return repo.create(payload)
    } else {
        return new Promise((resolve, reject)=>{
            reject('Such habit already exist');
        });
    }
};

export const removeHabitByIdService = async (payload) => {
    const habit = await repo.getById(payload.id);
    if (habit) {
        return repo.remove(payload.id);
    } else {
        return new Promise((resolve, reject)=>{
            reject('There is no such id in database');
        });
    }
}
export const updateHabitService = async (payload) => {
    const {id, ...rest} = payload
    const habit = await repo.getById(id);
    if (habit) {
        return repo.update(id, rest);
    } else {
        return new Promise((resolve, reject)=>{
            reject('There is no such id in database');
        });
    }
}
export const checkDoneHabitService = async (payload) => {
    const habit = await repo.getById(payload.id);
    const dates = { completedDates: [...habit.completedDates ?? [], now()]};

    if (habit) {
        return repo.update(payload.id, dates);
    } else {
        return new Promise((resolve, reject)=>{
            reject('There is no such id in database');
        });
    }
};
export const getStatusService = async () => {
    const data = await repo.getAll();

    data.forEach(habit => {
        const dates = habit.completedDates ?? [];

        const range7 = habit.freq === 'daily' ? 7 : 1;
        const range30 =  habit.freq === 'daily' ? 30 : habit.freq === 'weekly' ? 4 : 1;
        const percent7 = Math.min(100, (getRecentByDays(dates, 7) / range7) * 100);
        const percent30 = Math.min(100, (getRecentByDays(dates, 30) / range30) * 100 );

        console.log(`7 days progress of your ${habit.freq} habit ${habit.name}: ${percent7.toFixed(2)}% completed`)
        console.log(`30 days progress of your ${habit.freq} habit ${habit.name}: ${percent30.toFixed(2)}% completed`)
    });
};