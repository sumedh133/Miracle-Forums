const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector("#minimize");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const micBtn=document.querySelector('#mic-btn');
// const postDataElement = document.getElementById('post-data');
// const postTitle = postDataElement.getAttribute('data-title');
// const postDescription = postDataElement.getAttribute('data-description');

let userMessage = ""; 
let conversationHistory = [];

const addMessageToHistory = (message, type) => {
    conversationHistory.push({
        message: message,
        type: type, 
    });
};
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const resetBtn = document.querySelector(".reset-btn");

resetBtn.addEventListener("click", () => {
    chatbox.innerHTML = ""; 
    const initialMessage = "Hi there, FactFinder here... \nHow can I help you today?";
    conversationHistory=[];
    const initialMessageElement = createChatLi(initialMessage, "incoming");
    chatbox.appendChild(initialMessageElement);
}); 

const generateResponse = (chatElement) => {
    const thinkingMessage = chatElement.querySelector("p");
    thinkingMessage.textContent = "Thinking";
    let dots = 0;

    const intervalId = setInterval(() => {
        dots = (dots + 1) % 4; 
        thinkingMessage.textContent = "Thinking" + ".".repeat(dots); 
    }, 400); 

    fetch('https://check-production-bddb.up.railway.app//misinfo_chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post_title: postTitle,
            post_content: postDescription, 
            query: userMessage,
            conversation_history: conversationHistory
        })
    }).then(response => {
        return new Promise(resolve => setTimeout(resolve, 2000)).then(() => response.json());
    }).then(data => {
        clearInterval(intervalId); 
        if (data && data.response) {
            thinkingMessage.textContent = data.response; 
            addMessageToHistory(data.response, "bot");
            chatbox.scrollTo(0, chatbox.scrollHeight);
        } else {
            console.error("Invalid response format or missing 'response' property.");
            thinkingMessage.textContent = "Sorry, I couldn't process your request.";
        }
    }).catch(error => {
        clearInterval(intervalId); 
        console.error('Error:', error);
        thinkingMessage.textContent = "An error occurred. Please try again.";
    });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    addMessageToHistory(userMessage, "user");
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 400);
}

const toggleMicBtn = (active) => {
    if (active) {
        micBtn.style.color = 'green'; 
    } else {
        micBtn.style.color = 'blue'; 
    }
};

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (typeof window.SpeechRecognition === 'undefined') {
    console.log('Sorry, your browser does not support Speech Recognition.');
} else {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        chatInput.value = transcript;
    });

    recognition.addEventListener('start', () => {
        toggleMicBtn(true); 
    });

    recognition.addEventListener('end', () => {
        toggleMicBtn(false); 
    });

    micBtn.addEventListener('click', () => {
        if (recognition && recognition.recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", () => {
    handleChat();
});

closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot")); 

