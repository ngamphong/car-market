export type Category = {
  id: number
  name: string
}

export type CarStatus = "available" | "reserved" | "sold"

export type CustomerInquiry = {
  id: number
  car_id: string
  car_label: string
  customer_name: string
  phone: string
  line_id: string | null
  message: string
  status: "new" | "contacted" | "closed"
  created_at: string
}

export type InventoryMovement = {
  id: number
  car_id: number
  car_label: string
  event_type: "stock_received" | "stock_adjustment" | "sale" | "status_change" | "car_deleted"
  quantity_change: number
  stock_before: number
  stock_after: number
  sale_price: number | null
  note: string | null
  actor_id: string | null
  actor_email: string | null
  created_at: string
}

export type Banner = {
  id: number
  image_url: string
  created_at?: string
}

export type Car = {
  id: number
  brand: string
  model: string
  year: number | string
  price: number | string
  mileage: number | string
  description: string | null
  image_url: string
  stock: number
  status: string
  category_id: number | null
  created_at?: string
  phone?: string | null
  line?: string | null
  categories?: Pick<Category, "name"> | null
}
