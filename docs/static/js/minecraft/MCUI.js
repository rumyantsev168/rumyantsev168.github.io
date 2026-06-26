/* MCUI.js */
// Custom Minecraft-styled UI components.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/minecraft/MCUI.js

/* Asset Loader */
const MCUIStyleLoader = {
    _loaded: false,
    _loadingPromises: [],
    _cssHref: null,

    loadStyles() {
        if (this._loaded) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const useLocal = document.currentScript?.hasAttribute("localassets");
            const cssHref = this._cssHref || (useLocal
                ? "static/css/minecraft/mc-ui.css"
                : "https://rumyantsev168.github.io/static/css/minecraft/mc-ui.css");

            let stylesheet = document.head.querySelector(`link[href="${cssHref}"]`);
            if (stylesheet && stylesheet.sheet) {
                this._loaded = true;
                resolve();
                return;
            }

            if (!stylesheet) {
                stylesheet = document.createElement("link");
                stylesheet.rel = "stylesheet";
                stylesheet.href = cssHref;
                document.head.appendChild(stylesheet);
            }

            const onComplete = () => {
                this._loaded = true;
                const pending = this._loadingPromises;
                this._loadingPromises = [];
                pending.forEach(resolve => resolve());
            };
            stylesheet.onload = onComplete;
            stylesheet.onerror = () => reject(new Error("Failed to load mc-ui.css"));

            if (stylesheet.sheet) onComplete();
        });
    }
};
MCUIStyleLoader.loadStyles();

document.querySelectorAll("input[is='mc-input'][type='range']").forEach(el => {
    el.dataset.label = el.hasAttribute("label") ? `${el.getAttribute("label")}: ${el.value}` : el.value;
});

document.addEventListener("input", event => {
    if (event.target.matches("input[is='mc-input'][type='range']")) {
        event.target.dataset.label = event.target.hasAttribute("label") ? `${event.target.getAttribute("label")}: ${event.target.value}` : event.target.value;
    }
});

console.log("This page uses MCUI.js!");
