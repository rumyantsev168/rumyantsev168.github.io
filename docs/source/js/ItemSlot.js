class ItemSlot extends HTMLElement {
    constructor() {
        super();

        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = "source/css/item-slot.css";
        const minecraftColors = document.createElement("script");
        minecraftColors.src = "source/js/min/minecraftColors.min.js";

        Promise.all([
            new Promise((resolve, reject) => {
                stylesheet.onload = resolve;
                stylesheet.onerror = () => reject(new Error("Failed to load item-slot.css"));
                document.head.appendChild(stylesheet);
            }),
            new Promise((resolve, reject) => {
                minecraftColors.onload = resolve;
                minecraftColors.onerror = () => reject(new Error("Failed to load minecraftColors.min.js"));
                document.head.appendChild(minecraftColors);
            })
        ]).then(() => {
            const itemSlot = document.createElement("div");
            itemSlot.className = "item-slot";

            const isLarge = this.hasAttribute("large");
            const itemSrc = this.getAttribute("item");
            const itemCount = this.getAttribute("count");
            const itemTooltip = this.getAttribute("tooltip");

            if (isLarge) {
                itemSlot.style.padding = "4px";
            };

            if (itemSrc) {
                const itemImg = document.createElement("img");
                itemImg.src = itemSrc;
                itemImg.width = 32;
                itemImg.height = 32;
                itemSlot.appendChild(itemImg);
            };

            if (itemCount) {
                const itemCountSpan = document.createElement("span");
                itemCountSpan.innerText = itemCount;
                itemSlot.appendChild(itemCountSpan);
            };

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
            };

            this.appendChild(itemSlot);
            console.log("Added new <item-slot> element");
        });
    };
};

customElements.define("item-slot", ItemSlot);

const move = (e, el, i) => {
    try {
        let rect = i.getBoundingClientRect();
        el.style.left = e.pageX - rect.left + 15 + "px";
        el.style.top = e.pageY - rect.top - 37 + "px";
    } catch (err) {};
};