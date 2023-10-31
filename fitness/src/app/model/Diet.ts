export interface Diet{
    quantity: number;
    type: string;
    date: Date;
    foodId: number;
    userId: number;
    trainerId: number | null;
}