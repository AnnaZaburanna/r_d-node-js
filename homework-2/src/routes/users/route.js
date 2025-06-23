import {createUser, usersList} from "../../services/users.service.js";

export const GET = async (req, res) => {
    const users = await usersList();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

export const POST = async (req, res, params, body) => {
    const newUser = await createUser(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
}
