'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, PackagePlus, Trash2, Pencil } from 'lucide-react'

import {
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductWithRelations,
  type ProductOption,
} from '@/action/admin'
import { formatETB } from '@/utils/format'

const emptyForm = {
  id: '',
  productId: '',
  label: '',
  price: '',
  amount: '',
  level: '',
  diamonds: '',
  membershipName: '',
  duration: '',
}

type FormState = typeof emptyForm

function toNumberOrUndefined(v: string): number | undefined {
  if (v.trim() === '') return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}

export function ProductTable({
  initialPackages,
  productOptions,
}: {
  initialPackages: ProductWithRelations[]
  productOptions: ProductOption[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const isEditing = Boolean(form.id)

  function openCreate() {
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(pkg: ProductWithRelations) {
    setForm({
      id: pkg.id,
      productId: pkg.productId,
      label: pkg.label,
      price: String(pkg.price),
      amount: pkg.amount?.toString() ?? '',
      level: pkg.level?.toString() ?? '',
      diamonds: pkg.diamonds?.toString() ?? '',
      membershipName: pkg.membershipName ?? '',
      duration: pkg.duration ?? '',
    })
    setDialogOpen(true)
  }

  function handleSave() {
    const payload = {
      productId: form.productId,
      label: form.label,
      price: toNumberOrUndefined(form.price) ?? 0,
      amount: toNumberOrUndefined(form.amount),
      level: toNumberOrUndefined(form.level),
      diamonds: toNumberOrUndefined(form.diamonds),
      membershipName: form.membershipName || undefined,
      duration: form.duration || undefined,
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct({ id: form.id, ...payload })
        : await createProduct(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(isEditing ? 'Package updated' : 'Package created')
      setDialogOpen(false)
      router.refresh()
    })
  }

  function handleToggleActive(pkg: ProductWithRelations) {
    startTransition(async () => {
      const result = await updateProduct({ id: pkg.id, isActive: !pkg.isActive })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  function handleDelete(pkg: ProductWithRelations) {
    startTransition(async () => {
      const result = await deleteProduct(pkg.id)
      if (!result.success) {
        // Most likely cause: package is referenced by existing orders (onDelete: Restrict)
        toast.error(result.error || 'Could not delete — try deactivating instead')
        return
      }
      toast.success('Package deleted')
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <PackagePlus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit package' : 'Add package'}</DialogTitle>
              <DialogDescription>
                A package is a purchasable variant of a product (e.g. "110 Diamonds").
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Product</Label>
                <Select
                  value={form.productId}
                  onValueChange={v => setForm({ ...form, productId: v })}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.category.name} — {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="e.g. 110 Diamonds"
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (ETB)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="optional"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>

              {/* Level-up and membership/premium fields — only relevant for
                  those product types, but harmless to leave visible & optional. */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    type="number"
                    placeholder="optional"
                    value={form.level}
                    onChange={e => setForm({ ...form, level: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="diamonds">Diamonds used</Label>
                  <Input
                    id="diamonds"
                    type="number"
                    placeholder="optional"
                    value={form.diamonds}
                    onChange={e => setForm({ ...form, diamonds: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="membershipName">Membership name</Label>
                  <Input
                    id="membershipName"
                    placeholder="optional"
                    value={form.membershipName}
                    onChange={e => setForm({ ...form, membershipName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="optional"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSave} disabled={isPending || !form.productId || !form.label}>
                {isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Create package'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialPackages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No packages yet — run your seed script or add one above.
                  </TableCell>
                </TableRow>
              )}
              {initialPackages.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">
                    {pkg.product.category.name} — {pkg.product.name}
                  </TableCell>
                  <TableCell>{pkg.label}</TableCell>
                  <TableCell>{formatETB(pkg.price)}</TableCell>
                  <TableCell>
                    <Switch checked={pkg.isActive} onCheckedChange={() => handleToggleActive(pkg)} disabled={isPending} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(pkg)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={e => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{pkg.label}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                If this package has existing orders, deletion will fail — use the Active toggle to
                                hide it from the storefront instead.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(pkg)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
