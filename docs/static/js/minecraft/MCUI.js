/* MCUI.js */
// Custom Minecraft-styled UI components.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/minecraft/MCUI.js

/* Asset Loader */
const MCUI = {
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
    },

    withStyles(renderFn) {
        return () => {
            if (MCUI._loaded) return renderFn();
            MCUI._loadingPromises.push(renderFn);
            MCUI.loadStyles().catch(err => console.error(err));
        };
    }
};

MCUI.loadStyles();

console.log("This page uses MCUI.js!");
