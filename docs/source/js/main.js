// add a horizontal line separator inside header
const header = document.getElementsByTagName("header")[0];
let hr = document.createElement("hr");
hr.setAttribute("size", "1px");
header.appendChild(hr);

// add footer inside main container (except for index.html)
const main = document.getElementsByTagName("main")[0];
let path = document.location.pathname.split("/");
let folder = path.at(-2);
let file = path.at(-1);
let footer = document.createElement("footer");
footer.className = "text-center";
if (folder == "test") {
    if (file == "index.html") {
        footer.innerHTML = '<small><a href="../index.html">Back to Homepage</a></small>';
    } else {
        footer.innerHTML = '<small><a href="index.html">Back to Tests</a></small>';
    };
} else {
    if (file !== "index.html" || file !== "") {
        footer.innerHTML = '<small><a href="index.html">Back to Homepage</a></small>';
    };
};
if (footer.innerHTML) {
    main.appendChild(footer);
};
