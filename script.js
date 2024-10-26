document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const nameInput = document.getElementById("name-input");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const serverInput = document.getElementById("server-input");
    const createServerBtn = document.getElementById("create-server-btn");
    const serverList = document.getElementById("server-list");
    const chatContainer = document.getElementById("chat-container");

    let currentServer = null;

    // Load existing servers from localStorage
    loadServers();

    // Create a new server
    createServerBtn.addEventListener("click", function () {
        const serverName = serverInput.value.trim();
        if (serverName) {
            const serverObj = { name: serverName, messages: [] };
            saveServer(serverObj);
            serverInput.value = ""; // Clear input
            loadServers(); // Reload servers
        }
    });

    // Send a message
    sendBtn.addEventListener("click", function () {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name && message && currentServer) {
            const messageObj = {
                name: name,
                text: message,
                timestamp: new Date().toISOString(),
            };
            // Store message in current server
            saveMessage(messageObj);
            displayMessage(messageObj);
            messageInput.value = ""; // Clear the input
        }
    });

    // Load servers from localStorage
    function loadServers() {
        const servers = JSON.parse(localStorage.getItem("chatServers")) || [];
        serverList.innerHTML = ""; // Clear current server list
        servers.forEach(displayServer);
    }

    // Display a server in the list
    function displayServer(server) {
        const serverDiv = document.createElement("div");
        serverDiv.className = "server";
        serverDiv.textContent = server.name;
        serverDiv.addEventListener("click", () => {
            currentServer = server.name;
            chatContainer.style.display = "block"; // Show chat container
            loadMessages(server.name); // Load messages for selected server
        });
        serverList.appendChild(serverDiv);
    }

    // Save a server to localStorage
    function saveServer(server) {
        const servers = JSON.parse(localStorage.getItem("chatServers")) || [];
        servers.push(server);
        localStorage.setItem("chatServers", JSON.stringify(servers));
    }

    // Load messages for the current server
    function loadMessages(serverName) {
        const servers = JSON.parse(localStorage.getItem("chatServers")) || [];
        const server = servers.find(s => s.name === serverName);
        const messages = server ? server.messages : [];
        chatBox.innerHTML = ""; // Clear chat box
        messages.forEach(displayMessage);
    }

    // Save a message to the current server
    function saveMessage(message) {
        const servers = JSON.parse(localStorage.getItem("chatServers")) || [];
        const server = servers.find(s => s.name === currentServer);
        if (server) {
            server.messages.push(message);
            localStorage.setItem("chatServers", JSON.stringify(servers));
        }
    }

    // Display a message in the chat box
    function displayMessage(message) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        messageDiv.innerHTML = `<span class="name">${message.name}:</span> <span class="text">${message.text}</span>`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }
});
