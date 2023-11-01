import { Food } from "./Food";

export interface Diet{
    id?: number
    quantity: number;
    type: string;
    date: Date;
    foodId?: number;
    userId?: number;
    trainerId?: number | null;
    food?: Food
}