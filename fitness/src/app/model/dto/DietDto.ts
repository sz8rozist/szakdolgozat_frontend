export interface DietDto{
    dietId: number
    foodType: string
    quantity: number
    eated: boolean
    calorie: number
    carbonhydrate: number,
    protein: number,
    fat: number
    name: string
    foodId: number
    trainerId: number | null
}