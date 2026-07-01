"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Intro } from "@/components/shared/intro";
import { Skeleton } from '@/components/ui/skeleton'

export default function CheckOutPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const router = useRouter();
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
      <div></div>
    </div>
  );
}
