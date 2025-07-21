// This script creates the chatbot and injects it into any page.
(function() {
  // --- Create and Inject Stylesheet ---
  const tailwindLink = document.createElement('link');
  tailwindLink.href = 'https://cdn.tailwindcss.com';
  tailwindLink.rel = 'stylesheet';
  document.head.appendChild(tailwindLink);

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const customStyles = document.createElement('style');
  customStyles.innerHTML = `
    #chatbot-container { font-family: 'Inter', sans-serif; }
    @keyframes bounce-dot {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    }
    .animate-bounce-dot > div { animation: bounce-dot 1.4s infinite ease-in-out both; }
    .animate-bounce-dot .dot-1 { animation-delay: -0.32s; }
    .animate-bounce-dot .dot-2 { animation-delay: -0.16s; }
    .animate-bounce-dot .dot-3 { animation-delay: 0s; }
    #chat-messages::-webkit-scrollbar { display: none; }
    #chat-messages { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(customStyles);

  // --- Create Chatbot HTML ---
  const chatbotHTML = `
    <div id="chatbot-container" class="fixed bottom-6 right-6 z-50">
        <!-- Chat Widget -->
        <div id="chat-widget" class="hidden mb-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex-col overflow-hidden transition-all duration-300 ease-in-out">
            <!-- Header -->
            <div class="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 flex justify-between items-center flex-shrink-0">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <div class="text-slate-800 font-bold text-xl tracking-tighter">CB</div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-sm">Cambridge Bespoke</h3>
                        <p class="text-xs text-slate-200">Luxury Cabinetry Assistant</p>
                    </div>
                </div>
                <button id="close-chat-btn" class="text-slate-200 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <!-- Messages -->
            <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"></div>
            <!-- Bottom Panel -->
            <div id="bottom-panel" class="bg-white border-t border-gray-200">
                <div id="quick-actions-container" class="p-3"><div class="flex flex-wrap gap-2 mb-2"></div></div>
                
                <form id="lead-form" class="hidden p-4">
                    <h4 class="font-semibold text-sm mb-3 text-slate-800">Schedule a Consultation</h4>
                    <div class="space-y-3">
                        <input type="text" id="lead-name" name="name" placeholder="Your Name*" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" required>
                        <input type="email" id="lead-email" name="email" placeholder="Email Address*" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" required>
                        <input type="tel" id="lead-phone" name="phone" placeholder="Phone Number" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <select id="lead-project-type" name="project-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" required>
                            <option value="">Select Project Type*</option>
                            <option value="Kitchen Cabinetry">Kitchen Cabinetry</option>
                            <option value="Bathroom Vanities">Bathroom Vanities</option>
                            <option value="Built-in Storage">Built-in Storage</option>
                            <option value="Home Office">Home Office</option>
                            <option value="Freestanding Furniture">Freestanding Furniture</option>
                            <option value="Commercial Project">Commercial Project</option>
                        </select>
                        <div class="relative">
                          <textarea id="lead-message" name="message" placeholder="Brief message..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" rows="3" maxlength="1000"></textarea>
                          <div id="char-counter" class="absolute bottom-2 right-2 text-xs text-gray-400">1000</div>
                        </div>
                        <div class="flex space-x-2">
                            <button id="cancel-lead-btn" type="button" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button id="submit-lead-btn" type="submit" class="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">Submit</button>
                        </div>
                    </div>
                </form>

                <div id="input-area-container" class="p-4">
                    <div class="flex space-x-2">
                        <input type="text" id="chat-input" placeholder="Ask about our collections..." class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm" disabled>
                        <button id="send-btn" class="px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Chat Toggle Button -->
        <button id="chat-toggle-btn" class="w-16 h-16 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
            <svg id="open-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // --- Chatbot Logic ---
  const chatWidget = document.getElementById('chat-widget');
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const openIcon = document.getElementById('open-icon');
  const closeIcon = document.getElementById('close-icon');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const quickActionsContainer = document.getElementById('quick-actions-container');
  const leadForm = document.getElementById('lead-form');
  const inputAreaContainer = document.getElementById('input-area-container');
  const cancelLeadBtn = document.getElementById('cancel-lead-btn');
  const leadMessageTextarea = document.getElementById('lead-message');
  const charCounter = document.getElementById('char-counter');
  
  let isOpen = false;
  let isLoading = false;
  let messages = [];

  const initialMessage = {
      id: 1,
      type: 'assistant',
      content: "Welcome to Cambridge Bespoke! I'm here to help you explore our luxury cabinetry collections, discuss bespoke solutions, and answer any questions about our artisan craftsmanship. How may I assist you today?",
      timestamp: new Date()
  };
  
  const quickActions = [
      { text: "Kitchen Cabinetry", action: () => setInputAndSend("Tell me about your kitchen cabinetry options") },
      { text: "Micro-Luxury Collections", action: () => setInputAndSend("What are your micro-luxury collections?") },
      { text: "Bespoke Process", action: () => setInputAndSend("How does your bespoke design process work?") },
      { text: "Schedule Consultation", action: () => showLeadForm(true) }
  ];

  const toggleChat = () => {
      isOpen = !isOpen;
      chatWidget.classList.toggle('hidden', !isOpen);
      chatWidget.classList.toggle('flex', isOpen);
      openIcon.classList.toggle('hidden', isOpen);
      closeIcon.classList.toggle('hidden', !isOpen);
      if (isOpen) {
          if (messages.length === 0) messages.push(initialMessage);
          renderMessages();
          renderQuickActions();
          chatInput.disabled = false;
          chatInput.focus();
      }
  };
  
  const renderQuickActions = () => {
      const container = quickActionsContainer.querySelector('div');
      if (container) {
          container.innerHTML = '';
          quickActions.forEach(action => {
              const button = document.createElement('button');
              button.textContent = action.text;
              button.className = "px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs hover:bg-slate-200 transition-colors";
              button.onclick = action.action;
              container.appendChild(button);
          });
      }
  };

  const scrollToBottom = () => { chatMessages.scrollTop = chatMessages.scrollHeight; };

  const createMessageElement = (message) => {
      const messageWrapper = document.createElement('div');
      messageWrapper.className = `flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`;
      const messageBubble = document.createElement('div');
      messageBubble.className = `max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
          message.type === 'user' 
          ? 'bg-slate-800 text-white' 
          : 'bg-white border border-gray-200 text-gray-800'
      }`;
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'flex items-start space-x-2';
      if (message.type === 'assistant') {
          contentWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>`;
      }
      const messageText = document.createElement('p');
      messageText.className = 'text-sm leading-relaxed';
      messageText.innerHTML = message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      contentWrapper.appendChild(messageText);
      messageBubble.appendChild(contentWrapper);
      messageWrapper.appendChild(messageBubble);
      return messageWrapper;
  };
  
  const renderMessages = () => {
      chatMessages.innerHTML = '';
      messages.forEach(message => { chatMessages.appendChild(createMessageElement(message)); });
      scrollToBottom();
  };

  const showLoadingIndicator = (show) => {
      let loadingEl = document.getElementById('loading-indicator');
      if (show) {
          if (!loadingEl) {
              loadingEl = document.createElement('div');
              loadingEl.id = 'loading-indicator';
              loadingEl.className = 'flex justify-start';
              loadingEl.innerHTML = `<div class="bg-white border border-gray-200 rounded-2xl px-4 py-3"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-slate-600"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg><div class="flex space-x-1 animate-bounce-dot"><div class="w-2 h-2 bg-slate-400 rounded-full dot-1"></div><div class="w-2 h-2 bg-slate-400 rounded-full dot-2"></div><div class="w-2 h-2 bg-slate-400 rounded-full dot-3"></div></div></div></div>`;
              chatMessages.appendChild(loadingEl);
              scrollToBottom();
          }
      } else if (loadingEl) {
          loadingEl.remove();
      }
  };

  const setInputAndSend = (text) => { handleSendMessage(text, true); };
  
  const showLeadForm = (show) => {
      leadForm.classList.toggle('hidden', !show);
      inputAreaContainer.classList.toggle('hidden', show);
      quickActionsContainer.classList.toggle('hidden', show);
      if(!show) renderQuickActions();
  };

  const handleLeadSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(leadForm);
      const name = formData.get('name');
      
      const formspreeEndpoint = "https://formspree.io/f/xrblevaq";

      try {
          await fetch(formspreeEndpoint, {
              method: "POST",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(Object.fromEntries(formData)),
          });
          
          const leadMessage = {
              id: Date.now(),
              type: 'assistant',
              content: `Thank you, ${name}! Your request has been sent. Our design team will be in touch within 24 hours.`,
              timestamp: new Date()
          };
          messages.push(leadMessage);
          renderMessages();
          showLeadForm(false);
          leadForm.reset();
          charCounter.textContent = '1000'; // Reset counter

      } catch (error) {
          const errorMessage = {
              id: Date.now(),
              type: 'assistant',
              content: `We're sorry, there was an error sending your request. Please try again later.`,
              timestamp: new Date()
          };
          messages.push(errorMessage);
          renderMessages();
      }
  };
  
  const handleSendMessage = async (messageContent, isQuickAction = false) => {
      const inputMessage = messageContent || chatInput.value.trim();
      if (!inputMessage || isLoading) return;
      const userMessage = { id: Date.now(), type: 'user', content: inputMessage, timestamp: new Date() };
      messages.push(userMessage);
      renderMessages();
      if (!isQuickAction) chatInput.value = '';
      isLoading = true;
      chatInput.disabled = true;
      sendBtn.disabled = true;
      showLoadingIndicator(true);
      if (quickActionsContainer.querySelector('div')) {
          quickActionsContainer.querySelector('div').innerHTML = '';
      }
      try {
          let chatHistory = messages.slice(-10).map(msg => ({
              role: msg.type === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
          }));

          const functionUrl = 'https://harmonious-donut-350394.netlify.app/.netlify/functions/gemini';
          const response = await fetch(functionUrl, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ chatHistory }),
          });
          if (!response.ok) throw new Error(`Server function failed with status ${response.status}`);
          const result = await response.json();
          let assistantResponse = "I apologize, but I couldn't generate a response. Please try again.";
          if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
              assistantResponse = result.candidates[0].content.parts[0].text;
          }
          const assistantMessage = { id: Date.now() + 1, type: 'assistant', content: assistantResponse, timestamp: new Date() };
          messages.push(assistantMessage);
      } catch (error) {
          console.error('Error sending message:', error);
          const errorMessage = { id: Date.now() + 1, type: 'assistant', content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.", timestamp: new Date() };
          messages.push(errorMessage);
      } finally {
          isLoading = false;
          chatInput.disabled = false;
          sendBtn.disabled = false;
          showLoadingIndicator(false);
          renderMessages();
          if (leadForm.classList.contains('hidden')) {
              renderQuickActions();
          }
          chatInput.focus();
      }
  };
  
  // --- Event Listeners ---
  chatToggleBtn.addEventListener('click', toggleChat);
  closeChatBtn.addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', () => handleSendMessage());
  chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
      }
  });
  cancelLeadBtn.addEventListener('click', () => showLeadForm(false));
  leadForm.addEventListener('submit', handleLeadSubmit);
  leadMessageTextarea.addEventListener('input', () => {
    const remaining = leadMessageTextarea.maxLength - leadMessageTextarea.value.length;
    charCounter.textContent = remaining;
  });

})();
