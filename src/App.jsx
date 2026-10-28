import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { PageLoader } from "./components/Extras";
import { ToastProvider } from "./components/Toast";
import { SiteProvider, useSite } from "./lib/site";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Specialists from "./pages/Specialists";
import Insights from "./pages/Insights";
import Article from "./pages/Article";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// The dashboard is code-split so website visitors never download it.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function Admin() {
  const { content } = useSite();
  if (!content) return <PageLoader />;
  return <Suspense fallback={<PageLoader />}><AdminApp /></Suspense>;
}

export default function App() {
  return (
    <SiteProvider>
      <ToastProvider>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="programs" element={<Programs />} />
            <Route path="specialists" element={<Specialists />} />
            <Route path="insights" element={<Insights />} />
            <Route path="insights/:slug" element={<Article />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </SiteProvider>
  );
}
