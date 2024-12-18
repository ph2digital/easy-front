class ChatInterface {
    constructor() {
        console.error('ChatInterface constructor started');
        
        // Log all potential selectors
        console.error('Potential Selectors:', {
            chatContainerQuery1: document.querySelector('.chat-container'),
            chatContainerQuery2: document.querySelector('#chatContent .chat-container'),
            welcomeScreenQuery1: document.querySelector('.welcome-screen'),
            welcomeScreenQuery2: document.querySelector('#chatContent .welcome-screen'),
            textareaQuery1: document.querySelector('.input-box textarea'),
            textareaQuery2: document.querySelector('#chatContent .input-box textarea'),
            sendButtonQuery1: document.querySelector('.send-button'),
            sendButtonQuery2: document.querySelector('#chatContent .send-button')
        });
        
        // Use multiple selector strategies
        this.chatContainer = document.querySelector('#chatContent .chat-container') || document.querySelector('.chat-container');
        this.welcomeScreen = document.querySelector('#chatContent .welcome-screen') || document.querySelector('.welcome-screen');
        this.textarea = document.querySelector('#chatContent .input-box textarea') || document.querySelector('.input-box textarea');
        this.sendButton = document.querySelector('#chatContent .send-button') || document.querySelector('.send-button');
        
        console.error('ChatInterface elements:', {
            chatContainer: !!this.chatContainer,
            welcomeScreen: !!this.welcomeScreen,
            textarea: !!this.textarea,
            sendButton: !!this.sendButton
        });
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.error('Setting up event listeners');
        
        if (!this.sendButton) {
            console.error('CRITICAL: Send button not found');
            // Try to find send button again
            this.sendButton = document.querySelector('.send-button');
            if (!this.sendButton) {
                console.error('ABSOLUTELY CRITICAL: Send button STILL not found');
                return;
            }
        }

        // Remove any existing listeners first
        this.sendButton.removeEventListener('click', this.sendMessage);
        this.sendButton.addEventListener('click', () => {
            console.error('Send button clicked');
            this.sendMessage();
        });

        if (!this.textarea) {
            console.error('CRITICAL: Textarea not found');
            // Try to find textarea again
            this.textarea = document.querySelector('.input-box textarea');
            if (!this.textarea) {
                console.error('ABSOLUTELY CRITICAL: Textarea STILL not found');
                return;
            }
        }

        this.textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    sendMessage() {
        console.error('sendMessage method called');
        
        if (!this.textarea) {
            console.error('Textarea is null, attempting to find textarea');
            this.textarea = document.querySelector('.input-box textarea');
            if (!this.textarea) {
                console.error('Cannot find textarea');
                return;
            }
        }

        const message = this.textarea.value.trim();
        console.error('Message to send:', message);
        
        if (!message) {
            console.error('No message to send');
            return;
        }

        // Remove welcome screen
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }

        // Ensure chat container exists
        if (!this.chatContainer) {
            this.chatContainer = document.querySelector('.chat-container');
            if (!this.chatContainer) {
                console.error('Cannot find chat container');
                return;
            }
        }

        // Add user message
        this.addMessage(message, 'user');

        // Clear textarea
        this.textarea.value = '';

        // Show typing indicator
        const typingIndicator = this.showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            console.error('Generating AI response');
            
            // Remove typing indicator
            this.removeTypingIndicator(typingIndicator);

            // Add AI response
            const aiResponse = this.generateAIResponse(message);
            console.error('AI Response:', aiResponse);
            this.addMessageWithTypingAnimation(aiResponse, 'ai');
        }, 1500);
    }

    addMessage(text, type) {
        console.error(`Adding ${type} message:`, text);
        
        if (!this.chatContainer) {
            this.chatContainer = document.querySelector('.chat-container');
            if (!this.chatContainer) {
                console.error('Chat container not found');
                return;
            }
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${type}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.textContent = text;
        messageElement.appendChild(messageContent);

        this.chatContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    addMessageWithTypingAnimation(text, type) {
        console.error(`Adding ${type} message with typing animation:`, text);
        
        if (!this.chatContainer) {
            this.chatContainer = document.querySelector('.chat-container');
            if (!this.chatContainer) {
                console.error('Chat container not found');
                return;
            }
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${type}-message`);
        
        const messageContent = document.createElement('div');
        messageElement.appendChild(messageContent);
        this.chatContainer.appendChild(messageElement);

        // Typing animation
        this.typeText(messageContent, text);
    }

    async typeText(element, text, speed = 20) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
        this.scrollToBottom();
    }

    showTypingIndicator() {
        console.error('Showing typing indicator');
        
        if (!this.chatContainer) {
            this.chatContainer = document.querySelector('.chat-container');
            if (!this.chatContainer) {
                console.error('Chat container not found');
                return null;
            }
        }

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        this.chatContainer.appendChild(typingIndicator);
        this.scrollToBottom();
        return typingIndicator;
    }

    removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    scrollToBottom() {
        if (this.chatContainer) {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    generateAIResponse(message) {
        const responses = [
            'Entendi sua solicitação. Vou ajudar você a desenvolver uma estratégia eficaz.',
            'Interessante pergunta! Vamos analisar os detalhes com cuidado.',
            'Baseado no seu input, aqui estão algumas sugestões para otimizar seus resultados.',
            'Vou preparar um resumo detalhado sobre o tema que você mencionou.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chat interface when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.error('DOM fully loaded, attempting to initialize ChatInterface');
    try {
        window.chatInterface = new ChatInterface();
        console.error('ChatInterface initialized successfully');
    } catch (error) {
        console.error('Failed to initialize ChatInterface:', error);
    }
});
