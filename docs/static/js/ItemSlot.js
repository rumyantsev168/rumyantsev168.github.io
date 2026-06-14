// ItemSlot.js
// Custom Minecraft-styled <item-slot> and <item-slot-grid> elements.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/ItemSlot.js

// ========== Minecraft Color Codes Formatter ==========
// Author: FoxInFlame (https://github.com/FoxInFlame)
// Source: https://github.com/FoxInFlame/MinecraftColorCodes/blob/master/MinecraftColorCodes.min.3.7.js
function obfuscate(e,o){function t(e,o){var t=0,n=o||e.innerHTML,a=n.length;obfuscators.push(window.setInterval(function(){t>=a&&(t=0),n=r(n,t),e.innerHTML=n,t++},0))}function n(e,o){return Math.floor(Math.random()*(o-e+1))+e}function r(e,o){var t=String.fromCharCode(n(64,90));return e.substr(0,o)+t+e.substr(o+1,e.length)}var a,c,f=o.childNodes.length;if(e.indexOf("<br>")>-1){o.innerHTML=e;for(var i=0;f>i;i++)c=o.childNodes[i],3===c.nodeType&&(a=document.createElement("span"),a.innerHTML=c.nodeValue,o.replaceChild(a,c),t(a))}else t(o,e)}function applyCode(e,o){for(var t=o.length,n=document.createElement("span"),r=!1,a=0;t>a;a++)n.style.cssText+=styleMap[o[a]]+";","&k"===o[a]&&(obfuscate(e,n),r=!0);return r||(n.innerHTML=e),n}function parseStyle(e){for(var o,t,n=e.match(/&.{1}/g)||[],r=[],a=[],c=document.createDocumentFragment(),f=n.length,e=e.replace(/\n|\\n/g,"<br>"),i=0;f>i;i++)r.push(e.indexOf(n[i])),e=e.replace(n[i],"\x00\x00");0!==r[0]&&c.appendChild(applyCode(e.substring(0,r[0]),[]));for(var i=0;f>i;i++){if(t=r[i+1]-r[i],2===t){for(;2===t;)a.push(n[i]),i++,t=r[i+1]-r[i];a.push(n[i])}else a.push(n[i]);a.lastIndexOf("&r")>-1&&(a=a.slice(a.lastIndexOf("&r")+1)),o=e.substring(r[i],r[i+1]),c.appendChild(applyCode(o,a))}return c}function clearObfuscators(){for(var e=obfuscators.length;e--;)clearInterval(obfuscators[e]);obfuscators=[]}function cutString(e,o,t){return e.substr(0,o)+e.substr(t+1)}var obfuscators=[],styleMap={"&4":"font-weight:normal;text-decoration:none;color:#be0000","&c":"font-weight:normal;text-decoration:none;color:#fe3f3f","&6":"font-weight:normal;text-decoration:none;color:#d9a334","&e":"font-weight:normal;text-decoration:none;color:#fefe3f","&2":"font-weight:normal;text-decoration:none;color:#00be00","&a":"font-weight:normal;text-decoration:none;color:#3ffe3f","&b":"font-weight:normal;text-decoration:none;color:#3ffefe","&3":"font-weight:normal;text-decoration:none;color:#00bebe","&1":"font-weight:normal;text-decoration:none;color:#0000be","&9":"font-weight:normal;text-decoration:none;color:#3f3ffe","&d":"font-weight:normal;text-decoration:none;color:#fe3ffe","&5":"font-weight:normal;text-decoration:none;color:#be00be","&f":"font-weight:normal;text-decoration:none;color:#ffffff","&7":"font-weight:normal;text-decoration:none;color:#bebebe","&8":"font-weight:normal;text-decoration:none;color:#3f3f3f","&0":"font-weight:normal;text-decoration:none;color:#000000","&l":"font-weight:bold","&n":"text-decoration:underline;text-decoration-skip:spaces","&o":"font-style:italic","&m":"text-decoration:line-through;text-decoration-skip:spaces"};String.prototype.replaceColorCodes=function(){clearObfuscators();var e=parseStyle(String(this));return e};
// =====================================================

class ItemSlot extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];
    static get observedAttributes() {
        return ["large", "item", "count", "tooltip", "durability"];
    }

    constructor() {
        super();
        this._rendered = false;
    }

    connectedCallback() {
        if (ItemSlot.assetsLoaded) {
            this.render();
            return;
        }

        if (ItemSlot.loadingPromises.length > 0) {
            ItemSlot.loadingPromises.push(this.render.bind(this));
            return;
        }

        const loadingIndicator = document.createElement("div");
        loadingIndicator.id = "item-slot-loading";
        loadingIndicator.style.position = "fixed";
        loadingIndicator.style.bottom = "0";
        loadingIndicator.style.left = "0";
        loadingIndicator.style.background = "#f2f2f2";
        loadingIndicator.style.border = "1px solid black";
        loadingIndicator.style.borderRadius = "none";
        loadingIndicator.style.width = "fit-content";
        loadingIndicator.style.height = "fit-content";
        loadingIndicator.innerText = "Loading <item-slot> elements...";
        document.body.appendChild(loadingIndicator);

        const loadPromise = this.loadAssets();
        ItemSlot.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            ItemSlot.assetsLoaded = true;
            ItemSlot.loadingPromises.forEach(resolve => resolve());
            ItemSlot.loadingPromises = [];
        }).catch(err => {
            console.error("Failed to load:", err);
        }).finally(() => {
            const loader = document.getElementById("item-slot-loading");
            if (loader) loader.remove();
        });
    }

    // Ensures the necessary files are only loaded once
    loadAssets() {
        return new Promise((resolve, reject) => {
            const useLocal = window.ITEM_SLOT_USE_LOCAL_ASSETS;
            const cssHref = useLocal ? "static/css/item-slot.css" : "https://rumyantsev168.github.io/static/css/item-slot.css";

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
                    stylesheet.onerror = () => rej(new Error("Failed to load item-slot.css"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered) return;

        const itemSlot = document.createElement("div");
        itemSlot.className = "item-slot";

        const isLarge = this.hasAttribute("large");  // Adds padding via CSS, not handled here
        const itemSrc = this.getAttribute("item");
        const itemCount = this.getAttribute("count");
        const itemTooltip = this.getAttribute("tooltip");
        const itemDurability = parseInt(this.getAttribute("durability"));

        if (itemSrc) {
            const itemImg = document.createElement("img");
            itemImg.className = "item-image";
            itemImg.src = itemSrc;
            itemSlot.appendChild(itemImg);
            this._itemImg = itemImg;
        }

        if (itemCount) {
            const itemCountSpan = document.createElement("span");
            itemCountSpan.appendChild(itemCount.replaceColorCodes());
            itemSlot.appendChild(itemCountSpan);
            this._itemCount = itemCountSpan;
        }

        if (itemTooltip) {
            const tooltipDiv = document.createElement("div");
            tooltipDiv.className = "item-slot-tooltip";

            const itemTooltipText = itemTooltip.replace("&k", "");
            tooltipDiv.appendChild(itemTooltipText.replaceColorCodes());
            
            itemSlot.appendChild(tooltipDiv);
            this._itemTooltip = tooltipDiv;

            const moveHandler = (event) => { move(event, tooltipDiv) };
            this._tooltipMoveHandler = moveHandler;
            document.addEventListener("mousemove", this._tooltipMoveHandler);
        }
        
        if (!isNaN(itemDurability)) {
            const progress = itemDurability / 13;

            const durabilityBar = document.createElement("div");
            durabilityBar.className = "item-slot-durability";
            durabilityBar.style.width = `${1.7 * Math.abs(progress)}em`;

            let hueProgress;
            if (progress < 0) {
                durabilityBar.style.transform = "scaleX(-1) translate(100%)";
                hueProgress = 0;
            } else if (progress >= 0 && progress <= 1) {
                hueProgress = progress;
            } else if (progress > 1) {
                hueProgress = 1;
            }
            
            const hue = 120 * hueProgress;
            const saturation = 100;
            const lightness = 40;
            durabilityBar.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            const durabilityBarBg = document.createElement("div");
            durabilityBarBg.className = "item-slot-durability-bg";
            itemSlot.append(durabilityBarBg, durabilityBar);
            this._durabilityBar = durabilityBar;
            this._durabilityBarBg = durabilityBarBg;
        }

        const hoverOverlay = document.createElement("div");
        hoverOverlay.className = "item-slot-hover-overlay";
        itemSlot.appendChild(hoverOverlay);

        this.appendChild(itemSlot);
        this._rendered = true;
    }

    disconnectedCallback() {
        if (this._tooltipMoveHandler) {
            document.removeEventListener("mousemove", this._tooltipMoveHandler);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.innerHTML = "";
        this.disconnectedCallback();
        this._rendered = false;
        this.render();
    }
}

class ItemSlotGrid extends HTMLElement {
    static get observedAttributes() {
        return ["size", "label", "continue"];
    }

    constructor() {
        super();
        this._rawHtml = this.innerHTML.trim();
    }

    render() {
        const size = this.getAttribute("size") || "3x3";
        let [width, height] = size.split("x").map(Number);
        if (isNaN(width) || isNaN(height)) {
            console.warn("Invalid size for <crafting-grid>! Using 3x3 as default");
            width = 3; height = 3;
        }
        const doContinue = this.hasAttribute("continue");
        const isError = this.hasAttribute("error");

        const rows = document.createDocumentFragment();

        let result;
        if (this._rawHtml) {
            const temp = document.createElement("div");
            temp.innerHTML = this._rawHtml;
            const allSlots = [...temp.children].filter(el => el.tagName.toLowerCase() === "item-slot");

            const resultIndex = allSlots.findIndex(el => el.hasAttribute("result"));
            if (resultIndex !== -1) {
                result = allSlots.splice(resultIndex, 1)[0];
            }

            const slots = [...allSlots]
            const totalSlots = width * height

            for (let i = 0; i < height; i++) {
                let rowContainer = document.createElement("div");
                rowContainer.className = "item-slot-row";
                for (let j = 0; j < width; j++) {
                    const idx = i*width + j;
                    if (idx < slots.length) {
                        rowContainer.appendChild(slots[idx]);
                    } else if (doContinue) {
                        rowContainer.appendChild(document.createElement("item-slot"));
                    }
                }
                rows.appendChild(rowContainer);
            }
        } else {
            for (let i = 0; i < height; i++) {
                let rowContainer = document.createElement("div");
                rowContainer.className = "item-slot-row";
                rowContainer.innerHTML = "<item-slot></item-slot>".repeat(width);
                rows.appendChild(rowContainer);
            }
        }

        const grid = document.createElement("div");
        grid.className = "item-slot-grid";
        grid.appendChild(rows);

        const mainContainer = document.createElement("div");
        mainContainer.className = "item-slot-mcui";
        const title = this.getAttribute("label");
        if (title) {
            const titleSpan = document.createElement("span");
            titleSpan.innerText = title;
            mainContainer.style.paddingTop = "0.1em";
            mainContainer.appendChild(titleSpan);
        }

        if (result) {
            const arrow = document.createElement("div");
            arrow.className = isError ? "item-slot-crafting-arrow-no" :
                                        "item-slot-crafting-arrow-yes";
            const craftingDiv = document.createElement("div");
            craftingDiv.className = "item-slot-crafting-ui";
            craftingDiv.append(grid, arrow, result);
            mainContainer.appendChild(craftingDiv);
        } else {
            mainContainer.appendChild(grid);
        }

        this.replaceChildren(mainContainer);
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
    }
}

customElements.define("item-slot", ItemSlot);
customElements.define("item-slot-grid", ItemSlotGrid);

// Moves the tooltip and also prevents overflow
const move = (e, t) => {
    try {
        const offsetX = 25;
        const offsetY = -37;
        let x = e.clientX + offsetX;
        let y = Math.max(0, e.clientY + offsetY);

        const tooltipRect = t.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        const maxX = window.innerWidth - tooltipWidth;
        if (x > maxX) {
            x = maxX;
        }

        const maxY = window.innerHeight - tooltipHeight;
        y = Math.min(Math.max(0, y), maxY);

        t.style.left = `calc(${x}px - 0.1em)`;
        t.style.top = `calc(${y}px + 0.1em)`;
    } catch (err) {}
};

console.log("This page uses ItemSlot.js!");
