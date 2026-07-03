"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export interface CartItem {
  id: string; // packageId, same identity in guest + DB carts
  packageId: string;
  title: string;
  price: number;
  image: string;
  currency: string;
  quantity: number;
  subtitle?: string;
  type?: string;
}

type AddItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemInput) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: string) => boolean;
  isAuthenticated: boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const GUEST_CART_KEY = "guest-cart-v1";

function normalizeItem(
  item: Partial<CartItem> & { id?: string; packageId?: string },
  quantity = 1
): CartItem {
  const packageId = item.packageId ?? item.id ?? "";
  return {
    id: packageId,
    packageId,
    title: item.title ?? "",
    price: item.price ?? 0,
    image: item.image ?? "/placeholder.png",
    currency: item.currency ?? "ETB",
    quantity,
    subtitle: item.subtitle,
    type: item.type,
  };
}

function upsertLocal(items: CartItem[], incoming: CartItem, mergeQty = true) {
  const existing = items.find((x) => x.id === incoming.id);
  if (!existing) return [...items, incoming];

  return items.map((x) =>
    x.id === incoming.id
      ? {
        ...x,
        quantity: mergeQty ? x.quantity + incoming.quantity : incoming.quantity,
        title: incoming.title || x.title,
        price: incoming.price || x.price,
        image: incoming.image || x.image,
        currency: incoming.currency || x.currency,
        subtitle: incoming.subtitle ?? x.subtitle,
        type: incoming.type ?? x.type,
      }
      : x
  );
}

// ---------- API helpers with credentials ----------
async function apiGetCart(): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    method: "GET",
    credentials: "include", // ✅ send session cookie
  });
  if (!res.ok) throw new Error("Failed to load cart");
  const data = await res.json();
  return data.items as CartItem[];
}

async function apiUpsertItem(item: AddItemInput): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅
    body: JSON.stringify({
      action: "upsert",
      item: normalizeItem(item, item.quantity ?? 1),
    }),
  });
  if (!res.ok) throw new Error("Failed to update cart");
  const data = await res.json();
  return data.items as CartItem[];
}

async function apiSetQuantity(packageId: string, quantity: number): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅
    body: JSON.stringify({ packageId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
  const data = await res.json();
  return data.items as CartItem[];
}

async function apiRemoveItem(packageId: string): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅
    body: JSON.stringify({ packageId }),
  });
  if (!res.ok) throw new Error("Failed to remove item");
  const data = await res.json();
  return data.items as CartItem[];
}

async function apiClearCart(): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  const data = await res.json();
  return data.items as CartItem[];
}

async function apiMergeGuestCart(items: CartItem[]): Promise<CartItem[]> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅
    body: JSON.stringify({
      action: "merge",
      items,
    }),
  });
  if (!res.ok) throw new Error("Failed to merge guest cart");
  const data = await res.json();
  return data.items as CartItem[];
}

// ---------- Provider ----------
export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const isAuthenticated = !!session?.user?.id;

  const [hydrated, setHydrated] = useState(false);
  const [guestItems, setGuestItems] = useState<CartItem[]>([]);
  const [serverItems, setServerItems] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const guestRef = useRef<CartItem[]>([]);
  const serverRef = useRef<CartItem[]>([]);
  const prevUserIdRef = useRef<string | null>(null);

  // ----- load guest cart from localStorage -----
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        setGuestItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setGuestItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  // ----- persist guest cart to localStorage -----
  useEffect(() => {
    guestRef.current = guestItems;
    if (hydrated && !isAuthenticated) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
    }
  }, [guestItems, hydrated, isAuthenticated]);

  useEffect(() => {
    serverRef.current = serverItems;
  }, [serverItems]);

  // ----- sync guest ↔ server on auth change -----
  useEffect(() => {
    if (!hydrated || sessionLoading) return;

    const currentUserId = session?.user?.id ?? null;
    const previousUserId = prevUserIdRef.current;
    if (previousUserId === currentUserId) return;

    const run = async () => {
      setIsSyncing(true);
      try {
        if (currentUserId) {
          // User logged in → merge guest cart if any, else fetch server cart
          const guestSnapshot = guestRef.current;
          if (guestSnapshot.length) {
            const merged = await apiMergeGuestCart(guestSnapshot);
            setServerItems(merged);
            setGuestItems([]);
            localStorage.removeItem(GUEST_CART_KEY);
            toast.success("Guest cart merged successfully");
          } else {
            const fresh = await apiGetCart();
            setServerItems(fresh);
          }
        } else {
          // User logged out → store server cart as guest
          if (previousUserId) {
            const currentServerCart = serverRef.current;
            setGuestItems(currentServerCart);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(currentServerCart));
          }
          setServerItems([]);
        }
      } catch (error) {
        console.error("Cart sync error:", error);
        toast.error("Failed to sync cart. Please refresh.");
      } finally {
        setIsSyncing(false);
        prevUserIdRef.current = currentUserId;
      }
    };

    run();
  }, [hydrated, sessionLoading, session?.user?.id]);

  // ----- derived items -----
  const items = isAuthenticated ? serverItems : guestItems;

  // ----- refresh server cart (used internally) -----
  const refreshServerCart = async () => {
    const fresh = await apiGetCart();
    setServerItems(fresh);
    return fresh;
  };

  // ----- addItem with error handling -----
  const addItem = async (item: AddItemInput) => {
    const quantity = item.quantity ?? 1;
    try {
      if (isAuthenticated) {
        const updated = await apiUpsertItem({ ...item, quantity });
        setServerItems(updated);
        toast.success(`Added ${item.title} to cart`);
      } else {
        const normalized = normalizeItem(item, quantity);
        setGuestItems((prev) => upsertLocal(prev, normalized, true));
        toast.success(`Added ${item.title} to cart`);
      }
    } catch (error) {
      console.error("addItem error:", error);
      toast.error("Failed to add item. Please try again.");
    }
  };

  // ----- removeItem with error handling -----
  const removeItem = async (id: string) => {
    try {
      if (isAuthenticated) {
        const updated = await apiRemoveItem(id);
        setServerItems(updated);
      } else {
        setGuestItems((prev) => prev.filter((item) => item.id !== id));
      }
      toast.info("Item removed from cart");
    } catch (error) {
      console.error("removeItem error:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  // ----- updateQuantity with error handling -----
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      if (isAuthenticated) {
        const updated = await apiSetQuantity(id, quantity);
        setServerItems(updated);
      } else {
        setGuestItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error("updateQuantity error:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  // ----- clearCart with error handling -----
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        const updated = await apiClearCart();
        setServerItems(updated);
      } else {
        setGuestItems([]);
        localStorage.removeItem(GUEST_CART_KEY);
      }
      toast.info("Cart cleared");
    } catch (error) {
      console.error("clearCart error:", error);
      toast.error("Failed to clear cart. Please try again.");
    }
  };

  // ----- memoised totals -----
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const isInCart = (id: string) => items.some((item) => item.id === id);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        isAuthenticated,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}