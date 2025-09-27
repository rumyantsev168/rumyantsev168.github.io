// add a horizontal line separator inside header
const header = document.getElementsByTagName("header")[0];
let hr = document.createElement("hr");
hr.setAttribute("size", "1px");
header.appendChild(hr);

// add footer inside main container (except for index.html)
const main = document.getElementsByTagName("main")[0];
let path = document.location.pathname.split("/");
console.log(path);
let footer = document.createElement("footer");
footer.className = "text-center";
if (path.at(-2) == "tests") {
    if (path.at(-1) == "index.html") { footer.innerHTML = '<small><a href="..index.html">Back to Homepage</a></small>' }
    else { footer.innerHTML = '<small><a href="index.html">Back to Tests</a></small>' };
} else if (path.at(-1) !== "index.html") { footer.innerHTML = '<small><a href="index.html">Back to Homepage</a></small>' };
main.appendChild(footer);
