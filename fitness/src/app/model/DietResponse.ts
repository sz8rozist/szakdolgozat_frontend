import { Diet } from "./Diet";
import { DietDto } from "./dto/DietDto";

export interface DietResponse{
    diet: DietDto[]
    calorieSum: number,
    proteinSum: number,
    carbonhydrateSum: number,
    fatSum: number,
}