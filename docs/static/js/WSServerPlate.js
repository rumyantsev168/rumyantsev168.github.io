// WSServerPlate.js
// Custom HTML element, that displays server info via WebSocket.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/WSServerPlate.js

// ========== Minecraft Color Codes Formatter ==========
// Author: FoxInFlame (https://github.com/FoxInFlame)
// Source: https://github.com/FoxInFlame/MinecraftColorCodes/blob/master/MinecraftColorCodes.min.3.7.js
if (!String.prototype.replaceColorCodes) {
    function obfuscate(e,o){function t(e,o){var t=0,n=o||e.innerHTML,a=n.length;obfuscators.push(window.setInterval(function(){t>=a&&(t=0),n=r(n,t),e.innerHTML=n,t++},0))}function n(e,o){return Math.floor(Math.random()*(o-e+1))+e}function r(e,o){var t=String.fromCharCode(n(64,90));return e.substr(0,o)+t+e.substr(o+1,e.length)}var a,c,f=o.childNodes.length;if(e.indexOf("<br>")>-1){o.innerHTML=e;for(var i=0;f>i;i++)c=o.childNodes[i],3===c.nodeType&&(a=document.createElement("span"),a.innerHTML=c.nodeValue,o.replaceChild(a,c),t(a))}else t(o,e)}function applyCode(e,o){for(var t=o.length,n=document.createElement("span"),r=!1,a=0;t>a;a++)n.style.cssText+=styleMap[o[a]]+";","&k"===o[a]&&(obfuscate(e,n),r=!0);return r||(n.innerHTML=e),n}function parseStyle(e){for(var o,t,n=e.match(/&.{1}/g)||[],r=[],a=[],c=document.createDocumentFragment(),f=n.length,e=e.replace(/\n|\\n/g,"<br>"),i=0;f>i;i++)r.push(e.indexOf(n[i])),e=e.replace(n[i],"\x00\x00");0!==r[0]&&c.appendChild(applyCode(e.substring(0,r[0]),[]));for(var i=0;f>i;i++){if(t=r[i+1]-r[i],2===t){for(;2===t;)a.push(n[i]),i++,t=r[i+1]-r[i];a.push(n[i])}else a.push(n[i]);a.lastIndexOf("&r")>-1&&(a=a.slice(a.lastIndexOf("&r")+1)),o=e.substring(r[i],r[i+1]),c.appendChild(applyCode(o,a))}return c}function clearObfuscators(){for(var e=obfuscators.length;e--;)clearInterval(obfuscators[e]);obfuscators=[]}function cutString(e,o,t){return e.substr(0,o)+e.substr(t+1)}var obfuscators=[],styleMap={"&4":"font-weight:normal;text-decoration:none;color:#be0000","&c":"font-weight:normal;text-decoration:none;color:#fe3f3f","&6":"font-weight:normal;text-decoration:none;color:#d9a334","&e":"font-weight:normal;text-decoration:none;color:#fefe3f","&2":"font-weight:normal;text-decoration:none;color:#00be00","&a":"font-weight:normal;text-decoration:none;color:#3ffe3f","&b":"font-weight:normal;text-decoration:none;color:#3ffefe","&3":"font-weight:normal;text-decoration:none;color:#00bebe","&1":"font-weight:normal;text-decoration:none;color:#0000be","&9":"font-weight:normal;text-decoration:none;color:#3f3ffe","&d":"font-weight:normal;text-decoration:none;color:#fe3ffe","&5":"font-weight:normal;text-decoration:none;color:#be00be","&f":"font-weight:normal;text-decoration:none;color:#ffffff","&7":"font-weight:normal;text-decoration:none;color:#bebebe","&8":"font-weight:normal;text-decoration:none;color:#3f3f3f","&0":"font-weight:normal;text-decoration:none;color:#000000","&l":"font-weight:bold","&n":"text-decoration:underline;text-decoration-skip:spaces","&o":"font-style:italic","&m":"text-decoration:line-through;text-decoration-skip:spaces"};String.prototype.replaceColorCodes=function(){clearObfuscators();var e=parseStyle(String(this));return e};
}
// =====================================================

// ================= Helper functions ==================
// Moves the tooltip and also prevents overflow
const movePlayerList = (e, t) => {
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

if (typeof makeColors === "undefined") {
    function makeColors(lines) {
        return lines
            .join("\n")
            .replaceAll("\u00A7", "&")
            .replaceAll("&k", "")
            .replaceColorCodes();
    }
}

function createImageFromRGBA(imgEl, data, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
    
    imgEl.src = canvas.toDataURL("image/png");
    console.log("Image set successfully!");
}
// =====================================================

class WSServerPlate extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];
    static get observedAttributes() {
        return ["address"];
    }

    static defaultIcon = "https://rumyantsev168.github.io/static/minecraft/server.png";
    static pingingStatus = "https://rumyantsev168.github.io/static/pinging.gif";
    static failureStatus = "https://rumyantsev168.github.io/static/minecraft/failure.png";
    static successStatusList = [
        "https://rumyantsev168.github.io/static/minecraft/success_1.png",
        "https://rumyantsev168.github.io/static/minecraft/success_2.png",
        "https://rumyantsev168.github.io/static/minecraft/success_3.png",
        "https://rumyantsev168.github.io/static/minecraft/success_4.png",
        "https://rumyantsev168.github.io/static/minecraft/success_5.png"
    ];

    constructor() {
        super()
        this._rendered = false;
    }

    connectedCallback() {
        if (WSServerPlate.assetsLoaded) {
            this.render();
            return;
        }

        if (WSServerPlate.loadingPromises.length > 0) {
            WSServerPlate.loadingPromises.push(this.render.bind(this));
            return;
        }

        const loadPromise = this.loadAssets();
        WSServerPlate.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            WSServerPlate.assetsLoaded = true;
            const promises = WSServerPlate.loadingPromises;
            WSServerPlate.loadingPromises = [];
            promises.forEach(resolve => resolve());
        }).catch(err => {
            console.error("Failed to load:", err);
        })
    }

    // Ensures the necessary files are only loaded once
    loadAssets() {
        return new Promise((resolve, reject) => {
            const useLocal = window.WS_SERVER_PLATE_USE_LOCAL_ASSETS;
            const cssHref = useLocal ? "static/css/ws-server-plate.css" : "https://rumyantsev168.github.io/static/css/ws-server-plate.css";

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
                    stylesheet.onerror = () => rej(new Error("Failed to load ws-server-plate.css"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered) return;

        const address = this.getAttribute("address");

        const server = document.createElement("div");
        server.className = "ws-server-plate-server";
        const icon = document.createElement("img");
        icon.className = "ws-server-plate-icon";
        const nameMotd = document.createElement("div");
        nameMotd.className = "ws-server-plate-name-motd";
        const name = document.createElement("span");
        name.className = "ws-server-plate-name";
        const motd = document.createElement("span");
        motd.className = "ws-server-plate-motd";
        const status = document.createElement("img");
        status.className = "ws-server-plate-status";
        const count = document.createElement("span");
        count.className = "ws-server-plate-count";
        const players = document.createElement("div");
        players.className = "ws-server-plate-players";

        const moveHandler = (event) => { movePlayerList(event, players) };
        this._playerListMoveHandler = moveHandler;
        document.addEventListener("mousemove", this._playerListMoveHandler);

        nameMotd.append(name, motd);
        server.append(icon, nameMotd, status, count, players);

        if (!address || (!address.startsWith("ws://") && !address.startsWith("wss://")) || address == "ws://" || address == "wss://") {
            console.warn("Address is invalid or unset for a <ws-server-plate> element!");
            status.src = WSServerPlate.failureStatus;
            icon.src = WSServerPlate.defaultIcon;
            name.innerText = "Minecraft Server";
            motd.replaceChildren(makeColors(["&7A Minecraft Server"]));
            count.innerText = "";
            players.innerHTML = "";
        } else {
            try {
                status.src = WSServerPlate.pingingStatus;
                name.innerText = "Connecting...";
                icon.src = WSServerPlate.defaultIcon;
                motd.replaceChildren(makeColors(["", `&8${address}`]));
                count.innerText = "";
                let ws = new WebSocket(address);
                const startTime = Date.now();
                ws.onopen = () => {
                    console.log("Connected to", address);
                    ws.send("Accept: MOTD");
                };
                ws.onmessage = (event) => {
                    try {
                        const pingTime = Date.now() - startTime;
                        console.log(pingTime);
                        let data = JSON.parse(event.data);
                        console.log("Received JSON data:", data);
                        if (0 <= pingTime && pingTime <= 150) {
                            status.src = WSServerPlate.successStatusList[4];
                        } else if (150 < pingTime && pingTime <= 300) {
                            status.src = WSServerPlate.successStatusList[3];
                        } else if (300 < pingTime && pingTime <= 600) {
                            status.src = WSServerPlate.successStatusList[2];
                        } else if (600 < pingTime && pingTime <= 1000) {
                            status.src = WSServerPlate.successStatusList[1];
                        } else if (pingTime > 1000) {
                            status.src = WSServerPlate.successStatusList[0];
                        }
                        name.replaceChildren(makeColors([data.name]));
                        if (data.data.motd.join("\n").includes("\n")) {
                            motd.replaceChildren(makeColors(data.data.motd));
                        } else {
                            motd.replaceChildren(makeColors([data.data.motd.join(), `&8${address}`]))
                        }
                        count.innerText = `${data.data.online}/${data.data.max}`;
                        if (data.data.players.length > 0) {
                            players.replaceChildren(makeColors(data.data.players));
                        } else {
                            players.replaceChildren(makeColors(["&7&oNo player data"]))
                        }
                    } catch (err) {
                        const blob = event.data;
                        blob.arrayBuffer().then(buffer => {
                            const view = new Uint8Array(buffer);
                            const possibleSizes = [64, 128, 256, 512];
                            for (const size of possibleSizes) {
                                const expectedBytes = size * size * 4;
                                if (view.length === expectedBytes) {
                                    createImageFromRGBA(icon, view, size, size);
                                    break;
                                }
                            }
                        });
                    };
                };
                ws.onerror = (err) => {
                    console.error("WebSocket error!", err);
                    status.src = WSServerPlate.failureStatus;
                    name.innerText = "Failed to connect!";
                    motd.replaceChildren(makeColors(["&7This server is offline or doesn't exist", `&8${address}`]));
                    count.innerText = "";
                    players.innerHTML = "";
                };
                ws.onclose = () => {
                    console.log("Connection to", address, "closed");
                };
            } catch (err) {
                console.error("WebSocket error!", err);
            };
        }

        this.appendChild(server);
        this._rendered = true;
    }
    
    disconnectedCallback() {
        if (this._playerListMoveHandler) {
            document.removeEventListener("mousemove", this._playerListMoveHandler);
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

customElements.define("ws-server-plate", WSServerPlate);
console.log("This page uses WSServerPlate.js!");
