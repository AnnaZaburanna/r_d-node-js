import {deleteUser, getUserById, updateUser} from "../../../services/users.service.js";

export const GET = async (req, res, params) => {
    const user = await getUserById(params.id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
}

export const PUT = async (req, res, params, body) => {
    const updatedUser = await updateUser({id: params.id, name: body.name })
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
}

export const DELETE = async (req, res, params) => {
    const deletedUser = await deleteUser(params.id)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(deletedUser));
}

