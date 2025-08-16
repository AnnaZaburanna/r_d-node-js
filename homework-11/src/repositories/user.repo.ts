import {Orm} from "../orm/orm";
import {Pool} from "pg";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: "male" | "female" | "other";
}


export class UserRepo extends Orm<User> {
    constructor(pool:Pool) {
        super('users', pool);
    }
}