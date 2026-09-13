import { useEffect, useMemo, useState } from "react"

import { Plus, Search, Grid2X2, List, PackagePlus } from "lucide-react"

import Button from "../components/ui/Button"

import { apiUrl, readApiError } from "../lib/api"

import { useData } from "../context/DataContext"

import MerchantProductEditor from "./MerchantProductEditor"

import { MerchantMetrics, ProductGrid, ProductTable } from "./MerchantCatalog"

import {
  blankProduct,
  statusLabels,
  type Product,
  type ProductDraft,
  type ProductStatus,
} from "./merchant-types"

export default function Merchant() {
  const { profile, isLoading: sessionLoading, error: sessionError } = useData()

  const [products, setProducts] = useState<Product[]>([])

  const [editing, setEditing] = useState<ProductDraft | null>(null)

  const [query, setQuery] = useState("")

  const [status, setStatus] = useState<ProductStatus | "ALL">("ALL")

  const [view, setView] = useState<"table" | "grid">("table")

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const loadProducts = async () => {
    setLoading(true)

    setError("")

    try {
      const response = await fetch(apiUrl("/products/admin"), {
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok)
        throw new Error(
          await readApiError(response, "Unable to load merchant products."),
        )

      const data = (await response.json()) as { products?: Product[] }

      setProducts(data.products || [])
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to load merchant products.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) void loadProducts()
  }, [profile])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        `${product.name} ${product.sku} ${product.category}`
          .toLowerCase()
          .includes(normalized)

      return matchesQuery && (status === "ALL" || product.status === status)
    })
  }, [products, query, status])

  const saveProduct = async (draft: ProductDraft) => {
    const response = await fetch(
      apiUrl(draft.id ? `/products/${draft.id}` : "/products"),
      {
        method: draft.id ? "PUT" : "POST",

        credentials: "include",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(draft),
      },
    )

    if (!response.ok)
      throw new Error(await readApiError(response, "Unable to save product."))

    setEditing(null)

    await loadProducts()
  }

  const archiveProduct = async (product: Product) => {
    if (!window.confirm(`Archive ${product.name}?`)) return

    const response = await fetch(apiUrl(`/products/${product.id}`), {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      setError(await readApiError(response, "Unable to archive product."))

      return
    }

    await loadProducts()
  }

  if (sessionLoading)
    return (
      <div className="px-6 py-8 text-sm text-zinc-500">
        Loading merchant workspace...
      </div>
    )

  if (sessionError || !profile)
    return (
      <div className="px-6 py-8">
        <div className="max-w-xl rounded-xl border border-red-900/50 bg-red-950/30 p-5">
          <h1 className="text-base font-semibold text-red-200">
            Merchant access required
          </h1>
          <p className="mt-2 text-sm text-red-300/80">
            {sessionError ||
              "Sign in with an administrator account to manage products."}
          </p>
        </div>
      </div>
    )

  return (
    <div className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Products
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Create, organize, and keep your store inventory up to date.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setEditing({ ...blankProduct })}
          >
            <Plus className="h-4 w-4" /> Add product
          </Button>
        </header>
        <MerchantMetrics products={products} />
        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80">
          <CatalogHeader
            count={filtered.length}
            query={query}
            status={status}
            view={view}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onViewChange={setView}
          />
          {error && (
            <p className="border-b border-red-900/50 bg-red-950/20 px-5 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-zinc-500">
              Loading products...
            </div>
          ) : filtered.length === 0 ? (
            <EmptyCatalog />
          ) : view === "table" ? (
            <ProductTable
              products={filtered}
              onEdit={setEditing}
              onArchive={archiveProduct}
            />
          ) : (
            <ProductGrid products={filtered} onEdit={setEditing} />
          )}
        </section>
      </div>
      {editing && (
        <MerchantProductEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  )
}

function CatalogHeader({
  count,
  query,
  status,
  view,
  onQueryChange,
  onStatusChange,
  onViewChange,
}: {
  count: number
  query: string
  status: ProductStatus | "ALL"
  view: "table" | "grid"
  onQueryChange: (value: string) => void
  onStatusChange: (value: ProductStatus | "ALL") => void
  onViewChange: (value: "table" | "grid") => void
}) {
  return (
    <>
      <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">All products</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Manage what customers see, buy, and receive.
          </p>
        </div>
        <span className="text-xs text-zinc-500">{count} shown</span>
      </div>
      <div className="flex flex-col gap-2.5 border-b border-zinc-800 px-5 py-4 sm:flex-row">
        <label className="flex h-9 max-w-md flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3">
          <Search className="h-3.5 w-3.5 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search name, SKU, or category"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
          />
        </label>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ProductStatus | "ALL")
          }
          className="h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
        >
          <option value="ALL">All statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          <button
            onClick={() => onViewChange("table")}
            className={`rounded-md p-1.5 ${
              view === "table" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
            }`}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange("grid")}
            className={`rounded-md p-1.5 ${
              view === "grid" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
            }`}
            aria-label="Grid view"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyCatalog() {
  return (
    <div className="px-5 py-16 text-center">
      <PackagePlus className="mx-auto h-7 w-7 text-zinc-600" />
      <p className="mt-3 text-sm text-zinc-400">
        No products match your filters.
      </p>
    </div>
  )
}
