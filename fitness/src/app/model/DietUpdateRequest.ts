import { Food } from "./Food";

export interface DietUpdateRequest{
    quantity: number;
    type: string;
    date: Date;
    foodId: number
}