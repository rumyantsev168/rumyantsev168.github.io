const chatContainer = document.getElementById("chat-container");
const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
const adminCheck = document.getElementById("admin-chk");

function enter(e) {
    e.preventDefault();
    if (!chatInput.value) return;
    let outputLine = document.createElement("p");
    outputLine.style.margin = "0px";
    if (adminCheck.checked) {
        outputLine.style.color = "#dd0000";
        outputLine.className = "admin";
    } else {
        outputLine.className = "user";
    };
    outputLine.title = new Date().toLocaleString();
    outputLine.innerText = chatInput.value;
    chatOutput.insertBefore(outputLine, chatOutput.childNodes[0]);
    chatInput.value = "";
};

function clear() {
    chatInput.value = "";
    chatOutput.innerHTML = "";
};