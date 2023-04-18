import React from "react";
import { createRoot } from "react-dom/client";
import WebFontLoader from "webfontloader";

import App from "./App";

WebFontLoader.load({
    google: {
        families: ["Source Code Pro:100,400,800"]
    }
});

const domNode = document.getElementById("root") as HTMLElement;
const root = createRoot(domNode);
root.render(<App />);
