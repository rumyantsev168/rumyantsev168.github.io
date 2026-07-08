/* PlayerDisplay.js */
// Custom HTML element, that displays Minecraft player's skin and username.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/minecraft/PlayerDisplay.js
// Uses https://visage.surgeplay.com/skin API to get player skin by username

/* Minecraft Color Codes Formatter */
// Author: FoxInFlame (https://github.com/FoxInFlame)
// Source: https://github.com/FoxInFlame/MinecraftColorCodes/blob/master/MinecraftColorCodes.min.3.7.js
if (!String.prototype.replaceColorCodes) {
    function obfuscate(e,o){function t(e,o){var t=0,n=o||e.innerHTML,a=n.length;obfuscators.push(window.setInterval(function(){t>=a&&(t=0),n=r(n,t),e.innerHTML=n,t++},0))}function n(e,o){return Math.floor(Math.random()*(o-e+1))+e}function r(e,o){var t=String.fromCharCode(n(64,90));return e.substr(0,o)+t+e.substr(o+1,e.length)}var a,c,f=o.childNodes.length;if(e.indexOf("<br>")>-1){o.innerHTML=e;for(var i=0;f>i;i++)c=o.childNodes[i],3===c.nodeType&&(a=document.createElement("span"),a.innerHTML=c.nodeValue,o.replaceChild(a,c),t(a))}else t(o,e)}function applyCode(e,o){for(var t=o.length,n=document.createElement("span"),r=!1,a=0;t>a;a++)n.style.cssText+=styleMap[o[a]]+";","&k"===o[a]&&(obfuscate(e,n),r=!0);return r||(n.innerHTML=e),n}function parseStyle(e){for(var o,t,n=e.match(/&.{1}/g)||[],r=[],a=[],c=document.createDocumentFragment(),f=n.length,e=e.replace(/\n|\\n/g,"<br>"),i=0;f>i;i++)r.push(e.indexOf(n[i])),e=e.replace(n[i],"\x00\x00");0!==r[0]&&c.appendChild(applyCode(e.substring(0,r[0]),[]));for(var i=0;f>i;i++){if(t=r[i+1]-r[i],2===t){for(;2===t;)a.push(n[i]),i++,t=r[i+1]-r[i];a.push(n[i])}else a.push(n[i]);a.lastIndexOf("&r")>-1&&(a=a.slice(a.lastIndexOf("&r")+1)),o=e.substring(r[i],r[i+1]),c.appendChild(applyCode(o,a))}return c}function clearObfuscators(){for(var e=obfuscators.length;e--;)clearInterval(obfuscators[e]);obfuscators=[]}function cutString(e,o,t){return e.substr(0,o)+e.substr(t+1)}var obfuscators=[],styleMap={"&4":"font-weight:normal;text-decoration:none;color:#be0000","&c":"font-weight:normal;text-decoration:none;color:#fe3f3f","&6":"font-weight:normal;text-decoration:none;color:#d9a334","&e":"font-weight:normal;text-decoration:none;color:#fefe3f","&2":"font-weight:normal;text-decoration:none;color:#00be00","&a":"font-weight:normal;text-decoration:none;color:#3ffe3f","&b":"font-weight:normal;text-decoration:none;color:#3ffefe","&3":"font-weight:normal;text-decoration:none;color:#00bebe","&1":"font-weight:normal;text-decoration:none;color:#0000be","&9":"font-weight:normal;text-decoration:none;color:#3f3ffe","&d":"font-weight:normal;text-decoration:none;color:#fe3ffe","&5":"font-weight:normal;text-decoration:none;color:#be00be","&f":"font-weight:normal;text-decoration:none;color:#ffffff","&7":"font-weight:normal;text-decoration:none;color:#bebebe","&8":"font-weight:normal;text-decoration:none;color:#3f3f3f","&0":"font-weight:normal;text-decoration:none;color:#000000","&l":"font-weight:bold","&n":"text-decoration:underline;text-decoration-skip:spaces","&o":"font-style:italic","&m":"text-decoration:line-through;text-decoration-skip:spaces"};String.prototype.replaceColorCodes=function(){clearObfuscators();var e=parseStyle(String(this));return e};
}

/* Render Avatar */
// Mimics Mob Vote style!
const AVATAR_CONFIG = {
    outputWidth: 28,
    outputHeight: 30,
    inputSize: 64,
    legacyThreshold: 32
};

class AvatarSkinProcessor {
    constructor(imageSource) {
        this.skinImage = imageSource;
        this.skinPixels = this.extractSkinData();
        this.isLegacySkin = this.checkSkinFormat();
    }

    extractSkinData() {
        const tempDiv = document.createElement("canvas");
        tempDiv.width = AVATAR_CONFIG.inputSize;
        tempDiv.height = AVATAR_CONFIG.inputSize;
        const tempContext = tempDiv.getContext("2d");
        tempContext.imageSmoothingEnabled = false;
        tempContext.drawImage(this.skinImage, 0, 0);
        return tempContext.getImageData(0, 0, AVATAR_CONFIG.inputSize, AVATAR_CONFIG.inputSize);
    }

    checkSkinFormat() {
        const h = this.skinImage.naturalHeight || this.skinImage.height || AVATAR_CONFIG.inputSize;
        return h <= AVATAR_CONFIG.legacyThreshold;
    }
}

class PixelCanvas {
    constructor(w, h) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d");
        this.imgData = this.ctx.createImageData(w, h);
        this.w = w;
        this.h = h;
    }

    getPixel(x, y) {
        const idx = (y*this.w + x) * 4;
        return [
            this.imgData.data[idx],
            this.imgData.data[idx+1],
            this.imgData.data[idx+2],
            this.imgData.data[idx+3]
        ];
    }

    setPixel(x, y, r, g, b, a) {
        if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
        const idx = (y*this.w + x) * 4;
        this.imgData.data[idx] = r;
        this.imgData.data[idx+1] = g;
        this.imgData.data[idx+2] = b;
        this.imgData.data[idx+3] = a;
    }

    setPixelArray(x, y, colorArray) {
        this.setPixel(x, y, colorArray[0], colorArray[1], colorArray[2], colorArray[3]);
    }

    darken(x, y, factor) {
        const [r, g, b, a] = this.getPixel(x, y);
        this.setPixel(x, y, Math.round(r*factor), Math.round(g*factor), Math.round(b*factor), a);
    }

    render() {
        this.ctx.putImageData(this.imgData, 0, 0);
        return this.canvas;
    }
}

class SkinSampler {
    constructor(skinData) {
        this.data = skinData;
        this.stride = AVATAR_CONFIG.inputSize;
    }

    fetch(x, y) {
        const pos = (y*this.stride + x) * 4;
        return [
            this.data[pos],
            this.data[pos+1],
            this.data[pos+2],
            this.data[pos+3]
        ];
    }

    tint(color, intensity) {
        return [
            Math.round(color[0] * intensity),
            Math.round(color[1] * intensity),
            Math.round(color[2] * intensity),
            color[3]
        ];
    }
}

class RegionPainter {
    constructor(canvas, sampler) {
        this.canvas = canvas;
        this.sampler = sampler;
    }

    expandRect(destX0, destY0, destX1, destY1, srcX0, srcY0, srcX1, srcY1, intensity = 1.0, mirror = false) {
        const destW = destX1 - destX0;
        const destH = destY1 - destY0;
        const srcW = srcX1 - srcX0;
        const srcH = srcY1 - srcY0;

        for (let row = 0; row < destH; row++) {
            for (let col = 0; col < destW; col++) {
                const srcCol = mirror ? (destW - 1 - col) : col;
                const mapX = srcX0 + Math.floor((srcCol * srcW) / destW);
                const mapY = srcY0 + Math.floor((row * srcH) / destH);

                let c = this.sampler.fetch(mapX, mapY);
                if (intensity !== 1.0) {
                    c = this.sampler.tint(c, intensity);
                }
                this.canvas.setPixelArray(destX0 + col, destY0 + row, c);
            }
        }
    }

    expandRectWithTransparency(destX0, destY0, destX1, destY1, srcX0, srcY0, srcX1, srcY1, intensity = 1.0, mirror = false) {
        const destW = destX1 - destX0;
        const destH = destY1 - destY0;
        const srcW = srcX1 - srcX0;
        const srcH = srcY1 - srcY0;

        for (let row = 0; row < destH; row++) {
            for (let col = 0; col < destW; col++) {
                const srcCol = mirror ? (destW - 1 - col) : col;
                const mapX = srcX0 + Math.floor((srcCol * srcW) / destW);
                const mapY = srcY0 + Math.floor((row * srcH) / destH);

                const c = this.sampler.fetch(mapX, mapY);
                if (c[3] === 0) continue;

                const tinted = intensity !== 1.0 ? this.sampler.tint(c, intensity) : c;
                this.canvas.setPixelArray(destX0 + col, destY0 + row, tinted);
            }
        }
    }

    compressColumns(destX0, destY0, destX1, destY1, srcX0, srcY0, srcX1, srcY1, isOverlay = false) {
        const colMap = [2, 2, 2, 1, 1, 2, 2, 2];
        const destH = destY1 - destY0;
        const srcH = srcY1 - srcY0;

        let currentDestX = 0;
        for (let srcIdx = 0; srcIdx < 8; srcIdx++) {
            const stretch = colMap[srcIdx];

            for (let row = 0; row < destH; row++) {
                const mapY = srcY0 + Math.floor((row * srcH) / destH);
                const mapX = srcX0 + srcIdx;
                const c = this.sampler.fetch(mapX, mapY);

                if (isOverlay && c[3] === 0) continue;

                for (let i = 0; i < stretch; i++) {
                    this.canvas.setPixelArray(destX0 + currentDestX + i, destY0 + row, c);
                }
            }
            currentDestX += stretch;
        }
    }

    darkenBorders(x0, y0, x1, y1, amount = 0.7) {
        for (let x = x0; x < x1; x++) {
            this.canvas.darken(x, y0, amount);
            this.canvas.darken(x, y1 - 1, amount);
        }
        for (let y = y0+1; y < y1-1; y++) {
            this.canvas.darken(x0, y, amount);
            this.canvas.darken(x1-1, y, amount);
        }
    }
}

class HeadRenderer {
    constructor(painter) {
        this.painter = painter;
    }

    paint(legacy) {
        this.painter.compressColumns(2, 5, 16, 21, 8, 8, 16, 16, false);
        this.painter.expandRect(16, 5, 24, 21, 16, 8, 24, 16, 0.78);
        this.painter.darkenBorders(2, 5, 16, 21);
        this.painter.darkenBorders(16, 5, 24, 21);
    }
}

class TorsoRenderer {
    constructor(painter) {
        this.painter = painter;
    }

    paint() {
        this.painter.expandRect(7, 21, 17, 25, 20, 20, 28, 32);
        this.painter.darkenBorders(3, 21, 6, 26);
        this.painter.darkenBorders(17, 21, 24, 26);
    }
}

class JointsRenderer {
    constructor(painter) {
        this.painter = painter;
    }

    paint() {
        this.painter.darkenBorders(6, 25, 12, 28);
        this.painter.darkenBorders(12, 25, 17, 28);
    }
}

class LimbsLayer {
    constructor(painter) {
        this.painter = painter;
    }

    renderLeftArm(legacy) {
        this.painter.expandRect(3, 21, 7, 25, 44, 20, 48, 31);
        this.painter.expandRect(3, 25, 7, 26, 44, 31, 48, 32);
    }

    renderRightArm(legacy) {
        if (legacy) {
            this.painter.expandRect(17, 21, 24, 25, 44, 20, 48, 31, 1.0, true);
            this.painter.expandRect(17, 25, 24, 26, 44, 31, 48, 32, 1.0, true);
        } else {
            this.painter.expandRect(17, 21, 24, 25, 36, 52, 40, 63);
            this.painter.expandRect(17, 25, 24, 26, 36, 63, 40, 64);
        }
    }

    renderLeftLeg(legacy) {
        this.painter.expandRect(7, 25, 12, 27, 4, 20, 8, 31);
        this.painter.expandRect(7, 27, 12, 28, 4, 31, 8, 32);
    }

    renderRightLeg(legacy) {
        if (legacy) {
            this.painter.expandRect(12, 25, 17, 27, 4, 20, 8, 31, 1.0, true);
            this.painter.expandRect(12, 27, 17, 28, 4, 31, 8, 32, 1.0, true);
        } else {
            this.painter.expandRect(12, 25, 17, 27, 20, 52, 24, 63);
            this.painter.expandRect(12, 27, 17, 28, 20, 63, 24, 64);
        }
    }

    renderUpperLeg(legacy) {
        this.painter.expandRect(17, 26, 19, 27, 4, 20, 8, 31, 0.82);
        this.painter.expandRect(17, 27, 19, 28, 4, 31, 8, 32, 0.82);
    }

    paint(legacy) {
        this.renderLeftArm(legacy);
        this.renderRightArm(legacy);
        this.renderLeftLeg(legacy);
        this.renderRightLeg(legacy);
        this.renderUpperLeg(legacy);

        for (let y = 21; y < 26; y++) {
            for (let x = 21; x < 24; x++) {
                this.painter.canvas.darken(x, y, 0.88);
            }
        }
    }
}

class OverlayLayer {
    constructor(painter) {
        this.painter = painter;
    }

    paintHead(legacy) {
        this.painter.compressColumns(2, 5, 16, 21, 40, 8, 48, 16, true);
        this.painter.expandRectWithTransparency(16, 5, 24, 21, 48, 8, 56, 16, 0.78);
    }

    paintTorso(legacy) {
        this.painter.expandRectWithTransparency(7, 21, 17, 25, 20, 36, 28, 48);
    }

    paintLeftArm(legacy) {
        this.painter.expandRectWithTransparency(3, 21, 7, 25, 44, 36, 48, 47);
        this.painter.expandRectWithTransparency(3, 25, 7, 26, 44, 47, 48, 48);
    }

    paintRightArm(legacy) {
        if (legacy) {
            this.painter.expandRectWithTransparency(17, 21, 24, 25, 44, 36, 48, 47, 1.0, true);
            this.painter.expandRectWithTransparency(17, 25, 24, 26, 44, 47, 48, 48, 1.0, true);
        } else {
            this.painter.expandRectWithTransparency(17, 21, 24, 25, 52, 52, 56, 63);
            this.painter.expandRectWithTransparency(17, 25, 24, 26, 52, 63, 56, 64);
        }
    }

    paintLeftLeg(legacy) {
        this.painter.expandRectWithTransparency(7, 25, 12, 27, 4, 36, 8, 47);
        this.painter.expandRectWithTransparency(7, 27, 12, 28, 4, 47, 8, 48);
    }

    paintRightLeg(legacy) {
        if (legacy) {
            this.painter.expandRectWithTransparency(12, 25, 17, 27, 4, 36, 8, 47, 1.0, true);
            this.painter.expandRectWithTransparency(12, 27, 17, 28, 4, 47, 8, 48, 1.0, true);
        } else {
            this.painter.expandRectWithTransparency(12, 25, 17, 27, 4, 52, 8, 63);
            this.painter.expandRectWithTransparency(12, 27, 17, 28, 4, 63, 8, 64);
        }
    }

    paint(legacy) {
        this.paintHead(legacy);
        this.paintTorso(legacy);
        this.paintLeftArm(legacy);
        this.paintRightArm(legacy);
        this.paintLeftLeg(legacy);
        this.paintRightLeg(legacy);
    }
}

function renderAvatar(skinImage, withOverlay = true) {
    const processor = new AvatarSkinProcessor(skinImage);
    const canvas = new PixelCanvas(AVATAR_CONFIG.outputWidth, AVATAR_CONFIG.outputHeight);
    const sampler = new SkinSampler(processor.skinPixels.data);
    const painter = new RegionPainter(canvas, sampler);

    const headLayer = new HeadRenderer(painter);
    const torsoLayer = new TorsoRenderer(painter);
    const jointsLayer = new JointsRenderer(painter);
    const limbsLayer = new LimbsLayer(painter);

    headLayer.paint(processor.isLegacySkin);
    torsoLayer.paint();
    jointsLayer.paint();
    limbsLayer.paint(processor.isLegacySkin);

    if (withOverlay) {
        const overlayLayer = new OverlayLayer(painter);
        overlayLayer.paint(processor.isLegacySkin);
    }

    return canvas.render();
}

/* Player Display */
class PlayerDisplay extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];
    static get observedAttributes() {
        return ["skinsrc", "username", "displayname", "nooverlay", "nodisplayname"];
    }

    constructor() {
        super()
        this._rendered = false;
        this._pendingImage = false;
    }

    connectedCallback() {
        if (PlayerDisplay.assetsLoaded) {
            this.render();
            return;
        }

        if (PlayerDisplay.loadingPromises.length > 0) {
            PlayerDisplay.loadingPromises.push(this.render.bind(this));
            return;
        }

        const loadPromise = this.loadAssets();
        PlayerDisplay.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            PlayerDisplay.assetsLoaded = true;
            const promises = PlayerDisplay.loadingPromises;
            PlayerDisplay.loadingPromises = [];
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
                ? "static/css/minecraft/player-display.css" 
                : "https://rumyantsev168.github.io/static/css/minecraft/player-display.css";

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
                    stylesheet.onerror = () => rej(new Error("Failed to load player-display.css"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered || this._pendingImage) return;
        
        const mainContainer = document.createElement("div");
        mainContainer.className = "player-display-container";
        const playerName = document.createElement("span");
        playerName.className = "player-display-player-name";
        this._nameEl = playerName;

        let skinSrc, userName, displayName;
        skinSrc = (this.getAttribute("skinsrc") || "").trim();
        if (!skinSrc) {
            userName = (this.getAttribute("username") || "").trim();
            if (!userName) {
                console.warn("Skin source unset for a <player-display> element!");
                userName = "Steve";
            }
            skinSrc = `https://visage.surgeplay.com/skin/${userName}`;
        }
        displayName = this.getAttribute("displayname");
        if (!displayName) {
            playerName.innerText = (userName && !this.hasAttribute("nodisplayname")) ? userName : "";
        } else {
            playerName.replaceChildren(displayName.replaceAll("&k", "").replaceColorCodes());
        }
        
        const skinImg = new Image();
        skinImg.crossOrigin = "anonymous";

        this._pendingImage = true;
        skinImg.onload = () => {
            const avatarCanvas = renderAvatar(skinImg, !this.hasAttribute("nooverlay"));
            avatarCanvas.className = "player-display-avatar-canvas";
            mainContainer.appendChild(playerName);
            mainContainer.appendChild(avatarCanvas);
            this.appendChild(mainContainer);
            this._rendered = true;
            this._pendingImage = false;
        };
        skinImg.onerror = () => {
            console.warn("Failed to load skin:", skinSrc);
            this._rendered = true;
            this._pendingImage = false;
        };
        skinImg.src = skinSrc;

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this.innerHTML = "";
        this._rendered = false;
        this.render();
    }
}

customElements.define("player-display", PlayerDisplay);
console.log("This page uses PlayerDisplay.js!");
