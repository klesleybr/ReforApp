import Decimal from "decimal.js"
import { Timestamp } from "firebase/firestore"

export type Product = {
    name: string,
    amount: number | undefined,
    cost?: number | undefined | null,
    price: number | undefined,
    status: boolean | undefined,
    sold: number | undefined,
    description?: string | undefined | null,
    category?: Category | undefined | null,
    createdAt: Timestamp | undefined, 
    updatedAt: Timestamp | undefined
}

export type Category = {
    name: string,
    description?: string
}