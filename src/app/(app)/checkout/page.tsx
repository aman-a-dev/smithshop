"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Intro } from "@/components/shared/intro";
import { Skeleton } from '@/components/ui/skeleton'
//import { getUserCart } from '@/action/cart'
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
} from "@/components/ui/item"
export default function CheckOutPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const router = useRouter();
  //const allCarts = getUserCart(session.user.id)
  useEffect(() => {
    if (!session) {
      router.push("/auth");
    }
  });
  if (isSessionLoading) {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-40 w-[95%]" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <Intro
        heading="Checkout"
        paragraph="Fill in the required fields to get your top up"
        badge="checkout"
      />
      <div>
        {/*
          allCarts.map((cart, i) => {
            <Item>
              <ItemHeader>
                <ItemTitle></ItemTitle>
                <ItemDescription></ItemDescription>
                <ItemActions>Pay</ItemActions>
              </ItemHeader>
            </Item>
          })
        */}
      </div>
    </div>
  );
}
