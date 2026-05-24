class ItemSlot extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];

    constructor() {
        super();
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

        const loadPromise = this.loadAssets();
        ItemSlot.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            ItemSlot.assetsLoaded = true;
            ItemSlot.loadingPromises.forEach(resolve => resolve());
            ItemSlot.loadingPromises = [];
        }).catch(console.error);
    }

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
        const itemSlot = document.createElement("div");
        itemSlot.className = "item-slot";

        const isLarge = this.hasAttribute("large");
        const itemSrc = this.getAttribute("item");
        const itemCount = this.getAttribute("count");
        const itemTooltip = this.getAttribute("tooltip");

        if (isLarge) {
            itemSlot.style.padding = "4px";
        }

        if (itemSrc) {
            const itemImg = document.createElement("img");
            itemImg.src = itemSrc;
            itemImg.width = 32;
            itemImg.height = 32;
            itemSlot.appendChild(itemImg);
        }

        if (itemCount) {
            const itemCountSpan = document.createElement("span");
            itemCountSpan.innerText = itemCount;
            itemSlot.appendChild(itemCountSpan);
        }

        if (itemTooltip) {
            const itemTooltipDiv = document.createElement("div");
            const itemTooltipTextShadow = document.createElement("div");
            itemTooltipDiv.className = "item-tooltip";
            itemTooltipTextShadow.className = "item-tooltip-text-shadow";
            let itemTooltipText = itemTooltip.replaceColorCodes();
            itemTooltipDiv.appendChild(itemTooltipText.cloneNode(true));
            itemTooltipTextShadow.appendChild(itemTooltipText.cloneNode(true));

            itemTooltipDiv.appendChild(itemTooltipTextShadow);
            itemSlot.appendChild(itemTooltipDiv);

            document.addEventListener("mousemove", (event) => {
                move(event, itemTooltipDiv, itemSlot);
            });
        }

        this.appendChild(itemSlot);
        console.log("Added new <item-slot> element");
    }
}

customElements.define("item-slot", ItemSlot);

const move = (e, el, i) => {
    try {
        let rect = i.getBoundingClientRect();
        el.style.left = e.pageX - rect.left + 25 + "px";
        el.style.top = e.pageY - rect.top - 37 + "px";
    } catch (err) {}
};
