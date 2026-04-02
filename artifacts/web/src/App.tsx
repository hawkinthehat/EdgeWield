import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Picks from "@/pages/picks";
import Scanner from "@/pages/scanner";
import Dashboard from "@/pages/dashboard";
import Pricing from "@/pages/pricing";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Home has its own nav/footer — no Layout wrapper */}
      <Route path="/" component={Home} />

      {/* All other pages use the shared Layout */}
      <Route path="/picks">
        <Layout><Picks /></Layout>
      </Route>
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/contact">
        <Layout><Contact /></Layout>
      </Route>
      <Route path="/scanner">
        <Layout><Scanner /></Layout>
      </Route>
      <Route path="/pricing">
        <Layout><Pricing /></Layout>
      </Route>
      {/* Dashboard has its own sidebar layout */}
      <Route path="/dashboard" component={Dashboard} />
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
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
