const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userinput");
const sendBtn = document.getElementById("sendBtn");
const fileInput = document.getElementById("fileInput");
const fileUpload = document.getElementById("fileUpload");

function addMessage(msg, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(className);
    msgDiv.innerHTML = marked.parse(msg);
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function showTyping(){
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("botmsg");
    typingDiv.textContent = "Analyzing your query...";
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    return typingDiv;
}

sendBtn.onclick = async () => {
    const msg = userInput.value.trim();
    if(msg === "") return;
    addMessage(msg, "usermsg"); 
    userInput.value = "";
    const typingDiv = showTyping();  
    
    const botReply = await getBotReply(msg);
    typingDiv.remove();
    addMessage(botReply, "botmsg");

    localStorage.setItem("chatHistory", chatbox.innerHTML);
}

function addImagePreview(base64) {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("usermsg");

    const img = document.createElement("img");
    img.src = base64;
    img.style.maxWidth = "200px";
    img.style.borderRadius = "12px";
    img.style.display = "block";

    imgDiv.appendChild(img);
    chatbox.appendChild(imgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

userInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") sendBtn.click();
})

async function getBotReply(msg) {
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: msg,
                image: uploadedImageBase64,
                mimeType: uploadedImageMime 
            })
        });

        const data = await res.json();

        uploadedImageBase64 = null;
        uploadedImagePreview = null;
        uploadedImageMime = null;
        fileInput.value = "";

        return data.reply;

    } catch {
        return "❌ Server error.";
    }
}


let uploadedImageBase64 = null;
let uploadedImagePreview = null;
let uploadedImageMime = null;

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
        alert("Image too large (max 4MB)");
        fileInput.value = "";
        return;
    }

    uploadedImageMime = file.type;

    const reader = new FileReader();
    reader.onload = () => {
        uploadedImagePreview = reader.result;         
        uploadedImageBase64 = reader.result.split(",")[1]; 

        addImagePreview(uploadedImagePreview); 
    };

    reader.readAsDataURL(file);
});

fileUpload.addEventListener("click", () => fileInput.click())