import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log(
    "%c Welcome to my playlist 😂💡🎧♻️! ",
    "background: purple; color: white; font-size: 20px; padding: 8px; border-radius: 5px;"
  );
} else {
  console.error("Root element not found");
}
