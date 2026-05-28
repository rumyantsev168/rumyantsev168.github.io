const fullMotd = "Visit my website!";
const fullTemplate = `
<div class="rumyantsev168-widget">
    <div class="rumyantsev168-widget-center">
        <a href="https://rumyantsev168.github.io" class="disguised-a">
            <h3>rumyantsev168.github.io</h3>
        </a>
        <small>${fullMotd}</small>
    </div>
    <h4>Featured pages:</h4>
    <ul>
        <li><a href="https://rumyantsev168.github.io/uri.html">URI Encoder/Decoder</a></li>        
        <li><a href="https://rumyantsev168.github.io/binary.html">Text to Binary Converter</a></li>        
        <li><a href="https://rumyantsev168.github.io/charcount.html">Character Counter</a></li>        
        <li><a href="https://rumyantsev168.github.io/keylogger.html">Key Logger</a></li>        
    </ul>
</div>
`;

const smallMotd = fullMotd;
const smallTemplate = `
<div class="rumyantsev168-widget">
    <div class="rumyantsev168-widget-center">
        <a href="https://rumyantsev168.github.io" class="disguised-a">
            <h3>rumyantsev168.github.io</h3>
        </a>
        <small>${smallMotd}</small>
    </div>
</div>
`;

function getStyles(theme) {
    return `
    <style>
        :host { display: inline-block; width: fit-content; height: fit-content; }
        .rumyantsev168-widget {
            display: flex;
            flex-direction: column;
            gap: 5px;
            border: 2px solid;
            border-radius: none;
            font-family: 'Times New Roman', Times, serif;
            width: 200px;
            height: fit-content;
            margin: 0px;
            padding: 10px;
            cursor: default;
        }
        .rumyantsev168-widget h1,
        .rumyantsev168-widget h2, 
        .rumyantsev168-widget h3, 
        .rumyantsev168-widget h4, 
        .rumyantsev168-widget h5, 
        .rumyantsev168-widget h6 {
            margin: 0px;
        }
        .rumyantsev168-widget p {
            margin: 5px 0px 0px 0px;
        }
        .rumyantsev168-widget ul {
            margin: 0px;
            padding: 0px 0px 0px 20px;
        }
        .rumyantsev168-widget-center {
            text-align: center;
        }
        a.disguised-a { text-decoration: none }
        ${theme === "light" || theme === "auto" ? `
        @media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
            .rumyantsev168-widget { background: white; color: black; border-color: lightgray; }
            .rumyantsev168-widget a.disguised-a { color: black }
        }`
        : ""}
        ${theme === "dark" || theme === "auto" ? `
        @media (prefers-color-scheme: dark) {
            .rumyantsev168-widget { background: #1a1a1a; color: white; border-color: gray; }
            .rumyantsev168-widget a { color: #6ea2ff; }
            .rumyantsev168-widget a.disguised-a { color: white }
        }`
        : ""}
        ${theme === "light" ? `
        .rumyantsev168-widget { background: white; color: black; border-color: lightgray; }
        .rumyantsev168-widget a.disguised-a { color: black }
        `
        : ""}
        ${theme === "dark" ? `
        .rumyantsev168-widget { background: #1a1a1a; color: white; border-color: gray; }
        .rumyantsev168-widget a { color: #6ea2ff; }
        .rumyantsev168-widget a.disguised-a { color: white }
        `
        : ""}
    </style>
    `;
}

class Widget extends HTMLElement {
    constructor() {
        super();
    };

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        
        let size = this.getAttribute("size");
        if (size !== "full" && size !== "small") {
            console.warn(`rumyantsev168.github.io: Invalid widget size '${size}'! Using 'full' size as default.`);
            size = "full";
        }
        
        let theme = this.getAttribute("theme");
        if (theme !== "light" && theme !== "dark" && theme !== "auto") {
            console.warn(`rumyantsev168.github.io: Invalid widget theme '${theme}'! Using 'auto' theme as default.`);
            theme = "auto";
        }
        
        let template;
        if (size == "full") {
            template = fullTemplate;
        } else if (size == "small") {
            template = smallTemplate;
        }

        shadow.innerHTML = getStyles(theme) + template;
    }
}

customElements.define("rumyantsev168-widget", Widget);
