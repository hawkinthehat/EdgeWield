import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { captureReferralCode } from "@/hooks/use-checkout";

// Capture ?ref=CODE from the URL before the app mounts (persists through Stripe redirect)
captureReferralCode();

createRoot(document.getElementById("root")!).render(<App />);
