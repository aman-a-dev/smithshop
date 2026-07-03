'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Intro } from '@/components/shared/intro';
import { Skeleton } from '@/components/ui/skeleton';
import { getCheckoutCart, createOrderAndPayment } from '@/action/checkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
} from '@/components/ui/item';

type CartItemWithDetails = Awaited<ReturnType<typeof getCheckoutCart>>[0];

export default function CheckOutPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetId, setTargetId] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push('/auth');
    }
  }, [session, isSessionLoading, router]);

  // Fetch cart items
  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchCart = async () => {
      try {
        const items = await getCheckoutCart(session.user.id);
        setCartItems(items);
      } catch (err) {
        setError('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [session]);

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) {
      setError('Please enter your game ID / username.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('targetId', targetId.trim());
      // Optional note
      // formData.append('targetNote', ...);
      const { checkoutUrl } = await createOrderAndPayment(formData);
      // Redirect to Chapa checkout
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed.');
      setSubmitting(false);
    }
  };

  // Loading states
  if (isSessionLoading || loading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  // No session (should have redirected)
  if (!session) return null;

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div>
        <Intro
          heading="Checkout"
          paragraph="Your cart is empty. Add some items first."
          badge="checkout"
        />
        <div className="flex justify-center mt-8">
          <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.package.price,
    0
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Intro
        heading="Checkout"
        paragraph="Fill in the required fields to get your top‑up"
        badge="checkout"
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Cart items list */}
        <div className="space-y-4">
          {cartItems.map((item) => {
            const pkg = item.package;
            const product = pkg.product;
            const subtotal = item.quantity * pkg.price;
            return (
              <Item key={item.id} className="border rounded-lg p-4">
                <ItemHeader>
                  <ItemTitle>{product.name}</ItemTitle>
                  <ItemDescription>
                    {pkg.label} &middot; {product.category.name}
                  </ItemDescription>
                </ItemHeader>
                <ItemContent>
                  <div className="flex justify-between text-sm">
                    <span>Quantity: {item.quantity}</span>
                    <span>ETB {pkg.price} each</span>
                  </div>
                  <div className="text-right font-semibold">
                    Subtotal: ETB {subtotal}
                  </div>
                </ItemContent>
              </Item>
            );
          })}
          <div className="text-right text-xl font-bold border-t pt-4">
            Total: ETB {total}
          </div>
        </div>

        {/* Target ID input */}
        <div className="space-y-2">
          <Label htmlFor="targetId">
            Game ID / Username
            <span className="text-muted-foreground text-sm ml-2">
              (for all items above)
            </span>
          </Label>
          <Input
            id="targetId"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="e.g. 123456789, PlayerName"
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter the ID or username of the account you want to top up.
          </p>
        </div>

        {/* Error display */}
        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}

        {/* Pay button */}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Processing...' : `Pay ETB ${total} with Chapa`}
        </Button>
      </form>
    </div>
  );
}