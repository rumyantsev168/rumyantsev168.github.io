/* SplitFlap.js */
// Custom HTML Split Flap display.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/SplitFlap.js

class SplitFlap extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];
    static get observedAttributes() {
        return ["char"];
    }

    constructor() {
        super();
        this._rendered = false;
    }
    
    connectedCallback() {
        if (SplitFlap.assetsLoaded) {
            this.render();
            return;
        }

        if (SplitFlap.loadingPromises.length > 0) {
            SplitFlap.loadingPromises.push(this.render.bind(this));
            return;
        }

        const loadPromise = this.loadAssets();
        SplitFlap.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            SplitFlap.assetsLoaded = true;
            const promises = SplitFlap.loadingPromises;
            SplitFlap.loadingPromises = [];
            promises.forEach(resolve => resolve());
        }).catch(err => {
            console.error("Failed to load:", err);
        })
    }

    // Ensures the necessary files are only loaded once
    loadAssets() {
        return new Promise((resolve, reject) => {
            const useLocal = document.currentScript?.hasAttribute("localassets");
            const cssHref = useLocal 
                ? "static/css/split-flap.css" 
                : "https://rumyantsev168.github.io/static/css/split-flap.css";

            let stylesheet = document.head.querySelector(`link[href="${cssHref}"]`);
            if (!stylesheet) {
                stylesheet = document.createElement("link");
                stylesheet.rel = "stylesheet";
                stylesheet.href = cssHref;
                document.head.appendChild(stylesheet);
            }

            Promise.all([
                new Promise((res, rej) => {
                    if (stylesheet.sheet) res();
                    stylesheet.onload = res;
                    stylesheet.onerror = () => rej(new Error("Failed to load split-flap.css"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered) return;

        const char = this.getAttribute("char") || " ";

        const mainContainer = document.createElement("div");
        mainContainer.className = "split-flap";
        
        const topSpan = document.createElement("span");
        topSpan.className = "split-flap-char top";
        topSpan.innerText = char;
        this._topSpan = topSpan;
        
        const bottomSpan = document.createElement("span");
        bottomSpan.className = "split-flap-char bottom";
        bottomSpan.innerText = char;
        this._bottomSpan = bottomSpan;

        mainContainer.append(topSpan, bottomSpan);

        this.appendChild(mainContainer);
        this._rendered = true;
        return;
    }

    flip(toChar) {
        if (!this._topSpan || !this._bottomSpan) return;
        
        this._topSpan.className = "split-flap-char top flip";
        setTimeout(() => {
            this._topSpan.className = "split-flap-char top";
            this._topSpan.innerText = toChar;
            this._bottomSpan.innerText = toChar;
        }, 100);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        if (name == "char") { this.flip(newValue) }
        return;
    }
}

customElements.define("split-flap", SplitFlap);
console.log("This page uses SplitFlap.js!");
