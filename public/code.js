document.addEventListener("DOMContentLoaded", function() {
    const app = document.querySelector(".app");
    const socket = io();
    let username;

    app.querySelector("#join-user").addEventListener("click", function() {
    username = app.querySelector("#username").value.trim();
    if (username !== '') {
        socket.emit("newuser", username);
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    }
    });

    app.querySelector("#send-message").addEventListener("click", function() {
    const messageInput = app.querySelector("#message-input");
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit("chat", { sender: username, text: message });
        messageInput.value = '';
        renderMessage("my", { sender: username, text: message });
    }
    });

    app.querySelector("#exit-chat").addEventListener("click", function() {
    socket.emit("exituser", username);
    app.querySelector(".chat-screen").classList.remove("active");
    app.querySelector(".join-screen").classList.add("active");
    });

    socket.on("update", function(updateMessage) {
    renderMessage("update", updateMessage);
    });

    socket.on("chat", function(message) {
    if (message.sender === username) {
        renderMessage("my", message);
    } else {
        renderMessage("other", message);
    }
    });

    socket.on("user joined", function(message) {
    console.log("User joined:", message); 
    renderMessage("update", message);
});

socket.on("user left", function(message) {
    console.log("User left:", message); 
    renderMessage("update", message);
});

function renderMessage(type, content) {
    const messagesContainer = document.querySelector(".messages");
    
        if (type === "other") {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            messageDiv.classList.add("other-message");
    
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("name");
            nameDiv.textContent = content.sender;
    
            const textDiv = document.createElement("div");
            textDiv.classList.add("text");
            textDiv.textContent = content.text;
    
            messageDiv.appendChild(nameDiv);
            messageDiv.appendChild(textDiv);
            messagesContainer.appendChild(messageDiv);
        } else if (type === "my") {
            
            const existingMyMessages = document.querySelectorAll(".my-message .text");
            let alreadyRendered = false;
    
            existingMyMessages.forEach(existingMessage => {
                if (existingMessage.textContent === content.text) {
                    alreadyRendered = true;
                }
            });
    
            if (!alreadyRendered) {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message");
                messageDiv.classList.add("my-message");
    
                const nameDiv = document.createElement("div");
                nameDiv.classList.add("name");
                nameDiv.textContent = "You"; 
    
                const textDiv = document.createElement("div");
                textDiv.classList.add("text");
                textDiv.textContent = content.text;
    
                messageDiv.appendChild(nameDiv);
                messageDiv.appendChild(textDiv);
                messagesContainer.appendChild(messageDiv);
            }
        }
        else if (type === "update") {
            const systemDiv = document.createElement("div");
            systemDiv.classList.add("system-message");
            systemDiv.textContent = content.text;
        
            messagesContainer.appendChild(systemDiv);
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

});