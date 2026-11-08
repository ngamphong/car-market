export type Category = {
  id: number
  name: string
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
  phone?: string | null
  line?: string | null
  categories?: Pick<Category, "name"> | null
}
