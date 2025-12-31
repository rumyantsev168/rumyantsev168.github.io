// Adds footer inside main container (except for index.html)
const main = document.getElementsByTagName("main")[0];
let file = document.location.pathname.split("/").at(-1);
let footer = document.createElement("footer");
footer.className = "text-center";
if (file !== "index.html" && file !== "") {
    footer.innerHTML = `<small><a href="index.html">Back to Homepage</a><small>`;
    main.appendChild(footer);
};
