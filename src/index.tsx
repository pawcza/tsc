import React from "react";
import ReactDOM from "react-dom";
import WebFontLoader from "webfontloader";

import App from "./App";

WebFontLoader.load({
    google: {
        families: ["Source Code Pro:100,400,800"]
    }
});

ReactDOM.render(<App />, document.getElementById("root"));
