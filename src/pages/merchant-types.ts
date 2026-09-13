export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK"

export type ProductImage = {
  url: string

  publicId?: string

  alt: string

  sortOrder: number
}

export type Product = {
  id: string

  name: string

  slug: string

  sku: string

  category: string

  priceMinor: number

  compareAtPriceMinor?: number

  currency: "ZAR"

  inventoryQuantity: number

  lowStockThreshold: number

  status: ProductStatus

  featured: boolean

  shortDescription: string

  description: string

  images: ProductImage[]

  thumbnail?: string

  updatedAt: string
}

export type ProductDraft = Omit<Product, "id" | "updatedAt" | "currency"> & {
  id?: string

  currency?: "ZAR"
}

export const blankProduct: ProductDraft = {
  name: "",

  slug: "",

  sku: "",

  category: "Desk Accessories",

  priceMinor: 0,

  inventoryQuantity: 0,

  lowStockThreshold: 5,

  status: "ACTIVE",

  featured: false,

  shortDescription: "",

  description: "",

  images: [],
}

export const statusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Active",

  DRAFT: "Draft",

  ARCHIVED: "Archived",

  OUT_OF_STOCK: "Out of stock",
}
