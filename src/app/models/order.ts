import { IProduct } from "./product";

export interface IOrder {
    address: string
    products: IProduct[]
    total: number
    grandTotal: number
    deliveryCharge: number
    status: string
    payment_status: boolean
    payment_mode: string
    id?: string
    user_id?: string
    instruction?: string
    created_at?: Date
    updated_at?: Date
    payment_id?: string
}
