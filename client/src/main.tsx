import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";
import "remixicon/fonts/remixicon.css";

createRoot(document.getElementById("root")!).render(<App />);
