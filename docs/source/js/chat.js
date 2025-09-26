const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
const chatClearAll = document.getElementById("chat-clear-all");
const adminCheck = document.getElementById("adminChk");

document.addEventListener("keydown", () => enter(event, chatInput, chatOutput));
chatClearAll.addEventListener("click", () => clear(chatInput, chatOutput));

function enter(event, chatInput, chatOutput) {
    if (event.keyCode == 13) {
        if (!chatInput) return;
        let outputLine = document.createElement("p");
        outputLine.style.margin = "0px";
        if (adminCheck.checked) {
            outputLine.style.color = "#dd0000";
            outputLine.className = "admin";
        } else { outputLine.className = "user" };
        var newDate = new Date();
        Date.prototype.today = function() {
            return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
        };
        Date.prototype.timeNow = function() {
             return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
        };
        outputLine.title = `Sent on ${newDate.today()} at ${newDate.timeNow()}`;
        outputLine.innerText = chatInput.value;
        chatOutput.insertBefore(outputLine, chatOutput.childNodes[0]);
        chatInput.value = "";
    };
};

function clear(chatInput, chatOutput) {
    chatInput.value = "";
    chatOutput.innerHTML = "";
};