import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";
import "remixicon/fonts/remixicon.css";

// Get the user preferred theme from localStorage or system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('mywakili-theme');
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

// Apply theme class to document element
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
