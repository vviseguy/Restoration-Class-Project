// background.js

// Function to handle the selection and make API request
function handleTextSelection(info, tab) {
    const selectedText = info.selectionText;
  
    // Send a message to content script to show loading overlay
    chrome.tabs.sendMessage(tab.id, { action: 'showLoadingOverlay' });
  
    // Fetch the selected model from storage
    chrome.storage.sync.get('selectedModel', (data) => {
      const model = data.selectedModel || 'gpt-4';
  
      // Send the selected text and model to the server
      fetch('http://localhost:3000/cross-reference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText, model: model }),
      })
        .then(response => response.json())
        .then(data => {
          // Send a message to content script to display the results
          chrome.tabs.sendMessage(tab.id, {
            action: 'showResults',
            results: data.links
          });
        })
        .catch(error => {
          console.error('Error:', error);
          chrome.tabs.sendMessage(tab.id, { action: 'removeLoadingOverlay' });
          alert('An error occurred. Please try again later.');
        });
    });
  }
  
  // Add a context menu item
  chrome.contextMenus.create({
    id: 'cross-reference',
    title: 'Cross-reference with Church Materials',
    contexts: ['selection'],
  });
  
  chrome.contextMenus.onClicked.addListener(handleTextSelection);
  