// Add footer inside main container (except for index.html)
const main = document.getElementsByTagName("main")[0];
let file = document.location.pathname.split("/").at(-1);
let footer = document.createElement("footer");
footer.className = "text-center";
if (file !== "index.html" && file !== "") {
    footer.innerHTML = `<small><a href="index.html">Back to Homepage</a><small>`;
    main.appendChild(footer);
};

// Add page view counter (using GoatCounter)
const pageHeader = document.querySelector("header h1");
const viewsCount = document.createElement("span");
viewsCount.className = "views-counter";
fetch(`https://rumyantsev168.goatcounter.com/counter/${encodeURIComponent(location.pathname)}.json`)
.then(res => res.json())
.then(data => {
    viewsCount.innerText = `This page has been viewed ${data.count} times!`;
    viewsCount.title = "Stats by goatcounter.com!"
    pageHeader.after(viewsCount);
})

// Trim newline characters inside code.code-block elements
document.querySelectorAll("code.code-block").forEach(el => {
    el.innerText = el.innerText.trim();
});
