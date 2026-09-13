import {
  Archive,
  Boxes,
  Check,
  Edit3,
  Grid2X2,
  List,
  PackagePlus,
  Star,
} from "lucide-react"

import Button from "../components/ui/Button"

import type { Product, ProductDraft, ProductStatus } from "./merchant-types"

import { statusLabels } from "./merchant-types"

export function MerchantMetrics({ products }: { products: Product[] }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Metric icon={<Boxes />} label="Total products" value={products.length} />
      <Metric
        icon={<Check />}
        label="Active"
        value={products.filter((product) => product.status === "ACTIVE").length}
      />
      <Metric
        icon={<PackagePlus />}
        label="Low stock"
        value={
          products.filter(
            (product) =>
              product.inventoryQuantity > 0 &&
              product.inventoryQuantity <= product.lowStockThreshold,
          ).length
        }
      />
      <Metric
        icon={<Archive />}
        label="Out of stock"
        value={
          products.filter(
            (product) =>
              product.status === "OUT_OF_STOCK" ||
              product.inventoryQuantity === 0,
          ).length
        }
      />
      <Metric
        icon={<Star />}
        label="Featured"
        value={products.filter((product) => product.featured).length}
      />
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
        {icon}
      </div>
      <p className="text-xs text-zinc-500">{label}</p>
      <strong className="mt-1 block text-2xl font-semibold text-zinc-100">
        {value}
      </strong>
    </div>
  )
}

export function ProductTable({
  products,
  onEdit,
  onArchive,
}: {
  products: Product[]
  onEdit: (product: ProductDraft) => void
  onArchive: (product: Product) => Promise<void>
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
            <th className="px-5 py-3">Product</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-zinc-800/60 text-zinc-400 last:border-0 hover:bg-zinc-800/30"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <ProductThumb product={product} />
                  <div>
                    <p className="font-medium text-zinc-200">{product.name}</p>
                    <p className="text-xs text-zinc-600">{product.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
              <td className="px-4 py-3">{formatZar(product.priceMinor)}</td>
              <td
                className={`px-4 py-3 ${
                  product.inventoryQuantity <= product.lowStockThreshold
                    ? "font-medium text-amber-400"
                    : ""
                }`}
              >
                {product.inventoryQuantity}
              </td>
              <td className="px-4 py-3">
                <Status status={product.status} />
              </td>
              <td className="px-4 py-3 text-xs">
                {new Date(product.updatedAt).toLocaleDateString("en-ZA")}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void onArchive(product)}
                    className="rounded p-1.5 text-zinc-500 hover:bg-red-950/40 hover:text-red-300"
                    aria-label={`Archive ${product.name}`}
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProductGrid({
  products,
  onEdit,
}: {
  products: Product[]
  onEdit: (product: ProductDraft) => void
}) {
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950"
        >
          <div className="flex h-36 items-center justify-center bg-zinc-900 text-zinc-600">
            <ProductThumb product={product} large />
          </div>
          <div className="p-4">
            <Status status={product.status} />
            <h3 className="mt-3 font-medium text-zinc-100">{product.name}</h3>
            <p className="mt-1 text-xs text-zinc-500">{product.category}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <strong className="text-zinc-200">
                {formatZar(product.priceMinor)}
              </strong>
              <span className="text-zinc-500">
                {product.inventoryQuantity} in stock
              </span>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => onEdit(product)}
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit product
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}

function ProductThumb({
  product,
  large = false,
}: {
  product: Product
  large?: boolean
}) {
  const image = product.thumbnail || product.images[0]?.url

  return image ? (
    <img
      src={image}
      alt=""
      className={`${
        large ? "h-full w-full" : "h-10 w-10"
      } rounded-md object-cover`}
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-800">
      <PackagePlus className="h-4 w-4" />
    </div>
  )
}

function Status({ status }: { status: ProductStatus }) {
  const colors =
    status === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-300"
      : status === "DRAFT"
        ? "bg-amber-500/10 text-amber-300"
        : status === "OUT_OF_STOCK"
          ? "bg-red-500/10 text-red-300"
          : "bg-zinc-800 text-zinc-400"

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${colors}`}
    >
      {statusLabels[status]}
    </span>
  )
}

export function formatZar(minor: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(minor / 100)
}
