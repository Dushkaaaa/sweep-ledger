"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getWorkspaceRoute } from "../_i18n/route-utils";

export function LandingSessionCheck({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session?.user) {
        router.replace(getWorkspaceRoute(session.user.id));
      }
    }

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return <>{children}</>;
}