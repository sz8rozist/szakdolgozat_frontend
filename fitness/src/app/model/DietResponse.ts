import { Diet } from "./Diet";

export interface DietResponse{
    diet: Diet[]
    calorieSum: number,
    proteinSum: number,
    carbonhydrateSum: number,
    fatSum: number
}