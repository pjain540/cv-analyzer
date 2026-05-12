import type { Types } from "mongoose";

export interface IJobDescription {
    title: string;
    experience: string;
    skills: string[];
    description: string;
    user: Types.ObjectId;
}
