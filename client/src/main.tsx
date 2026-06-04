import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initBrand } from "@/lib/brand-theme";

initBrand();

createRoot(document.getElementById("root")!).render(<App />);
