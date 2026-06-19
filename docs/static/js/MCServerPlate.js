// MCServerPlate.js
// Custom HTML element, that displays Minecraft server info via https://api.mcsrvstat.us API.
// Author: rumyantsev168 (https://github.com/rumyantsev168)
// Source: https://rumyantsev168.github.io/static/js/MCServerPlate.js
// API info: https://api.mcsrvstat.us

// ========== Minecraft Color Codes Formatter ==========
// Author: FoxInFlame (https://github.com/FoxInFlame)
// Source: https://github.com/FoxInFlame/MinecraftColorCodes/blob/master/MinecraftColorCodes.min.3.7.js
if (!String.prototype.replaceColorCodes) {
    function obfuscate(e,o){function t(e,o){var t=0,n=o||e.innerHTML,a=n.length;obfuscators.push(window.setInterval(function(){t>=a&&(t=0),n=r(n,t),e.innerHTML=n,t++},0))}function n(e,o){return Math.floor(Math.random()*(o-e+1))+e}function r(e,o){var t=String.fromCharCode(n(64,90));return e.substr(0,o)+t+e.substr(o+1,e.length)}var a,c,f=o.childNodes.length;if(e.indexOf("<br>")>-1){o.innerHTML=e;for(var i=0;f>i;i++)c=o.childNodes[i],3===c.nodeType&&(a=document.createElement("span"),a.innerHTML=c.nodeValue,o.replaceChild(a,c),t(a))}else t(o,e)}function applyCode(e,o){for(var t=o.length,n=document.createElement("span"),r=!1,a=0;t>a;a++)n.style.cssText+=styleMap[o[a]]+";","&k"===o[a]&&(obfuscate(e,n),r=!0);return r||(n.innerHTML=e),n}function parseStyle(e){for(var o,t,n=e.match(/&.{1}/g)||[],r=[],a=[],c=document.createDocumentFragment(),f=n.length,e=e.replace(/\n|\\n/g,"<br>"),i=0;f>i;i++)r.push(e.indexOf(n[i])),e=e.replace(n[i],"\x00\x00");0!==r[0]&&c.appendChild(applyCode(e.substring(0,r[0]),[]));for(var i=0;f>i;i++){if(t=r[i+1]-r[i],2===t){for(;2===t;)a.push(n[i]),i++,t=r[i+1]-r[i];a.push(n[i])}else a.push(n[i]);a.lastIndexOf("&r")>-1&&(a=a.slice(a.lastIndexOf("&r")+1)),o=e.substring(r[i],r[i+1]),c.appendChild(applyCode(o,a))}return c}function clearObfuscators(){for(var e=obfuscators.length;e--;)clearInterval(obfuscators[e]);obfuscators=[]}function cutString(e,o,t){return e.substr(0,o)+e.substr(t+1)}var obfuscators=[],styleMap={"&4":"font-weight:normal;text-decoration:none;color:#be0000","&c":"font-weight:normal;text-decoration:none;color:#fe3f3f","&6":"font-weight:normal;text-decoration:none;color:#d9a334","&e":"font-weight:normal;text-decoration:none;color:#fefe3f","&2":"font-weight:normal;text-decoration:none;color:#00be00","&a":"font-weight:normal;text-decoration:none;color:#3ffe3f","&b":"font-weight:normal;text-decoration:none;color:#3ffefe","&3":"font-weight:normal;text-decoration:none;color:#00bebe","&1":"font-weight:normal;text-decoration:none;color:#0000be","&9":"font-weight:normal;text-decoration:none;color:#3f3ffe","&d":"font-weight:normal;text-decoration:none;color:#fe3ffe","&5":"font-weight:normal;text-decoration:none;color:#be00be","&f":"font-weight:normal;text-decoration:none;color:#ffffff","&7":"font-weight:normal;text-decoration:none;color:#bebebe","&8":"font-weight:normal;text-decoration:none;color:#3f3f3f","&0":"font-weight:normal;text-decoration:none;color:#000000","&l":"font-weight:bold","&n":"text-decoration:underline;text-decoration-skip:spaces","&o":"font-style:italic","&m":"text-decoration:line-through;text-decoration-skip:spaces"};String.prototype.replaceColorCodes=function(){clearObfuscators();var e=parseStyle(String(this));return e};
}
// =====================================================

// ================= Helper functions ==================
if (typeof makeColors === "undefined") {
    function makeColors(lines) {
        return lines
            .join("\n")
            .replaceAll("\u00A7", "&")
            .replaceAll("&k", "")
            .replaceColorCodes();
    }
}
// =====================================================

class MCServerPlate extends HTMLElement {
    static assetsLoaded = false;
    static loadingPromises = [];
    static get observedAttributes() {
        return ["address", "displayname"];
    }

    static defaultIcon = "https://rumyantsev168.github.io/static/minecraft/server.png";
    static pingingStatus = "https://rumyantsev168.github.io/static/pinging.gif";
    static failureStatus = "https://rumyantsev168.github.io/static/minecraft/failure.png";
    static successStatus = "https://rumyantsev168.github.io/static/minecraft/success_5.png";

    constructor() {
        super()
        this._rendered = false;
    }

    connectedCallback() {
        if (MCServerPlate.assetsLoaded) {
            this.render();
            return;
        }

        if (MCServerPlate.loadingPromises.length > 0) {
            MCServerPlate.loadingPromises.push(this.render.bind(this));
            return;
        }

        const loadPromise = this.loadAssets();
        MCServerPlate.loadingPromises.push(this.render.bind(this));

        loadPromise.then(() => {
            MCServerPlate.assetsLoaded = true;
            const promises = MCServerPlate.loadingPromises;
            MCServerPlate.loadingPromises = [];
            promises.forEach(resolve => resolve());
        }).catch(err => {
            console.error("Failed to load:", err);
        })
    }

    // Ensures the necessary files are only loaded once
    loadAssets() {
        return new Promise((resolve, reject) => {
            const useLocal = window.MC_SERVER_PLATE_USE_LOCAL_ASSETS;
            const cssHref = useLocal ? "static/css/mc-server-plate.css" : "https://rumyantsev168.github.io/static/css/mc-server-plate.css";

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
                    stylesheet.onerror = () => rej(new Error("Failed to load mc-server-plate.css"));
                })
            ]).then(resolve).catch(reject);
        });
    }

    render() {
        if (this._rendered) return;

        const address = this.getAttribute("address");
        const displayName = this.getAttribute("displayname");

        const server = document.createElement("div");
        server.className = "mc-server-plate-server";
        const icon = document.createElement("img");
        icon.className = "mc-server-plate-icon";
        const nameMotd = document.createElement("div");
        nameMotd.className = "mc-server-plate-name-motd";
        const name = document.createElement("span");
        name.className = "mc-server-plate-name";
        if (displayName) {
            name.replaceChildren(makeColors([displayName]));
        } else {
            name.innerText = "Minecraft Server";
        }
        const motd = document.createElement("span");
        motd.className = "mc-server-plate-motd";
        const status = document.createElement("img");
        status.className = "mc-server-plate-status";
        const count = document.createElement("span");
        count.className = "mc-server-plate-count";

        nameMotd.append(name, motd);
        server.append(icon, nameMotd, status, count);

        if (!address) {
            console.warn("Address is unset for an <mc-server-plate> element!");
            status.src = MCServerPlate.failureStatus;
            icon.src = MCServerPlate.defaultIcon;
            motd.replaceChildren(makeColors(["&7A Minecraft Server"]));
            count.innerText = "";
        } else {
            status.src = MCServerPlate.pingingStatus;
            name.innerText = "Fetching...";
            icon.src = MCServerPlate.defaultIcon;
            motd.replaceChildren(makeColors(["", `&8${address}`]));
            count.innerText = "";
            fetch(`https://api.mcsrvstat.us/3/${address}`)
            .then(res => res.json())
            .then(data => {
                console.log("Received JSON data:", data)
                if (data.online) {
                    status.src = MCServerPlate.successStatus;
                    if (displayName) {
                        name.replaceChildren(makeColors([displayName]));
                    } else {
                        name.innerText = "Minecraft Server";
                    }
                    if (data.motd.raw.join("\n").includes("\n")) {
                        motd.replaceChildren(makeColors(data.motd.raw));
                    } else {
                        motd.replaceChildren(makeColors([data.motd.raw.join(), `&8${address}`]))
                    }
                    count.innerText = `${data.players.online}/${data.players.max}`;
                    icon.src = data.icon;
                } else {
                    status.src = MCServerPlate.failureStatus;
                    name.innerText = "Failed to connect!";
                    motd.replaceChildren(makeColors(["&7The server is offline or doesn't exist", `&8${address}`]));
                    count.innerText = "";
                }
            }).catch(err => {
                status.src = MCServerPlate.failureStatus;
                name.innerText = "Failed to fetch!";
                motd.replaceChildren(makeColors(["&7The API is not available", `&8${address}`]));
                count.innerText = "";
            });
        }

        this.appendChild(server);
        this._rendered = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case "displayname":
                const nameEl = this.getElementsByClassName("mc-server-plate-name")[0];
                if (newValue) {
                    nameEl.replaceChildren(makeColors([newValue]))
                } else {
                    nameEl.innerText = "Minecraft Server";
                }
                break;
            case "address":
                this.innerHTML = "";
                this._rendered = false;
                this.render();
                break;
        }
    }
}

customElements.define("mc-server-plate", MCServerPlate);
console.log("This page uses MCServerPlate.js!");
