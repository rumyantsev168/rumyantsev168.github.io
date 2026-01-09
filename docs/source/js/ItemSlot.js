class ItemSlot extends HTMLElement {
    constructor() {
        super();

        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = "source/css/item-slot.css";

        new Promise((resolve, reject) => {
            stylesheet.onload = resolve;
            stylesheet.onerror = () => reject(new Error("Failed to load item-slot.css"));
            document.head.appendChild(stylesheet);
        }).then(() => {
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
                itemSlot.title = itemTooltip;
            };

            this.appendChild(itemSlot);
        }).catch(err => {
            console.error("Failed to load <item-slot> element!", err);
        });
    };
};

customElements.define("item-slot", ItemSlot);