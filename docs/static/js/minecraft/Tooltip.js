/* Tooltip.js */
// Adds a Minecraft-style tooltip on hover for any element.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/minecraft/Tooltip.js

/* Minecraft Color Codes Formatter */
// Author: FoxInFlame (https://github.com/FoxInFlame)
// Source: https://github.com/FoxInFlame/MinecraftColorCodes/blob/master/MinecraftColorCodes.min.3.7.js
if (!String.prototype.replaceColorCodes) {
    function obfuscate(e,o){function t(e,o){var t=0,n=o||e.innerHTML,a=n.length;obfuscators.push(window.setInterval(function(){t>=a&&(t=0),n=r(n,t),e.innerHTML=n,t++},0))}function n(e,o){return Math.floor(Math.random()*(o-e+1))+e}function r(e,o){var t=String.fromCharCode(n(64,90));return e.substr(0,o)+t+e.substr(o+1,e.length)}var a,c,f=o.childNodes.length;if(e.indexOf("<br>")>-1){o.innerHTML=e;for(var i=0;f>i;i++)c=o.childNodes[i],3===c.nodeType&&(a=document.createElement("span"),a.innerHTML=c.nodeValue,o.replaceChild(a,c),t(a))}else t(o,e)}function applyCode(e,o){for(var t=o.length,n=document.createElement("span"),r=!1,a=0;t>a;a++)n.style.cssText+=styleMap[o[a]]+";","&k"===o[a]&&(obfuscate(e,n),r=!0);return r||(n.innerHTML=e),n}function parseStyle(e){for(var o,t,n=e.match(/&.{1}/g)||[],r=[],a=[],c=document.createDocumentFragment(),f=n.length,e=e.replace(/\n|\\n/g,"<br>"),i=0;f>i;i++)r.push(e.indexOf(n[i])),e=e.replace(n[i],"\x00\x00");0!==r[0]&&c.appendChild(applyCode(e.substring(0,r[0]),[]));for(var i=0;f>i;i++){if(t=r[i+1]-r[i],2===t){for(;2===t;)a.push(n[i]),i++,t=r[i+1]-r[i];a.push(n[i])}else a.push(n[i]);a.lastIndexOf("&r")>-1&&(a=a.slice(a.lastIndexOf("&r")+1)),o=e.substring(r[i],r[i+1]),c.appendChild(applyCode(o,a))}return c}function clearObfuscators(){for(var e=obfuscators.length;e--;)clearInterval(obfuscators[e]);obfuscators=[]}function cutString(e,o,t){return e.substr(0,o)+e.substr(t+1)}var obfuscators=[],styleMap={"&4":"font-weight:normal;text-decoration:none;color:#be0000","&c":"font-weight:normal;text-decoration:none;color:#fe3f3f","&6":"font-weight:normal;text-decoration:none;color:#d9a334","&e":"font-weight:normal;text-decoration:none;color:#fefe3f","&2":"font-weight:normal;text-decoration:none;color:#00be00","&a":"font-weight:normal;text-decoration:none;color:#3ffe3f","&b":"font-weight:normal;text-decoration:none;color:#3ffefe","&3":"font-weight:normal;text-decoration:none;color:#00bebe","&1":"font-weight:normal;text-decoration:none;color:#0000be","&9":"font-weight:normal;text-decoration:none;color:#3f3ffe","&d":"font-weight:normal;text-decoration:none;color:#fe3ffe","&5":"font-weight:normal;text-decoration:none;color:#be00be","&f":"font-weight:normal;text-decoration:none;color:#ffffff","&7":"font-weight:normal;text-decoration:none;color:#bebebe","&8":"font-weight:normal;text-decoration:none;color:#3f3f3f","&0":"font-weight:normal;text-decoration:none;color:#000000","&l":"font-weight:bold","&n":"text-decoration:underline;text-decoration-skip:spaces","&o":"font-style:italic","&m":"text-decoration:line-through;text-decoration-skip:spaces"};String.prototype.replaceColorCodes=function(){clearObfuscators();var e=parseStyle(String(this));return e};
}

/* Helper functions */
// Moves the tooltip and also prevents overflow
const moveTooltip = (e, t) => {
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
}

/* Asset Loader */
const TooltipStyleLoader = {
    _loaded: false,
    _loadingPromises: [],
    _cssHref: null,

    loadStyles() {
        if (this._loaded) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const useLocal = document.currentScript?.hasAttribute("localassets");
            const cssHref = this._cssHref || (useLocal
                ? "static/css/minecraft/tooltip.css"
                : "https://rumyantsev168.github.io/static/css/minecraft/tooltip.css");

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
TooltipStyleLoader.loadStyles();

const allElements = document.querySelectorAll("[mc-tooltip]:not(item-slot, item-slot-grid)");

// Add tooltips
allElements.forEach((el, i) => {
    const tooltipText = el.getAttribute("mc-tooltip");
    if (!tooltipText) return;

    const tooltip = document.createElement("div");
    tooltip.replaceChildren(tooltipText.replaceColorCodes());
    tooltip.className = "mc-tooltip";
    tooltip.id = `mc-tooltip-${i}`;
    el.after(tooltip);

    el.dataset.tooltipTarget = tooltip.id;
});

// Add event listeners
allElements.forEach(el => {
    const tooltip = el.nextElementSibling?.matches(".mc-tooltip") 
        ? el.nextElementSibling 
        : document.getElementById(el.dataset.tooltipTarget);
    if (!tooltip) return;

    el.addEventListener("mouseover", e => {
        tooltip.style.display = "block";
    });

    el.addEventListener("mousemove", e => {
        moveTooltip(e, tooltip);
    });

    el.addEventListener("mouseout", () => {
        tooltip.style.display = "none";
    });
});
