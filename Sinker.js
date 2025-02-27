const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const loading = document.getElementById('loading');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('model-modal');
let conversationHistory = [];

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


function toggleButton() {
    if (userInput.value.trim() === '') {
        sendBtn.style.display = 'none';
        openModalBtn.style.display = 'inline-block';
    } else {
        sendBtn.style.display = 'inline-block';
        openModalBtn.style.display = 'none';
    }
}

setInterval(toggleButton, 1);

toggleButton();




function setModel(modelType) {
    modal.style.display = 'none';

    let modelMessage = '';

    switch (modelType) {
        case 'physics':
            modelMessage = "Brace yourself for a journey into the fundamental laws of nature, where energy, matter, and the universe itself become your playground. Let’s unlock the secrets of the cosmos together!";
            break;
        case 'space':
            modelMessage = "Prepare to venture into the vastness of the universe, exploring distant galaxies, black holes, and the mysteries of space-time. The final frontier awaits!";
            break;
        case 'chemistry':
            modelMessage = "Dive into the molecular world, where atoms bond, reactions unfold, and the elements of life come to life. It’s time to stir up some science!";
            break;
        case 'spiritual':
            modelMessage = "Embark on a transcendent journey through the realms of consciousness, mysticism, and inner peace. Let’s explore the deep connections between the mind, body, and spirit.";
            break;
        case 'technology':
            modelMessage = "Get ready to explore the cutting-edge world of innovation, from artificial intelligence to the digital revolution. The future is now, and we’re about to shape it together!";
            break;
        case 'funny':
            modelMessage = "Let’s lighten the mood with some randomness, and humor. Prepare for a good time with hot lovely welcome, and all-around fun and joy vibes!";
            break;
        case 'history':
            modelMessage = "Step into the time machine as we explore the rich tapestry of human history, from ancient civilizations to modern revolutions. Let’s uncover the stories that shaped our world!";
            break;
        case 'biology':
            modelMessage = "Delve into the wonders of life, from the tiniest cells to the most complex ecosystems. Let’s explore the intricate web of life together!";
            break;
        case 'art':
            modelMessage = "Immerse yourself in the world of creativity, where colors, shapes, and emotions come together to tell stories. Let’s explore the beauty of human expression!";
            break;
        case 'music':
            modelMessage = "Tune into the universal language of music, where melodies, rhythms, and harmonies create a symphony of emotions. Let’s explore the soundscape of the soul!";
            break;
        case 'literature':
            modelMessage = "Open the pages of great works, where words weave tales of love, adventure, and wisdom. Let’s embark on a literary journey through the ages!";
            break;
        default:
            modelMessage = "Oops! Something went wrong. Please select a valid model to begin.";
    }



    conversationHistory.push({ sender: 'system', message: modelMessage });

    console.log(`Model selected: ${modelType}`);
}

async function sendMessage() {
    const message = userInput.value.trim();

    showError('');

    if (message === '') {
        showError('Invalid text value.');
        return;
    }

    if (conversationHistory.length === 0) {
        conversationHistory.push({
            sender: 'system',
            message: "Let’s dive into an exciting conversation together! 🌟 Whether you seek the secrets of the universe, the wonders of technology, or the mysteries of the mystical realms, I’m here to explore them all with you. Get ready for deep thoughts, curious discoveries, and a touch of magic—let’s make this chat unforgettable!"
        });
    }

    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(message)) {
        const arabicSystemMessage = "🌟 لنغمر معًا في محادثة مثيرة! سواء كنت تبحث عن أسرار الكون، أو عجائب التكنولوجيا، أو أسرار العوالم الروحانية، فأنا هنا لاستكشاف كل ذلك معك. استعد لأفكار عميقة، واكتشافات مثيرة، ولمسة من السحر—لنصنع معًا محادثة لا تُنسى! ";
        const alreadyAdded = conversationHistory.some(
            item => item.sender === 'system' && item.message === arabicSystemMessage
        );

        if (!alreadyAdded) {
            conversationHistory.push({
                sender: 'system',
                message: arabicSystemMessage
            });
        }
    }

    conversationHistory.push({ sender: 'user', message }, { model: 'grok-beta', stream: true });

    appendMessage('user-message', message);
    userInput.value = '';
    sendBtn.disabled = true;
    loading.classList.add('show');

    try {
        const response = await puter.ai.chat(conversationHistory.map(item => item.message).join("\n"));
        const responseText = response.message.content;

        conversationHistory.push({ sender: 'bot', message: responseText });

        const formattedResponse = marked.parse(responseText);
        appendMessage('bot-message', formattedResponse);
    } catch (error) {
        console.error('Error:', error);
        showError('It seems there is an issue with your connection to our server. Please reload the page or try again later.');
    } finally {
        sendBtn.disabled = false;
        loading.classList.remove('show');
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function appendMessage(className, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;

    const isArabic = /[\u0600-\u06FF]/.test(message);
    messageElement.style.fontFamily = isArabic ? 'Cairo, sans-serif' : 'inherit';
    messageElement.style.direction = isArabic ? 'rtl' : 'ltr';
    messageElement.style.textAlign = isArabic ? 'right' : 'left';

    if (className === 'bot-message') {
        messageElement.innerHTML = message;
        chatBox.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
    } else {
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

function showError(message) {
    const erBox = document.getElementById('error-message');

    if (message === '') {
        erBox.style.display = 'none';
    } else {
        erBox.textContent = message;
        erBox.style.display = 'block';

        setTimeout(() => {
            erBox.style.display = 'none';
        }, 5000);
    }
}
