// app/order/success/page.tsx

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  Receipt,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function OrderSuccessPage() {
  const order: { id: string, email: string, total: string, payment: string, delivery: string } = {
    id: "#SM-20260702-1827",
    email: "customer@example.com",
    total: "$49.99",
    payment: "Paid",
    delivery: "Instant",
  };

  return (
    <main className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="mb-4 h-20 w-20 text-green-500" />

          <CardTitle className="text-3xl">
            Payment Successful 🎉
          </CardTitle>

          <CardDescription className="max-w-md">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <span>Order ID</span>
              </div>

              <span className="font-medium">
                {order.id}
              </span>
            </div>

            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span>Status</span>
              </div>

              <span className="rounded bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                {order.payment}
              </span>
            </div>

            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>Email</span>
              </div>

              <span>{order.email}</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <span>Delivery</span>

              <span className="font-medium">
                {order.delivery}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent. If your purchase contains
              digital items, they will appear in your account shortly.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/orders">
              <Button className="flex-1">
                View Order
              </Button>
            </Link>

            <Link href="/products">
              <Button

                variant="outline"
                className="flex-1"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}