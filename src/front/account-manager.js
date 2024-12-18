class AccountManager {
    constructor() {
        // Initialize accounts storage if not exists
        if (!localStorage.getItem('accountProfiles')) {
            localStorage.setItem('accountProfiles', JSON.stringify({}));
        }
        
        // Initialize authenticated channels storage
        if (!localStorage.getItem('authenticatedChannels')) {
            localStorage.setItem('authenticatedChannels', JSON.stringify({}));
        }

        // Initialize input history storage
        if (!localStorage.getItem('inputHistory')) {
            localStorage.setItem('inputHistory', JSON.stringify({}));
        }
    }

    // Create a new account profile
    createAccountProfile(accountId) {
        const accountProfiles = this.getAccountProfiles();
        
        if (!accountProfiles[accountId]) {
            accountProfiles[accountId] = {
                chatHistory: [],
                browserHistory: [],
                settings: {}
            };
            
            this.saveAccountProfiles(accountProfiles);
        }
        
        return accountProfiles[accountId];
    }

    // Switch active account
    switchAccount(fromAccountId, toAccountId) {
        const accountProfiles = this.getAccountProfiles();
        
        // Ensure target account exists
        if (!accountProfiles[toAccountId]) {
            this.createAccountProfile(toAccountId);
        }
        
        // Update active account in local storage
        localStorage.setItem('activeAccount', toAccountId);
        
        // Trigger account switch event
        const event = new CustomEvent('accountSwitch', { 
            detail: { 
                fromAccount: fromAccountId, 
                toAccount: toAccountId 
            } 
        });
        document.dispatchEvent(event);
        
        return accountProfiles[toAccountId];
    }

    // Get current active account
    getActiveAccount() {
        return localStorage.getItem('activeAccount') || null;
    }

    // Get all account profiles
    getAccountProfiles() {
        return JSON.parse(localStorage.getItem('accountProfiles') || '{}');
    }

    // Save account profiles
    saveAccountProfiles(profiles) {
        localStorage.setItem('accountProfiles', JSON.stringify(profiles));
    }

    // Add chat message to current account's history
    addChatMessage(message, isUser = true) {
        const activeAccount = this.getActiveAccount();
        if (!activeAccount) return;

        const accountProfiles = this.getAccountProfiles();
        const accountProfile = accountProfiles[activeAccount];

        accountProfile.chatHistory.push({
            message,
            isUser,
            timestamp: new Date().toISOString()
        });

        this.saveAccountProfiles(accountProfiles);
    }

    // Get chat history for current account
    getChatHistory() {
        const activeAccount = this.getActiveAccount();
        if (!activeAccount) return [];

        const accountProfiles = this.getAccountProfiles();
        return accountProfiles[activeAccount]?.chatHistory || [];
    }

    // Clear chat history for current account
    clearChatHistory() {
        const activeAccount = this.getActiveAccount();
        if (!activeAccount) return;

        const accountProfiles = this.getAccountProfiles();
        accountProfiles[activeAccount].chatHistory = [];
        this.saveAccountProfiles(accountProfiles);
    }

    // Add authenticated channel to an account
    addAuthenticatedChannel(accountId, channelInfo) {
        const authenticatedChannels = this.getAuthenticatedChannels();
        
        if (!authenticatedChannels[accountId]) {
            authenticatedChannels[accountId] = [];
        }

        // Check if channel already exists to prevent duplicates
        const existingChannelIndex = authenticatedChannels[accountId].findIndex(
            channel => channel.id === channelInfo.id
        );

        if (existingChannelIndex === -1) {
            authenticatedChannels[accountId].push({
                ...channelInfo,
                dateAdded: new Date().toISOString()
            });
        }

        localStorage.setItem('authenticatedChannels', JSON.stringify(authenticatedChannels));
        return authenticatedChannels[accountId];
    }

    // Get authenticated channels for a specific account
    getAuthenticatedChannels(accountId = null) {
        const authenticatedChannels = JSON.parse(
            localStorage.getItem('authenticatedChannels') || '{}'
        );
        
        // If no specific account is provided, use the active account
        if (!accountId) {
            accountId = this.getActiveAccount();
        }

        return authenticatedChannels[accountId] || [];
    }

    // Remove an authenticated channel
    removeAuthenticatedChannel(accountId, channelId) {
        const authenticatedChannels = this.getAuthenticatedChannels();
        
        if (authenticatedChannels[accountId]) {
            authenticatedChannels[accountId] = authenticatedChannels[accountId].filter(
                channel => channel.id !== channelId
            );
            
            localStorage.setItem('authenticatedChannels', JSON.stringify(authenticatedChannels));
        }
    }

    // Add input to history
    addInputToHistory(input, outputType, outputContent) {
        const activeAccount = this.getActiveAccount();
        if (!activeAccount) return;

        const inputHistory = this.getInputHistory();
        
        if (!inputHistory[activeAccount]) {
            inputHistory[activeAccount] = [];
        }

        const historyEntry = {
            input,
            outputType,
            outputContent,
            timestamp: new Date().toISOString()
        };

        inputHistory[activeAccount].unshift(historyEntry);

        // Limit history to last 50 entries
        inputHistory[activeAccount] = inputHistory[activeAccount].slice(0, 50);

        localStorage.setItem('inputHistory', JSON.stringify(inputHistory));
    }

    // Get input history for current account
    getInputHistory(accountId = null) {
        const inputHistory = JSON.parse(
            localStorage.getItem('inputHistory') || '{}'
        );
        
        // If no specific account is provided, use the active account
        if (!accountId) {
            accountId = this.getActiveAccount();
        }

        return inputHistory[accountId] || [];
    }

    // Group input history by date
    getGroupedInputHistory(accountId = null) {
        const history = this.getInputHistory(accountId);
        const groupedHistory = {};

        const formatDate = (date) => {
            const today = new Date();
            const inputDate = new Date(date);
            const diffDays = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Hoje';
            if (diffDays === 1) return 'Ontem';
            if (diffDays <= 7) return `${diffDays} dias atrás`;
            return new Date(date).toLocaleDateString();
        };

        history.forEach(entry => {
            const groupKey = formatDate(entry.timestamp);
            
            if (!groupedHistory[groupKey]) {
                groupedHistory[groupKey] = [];
            }
            
            groupedHistory[groupKey].push(entry);
        });

        return groupedHistory;
    }
}

// Initialize account manager
window.accountManager = new AccountManager();

// Initial account setup
document.addEventListener('DOMContentLoaded', () => {
    const initialAccounts = ['CC#2', 'CC#5'];
    initialAccounts.forEach(accountId => {
        window.accountManager.createAccountProfile(accountId);
    });

    // Set first account as default if no active account
    if (!window.accountManager.getActiveAccount()) {
        window.accountManager.switchAccount(null, initialAccounts[0]);
    }

    const webviewContainer = document.querySelector('.webview-container');
    const addAccountBtn = document.querySelector('.add-account-btn');

    // Function to render webviews for current account
    function renderWebviews() {
        const activeAccount = window.accountManager.getActiveAccount();
        const authenticatedChannels = window.accountManager.getAuthenticatedChannels(activeAccount);

        // Clear existing webviews
        webviewContainer.innerHTML = '';

        // Create webview for each authenticated channel
        authenticatedChannels.forEach(channel => {
            const webview = document.createElement('webview');
            webview.src = channel.url;
            webview.classList.add('channel-webview');
            webview.setAttribute('data-channel-id', channel.id);
            
            webviewContainer.appendChild(webview);
        });
    }

    // Add event listener for account switching
    document.addEventListener('accountSwitch', renderWebviews);

    // Add account button functionality
    addAccountBtn.addEventListener('click', () => {
        // TODO: Implement channel authentication modal/process
        const newChannel = {
            id: `channel_${Date.now()}`,
            name: 'New Channel',
            url: 'https://example.com',
            type: 'custom'
        };

        const activeAccount = window.accountManager.getActiveAccount();
        window.accountManager.addAuthenticatedChannel(activeAccount, newChannel);
        renderWebviews();
    });

    // Initial render
    renderWebviews();

    const navHistoryBtn = document.querySelector('.nav-btn[data-target="history"]');
    const chatHistoryContainer = document.querySelector('.chat-history');
    const mainContainer = document.querySelector('.main-container');
    const newChatBtn = document.querySelector('.new-chat');

    // Function to render input history
    function renderInputHistory() {
        const groupedHistory = window.accountManager.getGroupedInputHistory();
        
        // Clear existing history
        chatHistoryContainer.innerHTML = '';

        // Render grouped history
        Object.entries(groupedHistory).forEach(([groupTitle, entries]) => {
            const groupElement = document.createElement('div');
            groupElement.classList.add('chat-group');

            const groupTitleElement = document.createElement('div');
            groupTitleElement.classList.add('chat-group-title');
            groupTitleElement.textContent = groupTitle;
            groupElement.appendChild(groupTitleElement);

            entries.forEach(entry => {
                const chatItem = document.createElement('div');
                chatItem.classList.add('chat-item');
                
                const chatItemSpan = document.createElement('span');
                chatItemSpan.textContent = entry.input;
                chatItem.appendChild(chatItemSpan);

                // Add click event to restore/view history item
                chatItem.addEventListener('click', () => {
                    // TODO: Implement logic to restore or view specific history item
                    console.log('History item clicked:', entry);
                });

                groupElement.appendChild(chatItem);
            });

            chatHistoryContainer.appendChild(groupElement);
        });
    }

    // Toggle history view
    navHistoryBtn.addEventListener('click', () => {
        // Hide other containers
        document.querySelector('.chat-container').style.display = 'none';
        document.querySelector('.webview-container').style.display = 'none';
        
        // Show chat history
        chatHistoryContainer.style.display = 'block';
        newChatBtn.style.display = 'block';

        // Render history
        renderInputHistory();
    });

    // New chat button functionality
    newChatBtn.addEventListener('click', () => {
        // Hide history
        chatHistoryContainer.style.display = 'none';
        newChatBtn.style.display = 'none';

        // Show chat container
        document.querySelector('.chat-container').style.display = 'flex';
        document.querySelector('.webview-container').style.display = 'none';

        // Clear chat or prepare for new chat
        // TODO: Implement new chat initialization logic
    });

    // Example of adding input to history (you would call this when AI generates output)
    window.addInputToHistory = (input, outputType, outputContent) => {
        window.accountManager.addInputToHistory(input, outputType, outputContent);
    };
});
