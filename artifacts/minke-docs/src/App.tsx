import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DocsLayout from "@/components/DocsLayout";
import DocPage from "@/pages/DocPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/introduction/what-is-minke" />
      </Route>
      <Route path="/admin" component={AdminPage} />
      <Route path="/:section/:page">
        {(params) => (
          <DocsLayout>
            <DocPage slug={`${params.section}/${params.page}`} />
          </DocsLayout>
        )}
      </Route>
      <Route path="/:page">
        {(params) => (
          <DocsLayout>
            <DocPage slug={params.page} />
          </DocsLayout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
