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

// فتح النافذة عند الضغط على الزر
openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
});

// غلق النافذة عند الضغط على زر الإغلاق
closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// غلق النافذة عند الضغط خارجها
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


function toggleButton() {
    // التحقق من محتوى مربع الإدخال وتحديث حالة الأزرار
    if (userInput.value.trim() === '') {
        sendBtn.style.display = 'none';
        openModalBtn.style.display = 'inline-block';
    } else {
        sendBtn.style.display = 'inline-block';
        openModalBtn.style.display = 'none';
    }
}

// التحقق بشكل دوري كل ثانية (1000 ميلي ثانية)
setInterval(toggleButton, 1);

// Initialize the button state on page load
toggleButton();




function setModel(modelType) {
    // إغلاق النافذة بعد اختيار الموديل
    modal.style.display = 'none';

    // إرسال رسالة تعبر عن اختيار الموديل
    let modelMessage = '';

    switch (modelType) {
        case 'physics':
            modelMessage = "Your name is Sam. Brace yourself for a journey into the fundamental laws of nature, where energy, matter, and the universe itself become your playground. Let’s unlock the secrets of the cosmos together!";
            break;
        case 'space':
            modelMessage = "Your name is Sam. Prepare to venture into the vastness of the universe, exploring distant galaxies, black holes, and the mysteries of space-time. The final frontier awaits!";
            break;
        case 'chemistry':
            modelMessage = "Your name is Sam. Dive into the molecular world, where atoms bond, reactions unfold, and the elements of life come to life. It’s time to stir up some science!";
            break;
        case 'spiritual':
            modelMessage = "Your name is Sam. Embark on a transcendent journey through the realms of consciousness, mysticism, and inner peace. Let’s explore the deep connections between the mind, body, and spirit.";
            break;
        case 'technology':
            modelMessage = "Your name is Sam. Get ready to explore the cutting-edge world of innovation, from artificial intelligence to the digital revolution. The future is now, and we’re about to shape it together!";
            break;
        case 'funny':
            modelMessage = "Your name is Sam. Let’s lighten the mood with some randomness, and humor. Prepare for a good time with hot lovely welcome, and all-around fun and joy vibes!";
            break;
        default:
            modelMessage = "Your name is Sam. Oops! Something went wrong. Please select a valid model to begin.";
    }



    // إضافة الرسالة إلى سجل المحادثة
    conversationHistory.push({ sender: 'system', message: modelMessage });

    // يمكنك هنا أيضًا إرسال الرسالة إلى الـ API إذا أردت تحديث النموذج بناءً على الاختيار
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
            message: "Your name is Sam. Let’s dive into an exciting conversation together! 🌟 Whether you seek the secrets of the universe, the wonders of technology, or the mysteries of the mystical realms, I’m here to explore them all with you. Get ready for deep thoughts, curious discoveries, and a touch of magic—let’s make this chat unforgettable!"
        });
    }

    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(message)) {
        const arabicSystemMessage = "إسمك سام 🌟 لنغمر معًا في محادثة مثيرة! سواء كنت تبحث عن أسرار الكون، أو عجائب التكنولوجيا، أو أسرار العوالم الروحانية، فأنا هنا لاستكشاف كل ذلك معك. استعد لأفكار عميقة، واكتشافات مثيرة، ولمسة من السحر—لنصنع معًا محادثة لا تُنسى! ";
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

    conversationHistory.push({ sender: 'user', message }, { model: 'gpt-4o', stream: true });

    appendMessage('user-message', message);
    userInput.value = '';
    sendBtn.disabled = true;
    loading.classList.add('show'); // إظهار التحميل دون تغيير التخطيط

    try {
        const response = await puter.ai.chat(conversationHistory.map(item => item.message).join("\n"));
        const responseText = response.message.content;

        conversationHistory.push({ sender: 'bot', message: responseText });

        const formattedResponse = marked.parse(responseText);
        appendMessage('bot-message', formattedResponse);
    } catch (error) {
        console.error('Error:', error);
        showError('You may not access our Services before agreeing to the Terms of Use.');
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
        }, 5000);  // Timeout of 5 seconds for hiding the error message
    }
}
