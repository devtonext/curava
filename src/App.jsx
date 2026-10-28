import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Specialists from "./pages/Specialists";
import Insights from "./pages/Insights";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="programs" element={<Programs />} />
          <Route path="specialists" element={<Specialists />} />
          <Route path="insights" element={<Insights />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
