import React from "react";
import { createRoot } from "react-dom/client";
import WebFontLoader from "webfontloader";
import ReactGA from "react-ga4";

import App from "./App";

WebFontLoader.load({
    google: {
        families: ["Source Code Pro:100,400,800"]
    }
});
// TagManager.initialize(tagManagerArgs)
ReactGA.initialize("G-NFHEB9MYTV");

const domNode = document.getElementById("root") as HTMLElement;
const root = createRoot(domNode);
root.render(<App />);
