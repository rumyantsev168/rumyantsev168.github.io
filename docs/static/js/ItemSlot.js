/*
TODO:
  - Add <crafting-grid> custom element -> Added ItemSlotGrid instead
  - Add comments where necessary -> Done (mostly)
  - Make the <item-slot-grid> have a "continue" attribute,
    which makes it fill in if there are lt width*height <item-slot>'s inside -> Done
  - Remove mouseover listener on disconnectedCallback() in ItemSlot -> Tooltip isn't implemented yet
  - FIX THE TOOLTIP!!! -> Works now
  - Prevent horizontal tooltip overflow
*/

class ItemSlot extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];

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
        loadingIndicator.innerText = "Loading <item-slot> elements...";
        document.body.appendChild(loadingIndicator);

        const loadPromise = this.loadAssets();
        ItemSlot.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            ItemSlot.assetsLoaded = true;
            ItemSlot.loadingPromises.forEach(resolve => resolve());
            ItemSlot.loadingPromises = [];
        }).catch(err => {
            console.error("Failed to load assets:", err);
        }).finally(() => {
            const loader = document.getElementById("item-slot-loading");
            if (loader) loader.remove();
        });
    }

    // Ensures the necessary files are only loaded once
    // I originally had it append a <link> and <script> for every <item-slot> on the page lol
    loadAssets() {
        return new Promise((resolve, reject) => {
            const cssHref = "https://rumyantsev168.github.io/static/css/item-slot.css";
            const jsSrc = "https://rumyantsev168.github.io/static/js/min/minecraftColors.min.js";

            let stylesheet = document.head.querySelector(`link[href="${cssHref}"]`);
            if (!stylesheet) {
                stylesheet = document.createElement("link");
                stylesheet.rel = "stylesheet";
                stylesheet.href = cssHref;
                document.head.appendChild(stylesheet);
            }

            let minecraftColors = document.head.querySelector(`script[src="${jsSrc}"]`);
            if (!minecraftColors) {
                minecraftColors = document.createElement("script");
                minecraftColors.src = jsSrc;
                document.head.appendChild(minecraftColors);
            }

            Promise.all([
                new Promise((res, rej) => {
                    if (stylesheet.sheet) res();
                    stylesheet.onload = res;
                    stylesheet.onerror = () => rej(new Error("Failed to load item-slot.css"));
                }),
                new Promise((res, rej) => {
                    if (minecraftColors.readyState === "loaded" || minecraftColors.readyState === "complete") res();
                    minecraftColors.onload = res;
                    minecraftColors.onerror = () => rej(new Error("Failed to load minecraftColors.min.js"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered) return;

        const itemSlot = document.createElement("div");
        itemSlot.className = "item-slot";

        const isLarge = this.hasAttribute("large");
        const itemSrc = this.getAttribute("item");
        const itemCount = this.getAttribute("count");
        const itemTooltip = this.getAttribute("tooltip");

        if (isLarge) {
            itemSlot.style.padding = "4px";
        }

        // Makes sure the image is not stretched
        if (itemSrc) {
            const img = new Image();            
            img.onload = function() {
                const itemImg = document.createElement("img");
                itemImg.src = itemSrc;
                if (this.width >= this.height) {
                    itemImg.width = 32;
                } else {
                    itemImg.height = 32;
                };
                itemSlot.appendChild(itemImg);
            };
            img.src = itemSrc;
        };

        if (itemCount) {
            const itemCountSpan = document.createElement("span");
            itemCountSpan.innerText = itemCount;
            itemSlot.appendChild(itemCountSpan);
        }

        if (itemTooltip) {
            const tooltipDiv = document.createElement("div");
            const tooltipTextShadow = document.createElement("div");
            tooltipDiv.className = "item-slot-tooltip";
            tooltipTextShadow.className = "item-slot-tooltip-text-shadow";

            let itemTooltipText = itemTooltip.replaceColorCodes();
            tooltipDiv.appendChild(itemTooltipText.cloneNode(true));
            tooltipTextShadow.appendChild(itemTooltipText.cloneNode(true));

            tooltipDiv.appendChild(tooltipTextShadow);
            itemSlot.appendChild(tooltipDiv);

            const moveHandler = (event) => { move(event, tooltipDiv) };
            this._tooltipMoveHandler = moveHandler;

            document.addEventListener("mousemove", this._tooltipMoveHandler);
        }

        this.appendChild(itemSlot);
        this._rendered = true;
        console.log("Added new <item-slot> element");
    }

    disconnectedCallback() {
        if (this._tooltipMoveHandler) {
            document.removeEventListener("mousemove", this._tooltipMoveHandler);
        }
    }
}

class ItemSlotGrid extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const size = this.getAttribute("size") || "3x3";
        let [width, height] = size.split("x").map(Number);
        if (isNaN(width) || isNaN(height)) {
            console.warn("Invalid size for <crafting-grid>! Using 3x3 as default");
            width = 3; height = 3;
        }
        const doContinue = this.hasAttribute("continue");

        const rawHTML = this.innerHTML.trim();
        const rows = document.createDocumentFragment();

        let result;
        if (rawHTML) {
            const allSlots = [...this.children].filter(el => el.tagName.toLowerCase() === "item-slot");

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
        mainContainer.classList.add("item-slot-mcui", "item-slot-crafting-ui");
        mainContainer.appendChild(grid);

        if (result) {
            result.setAttribute("large", "");
            const arrow = document.createElement("div");
            arrow.className = "item-slot-crafting-arrow";
            mainContainer.appendChild(arrow);
            mainContainer.appendChild(result);
        }

        this.replaceChildren(mainContainer);
        console.log("Added new <item-slot-grid> element");
    }
}

customElements.define("item-slot", ItemSlot);
customElements.define("item-slot-grid", ItemSlotGrid);

const move = (e, t) => {
    try {
        const offsetX = 25;
        const offsetY = -37;
        let x = e.clientX + offsetX;
        let y = Math.max(0, e.clientY + offsetY);

        const tooltipRect = t.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;

        const maxX = window.innerWidth - tooltipWidth;
        if (x > maxX) {
            x = maxX;
        }

        if (x < 5) {
            x = 5;
        }

        t.style.left = x + "px";
        t.style.top = y + "px";
    } catch (err) {}
};
