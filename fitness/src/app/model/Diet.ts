import { Food } from "./Food";

export interface Diet{
    id?: number
    quantity: number;
    type: string;
    date: Date;
    foodId?: number;
    guestId?: number;
    trainerId?: number | null;
    food?: Food
}