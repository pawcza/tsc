import {ObjectId} from "mongodb";

export interface TextType {
    _id: ObjectId;
    text: string;
    votes: number;
}

export interface CodeType {
    _id: ObjectId;
    number: number;
    totalVotes: number;
    texts: TextType[];
}

export interface UserType {
    _id: ObjectId;
    added: boolean;
    codes: ObjectId[];
    ip: string;
}
