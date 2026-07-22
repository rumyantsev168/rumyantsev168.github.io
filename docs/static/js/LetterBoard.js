/* LetterBoard.js */
// Custom HTML Letter Board.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/LetterBoard.js

class LetterBoard extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];
    static get observedAttributes() {
        return ["content"];
    }

    constructor() {
        super();
        this._rendered = false;
    }
    
    connectedCallback() {
        if (LetterBoard.assetsLoaded) {
            this.render();
            return;
        }

        if (LetterBoard.loadingPromises.length > 0) {
            LetterBoard.loadingPromises.push(this.render.bind(this));
            return;
        }

        const loadPromise = this.loadAssets();
        LetterBoard.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            LetterBoard.assetsLoaded = true;
            const promises = LetterBoard.loadingPromises;
            LetterBoard.loadingPromises = [];
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
                ? "static/css/letter-board.css" 
                : "https://rumyantsev168.github.io/static/css/letter-board.css";

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
                    stylesheet.onerror = () => rej(new Error("Failed to load letter-board.css"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered) return;

        let content = this.getAttribute("content");
        if (!content) {
            console.warn("There's an empty <letter-board>!");
            content = "       |       |       ";
        }

        const lines = content.split("|");

        const mainContainer = document.createElement("div");
        mainContainer.className = "letter-board";
        lines.forEach(line => {
            const lineElement = document.createElement("div");
            lineElement.className = "letter-board-line";
            if (line !== "") {
                const letters = line.split("");
                letters.forEach(letter => {
                    const letterSpan = document.createElement("span");
                    if (letter !== " ") {
                        letterSpan.className = "letter-board-letter";
                        letterSpan.innerText = letter.toUpperCase();
                        if ("0123456789.,!?@#$%&+*".includes(letter)) { letterSpan.style.color = "#b22222" }
                    } else {
                        letterSpan.className = "letter-board-space";
                    }
                    lineElement.appendChild(letterSpan);
                });
            }
            mainContainer.appendChild(lineElement);
        });

        this.appendChild(mainContainer);
        this._rendered = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        this._rendered = false;
        this.innerHTML = "";
        this.render();
    }
}

customElements.define("letter-board", LetterBoard);
console.log("This page uses LetterBoard.js!");
