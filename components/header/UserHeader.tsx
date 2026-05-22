"use client";

import { UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Loader2 className="size-8 animate-spin text-blue-200" />
    );
  }

  return <UserButton />;
}