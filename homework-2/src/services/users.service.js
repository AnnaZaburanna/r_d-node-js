import * as repo from '../models/users.model.js';

export const usersList = () => repo.getAll();

export const createUser  = (payload) => repo.create(payload);

export const getUserById = (payload) => repo.getById(payload)

export const updateUser = async (payload) => {
    const {id, ...rest} = payload
    return repo.update(id, rest);
}
export const deleteUser = (payload) => repo.remove(payload)