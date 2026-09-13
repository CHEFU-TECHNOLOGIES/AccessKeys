import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  Boxes,
  Check,
  Edit3,
  Grid2X2,
  ImagePlus,
  List,
  PackagePlus,
  Plus,
  Search,
  Star,
  Upload,
  X,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { apiUrl, readApiError } from '../lib/api';
import { useData } from '../context/DataContext';

 type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'OUT_OF_STOCK';
 type ProductImage = { url: string; publicId?: string; alt: string; sortOrder: number };
 type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  priceMinor: number;
  compareAtPriceMinor?: number;
  currency: 'ZAR';
  inventoryQuantity: number;
  lowStockThreshold: number;
  status: ProductStatus;
  featured: boolean;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  thumbnail?: string;
  updatedAt: string;
 };

type ProductDraft = Omit<Product, 'id' | 'updatedAt' | 'currency'> & { id?: string; currency?: 'ZAR' };

const blankProduct: ProductDraft = {
  name: '', slug: '', sku: '', category: 'Desk Accessories', priceMinor: 0,
  inventoryQuantity: 0, lowStockThreshold: 5, status: 'ACTIVE', featured: false,
  shortDescription: '', description: '', images: [],
};
const statusLabels: Record<ProductStatus, string> = {
  ACTIVE: 'Active', DRAFT: 'Draft', ARCHIVED: 'Archived', OUT_OF_STOCK: 'Out of stock',
};

export default function Merchant() {
  const { profile, isLoading: sessionLoading, error: sessionError } = useData();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<ProductDraft | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ProductStatus | 'ALL'>('ALL');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(apiUrl('/products/admin'), { credentials: 'include', cache: 'no-store' });
      if (!response.ok) throw new Error(await readApiError(response, 'Unable to load merchant products.'));
      const data = (await response.json()) as { products?: Product[] };
      setProducts(data.products || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load merchant products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) void loadProducts();
  }, [profile]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter(product => {
      const matchesQuery = !normalized || `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(normalized);
      return matchesQuery && (status === 'ALL' || product.status === status);
    });
  }, [products, query, status]);

  const saveProduct = async (draft: ProductDraft) => {
    const response = await fetch(apiUrl(draft.id ? `/products/${draft.id}` : '/products'), {
      method: draft.id ? 'PUT' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (!response.ok) throw new Error(await readApiError(response, 'Unable to save product.'));
    setEditing(null);
    await loadProducts();
  };

  const archiveProduct = async (product: Product) => {
    if (!window.confirm(`Archive ${product.name}?`)) return;
    const response = await fetch(apiUrl(`/products/${product.id}`), { method: 'DELETE', credentials: 'include' });
    if (!response.ok) {
      setError(await readApiError(response, 'Unable to archive product.'));
      return;
    }
    await loadProducts();
  };

  if (sessionLoading) return <div className="px-6 py-8 text-sm text-zinc-500">Loading merchant workspace...</div>;
  if (sessionError || !profile) return <div className="px-6 py-8"><div className="max-w-xl rounded-xl border border-red-900/50 bg-red-950/30 p-5"><h1 className="text-base font-semibold text-red-200">Merchant access required</h1><p className="mt-2 text-sm text-red-300/80">{sessionError || 'Sign in with an administrator account to manage products.'}</p></div></div>;

  return <div className="px-6 py-8 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-400">Merchant workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">Products</h1><p className="mt-1 text-sm text-zinc-500">Create, organize, and keep your store inventory up to date.</p></div>
        <Button variant="primary" size="lg" onClick={() => setEditing({ ...blankProduct })}><Plus className="h-4 w-4" /> Add product</Button>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric icon={<Boxes />} label="Total products" value={products.length} />
        <Metric icon={<Check />} label="Active" value={products.filter(product => product.status === 'ACTIVE').length} />
        <Metric icon={<PackagePlus />} label="Low stock" value={products.filter(product => product.inventoryQuantity > 0 && product.inventoryQuantity <= product.lowStockThreshold).length} />
        <Metric icon={<Archive />} label="Out of stock" value={products.filter(product => product.status === 'OUT_OF_STOCK' || product.inventoryQuantity === 0).length} />
        <Metric icon={<Star />} label="Featured" value={products.filter(product => product.featured).length} />
      </div>
      <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80">
        <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-zinc-100">All products</h2><p className="mt-1 text-xs text-zinc-500">Manage what customers see, buy, and receive.</p></div><span className="text-xs text-zinc-500">{filtered.length} shown</span></div>
        <div className="flex flex-col gap-2.5 border-b border-zinc-800 px-5 py-4 sm:flex-row"><label className="flex h-9 max-w-md flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3"><Search className="h-3.5 w-3.5 text-zinc-500" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, SKU, or category" className="min-w-0 flex-1 bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600" /></label><select value={status} onChange={event => setStatus(event.target.value as ProductStatus | 'ALL')} className="h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"><option value="ALL">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5"><button onClick={() => setView('table')} className={`rounded-md p-1.5 ${view === 'table' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'}`} aria-label="Table view"><List className="h-4 w-4" /></button><button onClick={() => setView('grid')} className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'}`} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button></div></div>
        {error && <p className="border-b border-red-900/50 bg-red-950/20 px-5 py-3 text-sm text-red-300">{error}</p>}
        {loading ? <div className="px-5 py-16 text-center text-sm text-zinc-500">Loading products...</div> : filtered.length === 0 ? <div className="px-5 py-16 text-center"><PackagePlus className="mx-auto h-7 w-7 text-zinc-600" /><p className="mt-3 text-sm text-zinc-400">No products match your filters.</p></div> : view === 'table' ? <ProductTable products={filtered} onEdit={setEditing} onArchive={archiveProduct} /> : <ProductGrid products={filtered} onEdit={setEditing} />}
      </section>
    </div>
    {editing && <ProductEditor initial={editing} onClose={() => setEditing(null)} onSave={saveProduct} />}
  </div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4"><div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">{icon}</div><p className="text-xs text-zinc-500">{label}</p><strong className="mt-1 block text-2xl font-semibold text-zinc-100">{value}</strong></div>; }
function ProductTable({ products, onEdit, onArchive }: { products: Product[]; onEdit: (product: ProductDraft) => void; onArchive: (product: Product) => Promise<void> }) { return <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500"><th className="px-5 py-3">Product</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th /></tr></thead><tbody>{products.map(product => <tr key={product.id} className="border-b border-zinc-800/60 text-zinc-400 last:border-0 hover:bg-zinc-800/30"><td className="px-5 py-3"><div className="flex items-center gap-3"><ProductThumb product={product} /><div><p className="font-medium text-zinc-200">{product.name}</p><p className="text-xs text-zinc-600">{product.category}</p></div></div></td><td className="px-4 py-3 font-mono text-xs">{product.sku}</td><td className="px-4 py-3">{formatZar(product.priceMinor)}</td><td className={`px-4 py-3 ${product.inventoryQuantity <= product.lowStockThreshold ? 'font-medium text-amber-400' : ''}`}>{product.inventoryQuantity}</td><td className="px-4 py-3"><Status status={product.status} /></td><td className="px-4 py-3 text-xs">{new Date(product.updatedAt).toLocaleDateString('en-ZA')}</td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => onEdit(product)} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200" aria-label={`Edit ${product.name}`}><Edit3 className="h-4 w-4" /></button><button onClick={() => void onArchive(product)} className="rounded p-1.5 text-zinc-500 hover:bg-red-950/40 hover:text-red-300" aria-label={`Archive ${product.name}`}><Archive className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>; }
function ProductGrid({ products, onEdit }: { products: Product[]; onEdit: (product: ProductDraft) => void }) { return <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">{products.map(product => <article key={product.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950"><div className="flex h-36 items-center justify-center bg-zinc-900 text-zinc-600"><ProductThumb product={product} large /></div><div className="p-4"><Status status={product.status} /><h3 className="mt-3 font-medium text-zinc-100">{product.name}</h3><p className="mt-1 text-xs text-zinc-500">{product.category}</p><div className="mt-4 flex items-center justify-between text-xs"><strong className="text-zinc-200">{formatZar(product.priceMinor)}</strong><span className="text-zinc-500">{product.inventoryQuantity} in stock</span></div><Button variant="outline" className="mt-4 w-full" onClick={() => onEdit(product)}><Edit3 className="h-3.5 w-3.5" /> Edit product</Button></div></article>)}</div>; }
function ProductThumb({ product, large = false }: { product: Product; large?: boolean }) { const image = product.thumbnail || product.images[0]?.url; return image ? <img src={image} alt="" className={`${large ? 'h-full w-full' : 'h-10 w-10'} rounded-md object-cover`} /> : <div className={`${large ? 'h-10 w-10' : 'h-10 w-10'} flex items-center justify-center rounded-md bg-zinc-800`}><PackagePlus className="h-4 w-4" /></div>; }
function Status({ status }: { status: ProductStatus }) { return <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-300' : status === 'DRAFT' ? 'bg-amber-500/10 text-amber-300' : status === 'OUT_OF_STOCK' ? 'bg-red-500/10 text-red-300' : 'bg-zinc-800 text-zinc-400'}`}>{statusLabels[status]}</span>; }
function formatZar(minor: number) { return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(minor / 100); }

function ProductEditor({ initial, onClose, onSave }: { initial: ProductDraft; onClose: () => void; onSave: (draft: ProductDraft) => Promise<void> }) {
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft(current => ({ ...current, [key]: value }));
  const updateName = (name: string) => update('name', name) || update('slug', draft.id ? draft.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  const uploadImage = async (file: File) => {
    setUploading(true); setError('');
    try {
      const imageBase64 = await readFile(file);
      const response = await fetch(apiUrl('/products/upload-image'), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64, contentType: file.type, alt: file.name }) });
      if (!response.ok) throw new Error(await readApiError(response, 'Unable to upload image.'));
      const image = (await response.json()) as { url: string; publicId?: string };
      update('thumbnail', image.url); update('images', [{ url: image.url, publicId: image.publicId, alt: file.name, sortOrder: 0 }]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to upload image.'); } finally { setUploading(false); }
  };
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setError(''); try { await onSave(draft); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save product.'); } finally { setSaving(false); } };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"><section className="mx-auto my-6 max-w-3xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl"><header className="flex items-start justify-between border-b border-zinc-800 px-6 py-5"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-400">Product studio</p><h2 className="mt-1 text-lg font-semibold text-zinc-100">{draft.id ? 'Edit product' : 'Create product'}</h2><p className="mt-1 text-sm text-zinc-500">Build a complete, customer-ready listing.</p></div><button onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200" aria-label="Close"><X /></button></header><form onSubmit={submit} className="space-y-6 p-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Product name" required><input required autoFocus value={draft.name} onChange={event => updateName(event.target.value)} /></Field><Field label="SKU" required><input required value={draft.sku} onChange={event => update('sku', event.target.value.toUpperCase())} /></Field><Field label="Category" required><input required value={draft.category} onChange={event => update('category', event.target.value)} /></Field><Field label="Slug" required><input required value={draft.slug} onChange={event => update('slug', event.target.value.toLowerCase())} /></Field><Field label="Selling price (ZAR)" required><input required min="0" step="0.01" type="number" value={(draft.priceMinor / 100).toFixed(2)} onChange={event => update('priceMinor', Math.round(Number(event.target.value || 0) * 100))} /></Field><Field label="Stock quantity" required><input required min="0" step="1" type="number" value={draft.inventoryQuantity} onChange={event => update('inventoryQuantity', Number(event.target.value))} /></Field><Field label="Low-stock threshold" required><input required min="0" step="1" type="number" value={draft.lowStockThreshold} onChange={event => update('lowStockThreshold', Number(event.target.value))} /></Field><Field label="Product status" required><select value={draft.status} onChange={event => update('status', event.target.value as ProductStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field></div><Field label="Short description"><input value={draft.shortDescription} onChange={event => update('shortDescription', event.target.value)} /></Field><Field label="Description"><textarea rows={5} value={draft.description} onChange={event => update('description', event.target.value)} /></Field><div><p className="mb-2 text-xs font-medium text-zinc-400">Product image</p>{draft.thumbnail ? <div className="flex items-center gap-4"><img src={draft.thumbnail} alt="Product preview" className="h-24 w-24 rounded-lg object-cover" /><Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Replace image</Button></div> : <Button type="button" variant="outline" className="h-28 w-full flex-col" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? <Upload className="h-5 w-5 animate-pulse" /> : <ImagePlus className="h-5 w-5" />}<span>{uploading ? 'Uploading image...' : 'Upload product image'}</span><small className="text-xs text-zinc-500">PNG, JPG, or WEBP</small></Button>}<input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} /></div><label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={draft.featured} onChange={event => update('featured', event.target.checked)} /> Featured product</label>{error && <p className="rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}<footer className="flex justify-end gap-2 border-t border-zinc-800 pt-5"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" disabled={saving || uploading}>{saving ? 'Saving...' : 'Save product'}</Button></footer></form></section></div>;
}
function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="grid gap-1.5 text-xs font-medium text-zinc-400">{label}{required && <span className="text-violet-400"> *</span>}{children}</label>; }
function readFile(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read image.')); reader.readAsDataURL(file); }); }
