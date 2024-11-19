export type ExpenseType = "income" | "expense";
export type ExpenseCategory = "salary" | "food" | "transport";

export interface IExpense {
    id: number
    title: string
    nominal: number
    type: ExpenseType
    category: ExpenseCategory
    date: string
}