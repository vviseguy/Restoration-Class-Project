// content.js

// Function to create and display the loading overlay
function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'cross-reference-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = '#fff';
    overlay.style.fontSize = '24px';
    overlay.style.textAlign = 'center';
  
    const loadingText = document.createElement('div');
    loadingText.innerText = 'Processing your request...\nThis may take a few seconds.';
    overlay.appendChild(loadingText);
  
    document.body.appendChild(overlay);
  }
  
  // Function to remove the loading overlay
  function removeLoadingOverlay() {
    const overlay = document.getElementById('cross-reference-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }
  
  // Function to display results in the overlay
  function showResultsOverlay(results) {
    const overlay = document.getElementById('cross-reference-overlay');
    if (!overlay) return;
  
    overlay.innerHTML = ''; // Clear loading text
  
    const resultsContainer = document.createElement('div');
    resultsContainer.style.padding = '20px';
    resultsContainer.style.backgroundColor = '#333';
    resultsContainer.style.borderRadius = '8px';
    resultsContainer.style.maxWidth = '80%';
    resultsContainer.style.maxHeight = '80%';
    resultsContainer.style.overflowY = 'auto';
  
    results.forEach(result => {
      const linkElement = document.createElement('a');
      linkElement.href = result.url;
      linkElement.innerText = result.description || result.url;
      linkElement.style.color = '#1e90ff';
      linkElement.style.display = 'block';
      linkElement.style.marginBottom = '10px';
      linkElement.target = '_blank';
      resultsContainer.appendChild(linkElement);
    });
  
    overlay.appendChild(resultsContainer);
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showLoadingOverlay') {
      showLoadingOverlay();
    } else if (request.action === 'removeLoadingOverlay') {
      removeLoadingOverlay();
    } else if (request.action === 'showResults') {
      showResultsOverlay(request.results);
    }
  });
  