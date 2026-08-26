import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RequireUserType } from "@/components/auth/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthProvider, INSTITUTION_TYPES } from "@/hooks/useAuth";
import Challenges from "@/pages/Challenges";
import Home from "@/pages/Home";
import InstitutionPortal from "@/pages/InstitutionPortal";
import NotFound from "@/pages/NotFound";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import SubmitChallenge from "@/pages/SubmitChallenge";

// Recharts adds ~400 kB, and this route is admin-only (RequireUserType
// below) — almost no visitor ever needs it, same reasoning as ChallengeMap's
// lazy load in Challenges.tsx.
const Dashboard = lazy(() => import("@/pages/Dashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />

              {/* /submit renders its own inline sign-in rather than bouncing the
                  citizen away mid-thought, so it is not wrapped in RequireAuth. */}
              <Route path="submit" element={<SubmitChallenge />} />

              {/* Guards are UX only — RLS is the real boundary. See RequireAuth.tsx. */}
              <Route element={<RequireUserType allow={INSTITUTION_TYPES} />}>
                <Route path="institutions" element={<InstitutionPortal />} />
              </Route>

              {/* contracts.md: Task 7 is government-facing (Department of
                  Higher & Technical Education officials), not "any signed-in
                  user" — admin-only. */}
              <Route element={<RequireUserType allow={["admin"]} />}>
                <Route
                  path="dashboard"
                  element={
                    <Suspense fallback={<Skeleton className="h-96 w-full rounded-none" />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
