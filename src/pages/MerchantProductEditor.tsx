import { useRef, useState, type FormEvent, type ReactNode } from "react"

import { ImagePlus, Upload, X } from "lucide-react"

import Button from "../components/ui/Button"

import { apiUrl, readApiError } from "../lib/api"

import type { ProductDraft, ProductStatus } from "./merchant-types"

import { statusLabels } from "./merchant-types"

const editorControlClass =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/20 outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"

export default function MerchantProductEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: ProductDraft
  onClose: () => void
  onSave: (draft: ProductDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState<ProductDraft>(initial)

  const [saving, setSaving] = useState(false)

  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState("")

  const fileRef = useRef<HTMLInputElement>(null)

  const update = <K extends keyof ProductDraft,>(
    key: K,
    value: ProductDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }))

  const updateName = (name: string) =>
    setDraft((current) => ({
      ...current,
      name,
      slug: current.id
        ? current.slug
        : name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
    }))

  const uploadImage = async (file: File) => {
    setUploading(true)

    setError("")

    try {
      const response = await fetch(apiUrl("/products/upload-image"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: await readFile(file),
          contentType: file.type,
          alt: file.name,
        }),
      })

      if (!response.ok)
        throw new Error(await readApiError(response, "Unable to upload image."))

      const image = (await response.json()) as { url: string publicId?: string }

      update("thumbnail", image.url)

      update("images", [
        {
          url: image.url,
          publicId: image.publicId,
          alt: file.name,
          sortOrder: 0,
        },
      ])
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to upload image.",
      )
    } finally {
      setUploading(false)
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    setSaving(true)

    setError("")

    try {
      await onSave(draft)
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to save product.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <section className="mx-auto my-6 max-w-3xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <header className="flex items-start justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-400">
              Product studio
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-100">
              {draft.id ? "Edit product" : "Create product"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Build a complete, customer-ready listing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close"
          >
            <X />
          </button>
        </header>
        <form onSubmit={submit} className="space-y-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Product name" required>
              <input
                required
                autoFocus
                className={editorControlClass}
                value={draft.name}
                onChange={(event) => updateName(event.target.value)}
              />
            </Field>
            <Field label="SKU" required>
              <input
                required
                className={editorControlClass}
                value={draft.sku}
                onChange={(event) =>
                  update("sku", event.target.value.toUpperCase())
                }
              />
            </Field>
            <Field label="Category" required>
              <input
                required
                className={editorControlClass}
                value={draft.category}
                onChange={(event) => update("category", event.target.value)}
              />
            </Field>
            <Field label="Slug" required>
              <input
                required
                className={editorControlClass}
                value={draft.slug}
                onChange={(event) =>
                  update("slug", event.target.value.toLowerCase())
                }
              />
            </Field>
            <MoneyField
              label="Selling price (ZAR)"
              value={draft.priceMinor}
              required
              onChange={(value) => update("priceMinor", value)}
            />
            <MoneyField
              label="Compare-at price (ZAR)"
              value={draft.compareAtPriceMinor}
              placeholder="Optional original price"
              onChange={(value) => update("compareAtPriceMinor", value)}
            />
            <Field label="Stock quantity" required>
              <input
                required
                min="0"
                step="1"
                type="number"
                className={editorControlClass}
                value={draft.inventoryQuantity}
                onChange={(event) =>
                  update("inventoryQuantity", Number(event.target.value))
                }
              />
            </Field>
            <Field label="Low-stock threshold" required>
              <input
                required
                min="0"
                step="1"
                type="number"
                className={editorControlClass}
                value={draft.lowStockThreshold}
                onChange={(event) =>
                  update("lowStockThreshold", Number(event.target.value))
                }
              />
            </Field>
            <Field label="Product status" required>
              <select
                className={editorControlClass}
                value={draft.status}
                onChange={(event) =>
                  update("status", event.target.value as ProductStatus)
                }
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Short description">
            <input
              className={editorControlClass}
              value={draft.shortDescription}
              onChange={(event) =>
                update("shortDescription", event.target.value)
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${editorControlClass} resize-y`}
              rows={5}
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </Field>
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-400">
              Product image
            </p>
            {draft.thumbnail ? (
              <div className="flex items-center gap-4">
                <img
                  src={draft.thumbnail}
                  alt="Product preview"
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Replace image
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-28 w-full flex-col"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <Upload className="h-5 w-5 animate-pulse" />
                ) : (
                  <ImagePlus className="h-5 w-5" />
                )}
                <span>
                  {uploading ? "Uploading image..." : "Upload product image"}
                </span>
                <small className="text-xs text-zinc-500">
                  PNG, JPG, or WEBP
                </small>
              </Button>
            )}
            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void uploadImage(file)
              }}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => update("featured", event.target.checked)}
            />{" "}
            Featured product
          </label>
          {error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <footer className="flex justify-end gap-2 border-t border-zinc-800 pt-5">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || uploading}
            >
              {saving ? "Saving..." : "Save product"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  )
}

function MoneyField({
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: {
  label: string
  value: number | undefined
  placeholder?: string
  required?: boolean
  onChange: (value: number | undefined) => void
}) {
  return (
    <Field label={label} required={required}>
      <input
        className={editorControlClass}
        min="0"
        step="0.01"
        type="number"
        required={required}
        placeholder={placeholder}
        value={value === undefined ? "" : (value / 100).toFixed(2)}
        onChange={(event) =>
          onChange(
            event.target.value === ""
              ? undefined
              : Math.round(Number(event.target.value) * 100),
          )
        }
      />
    </Field>
  )
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-zinc-400">
      {label}
      {required && <span className="text-violet-400"> *</span>}
      {children}
    </label>
  )
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Could not read image."))
    reader.readAsDataURL(file)
  })
}
