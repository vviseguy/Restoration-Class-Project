document.addEventListener('DOMContentLoaded', () => {
    const modelSelect = document.getElementById('modelSelect');
  
    // Load the saved model from storage or default to gpt-4o-mini
    chrome.storage.sync.get('selectedModel', (data) => {
        const model = data.selectedModel || 'gpt-4o-mini';
        modelSelect.value = model;
    });
  
    // Save the selected model to storage
    modelSelect.addEventListener('change', () => {
        const selectedModel = modelSelect.value;
        chrome.storage.sync.set({ selectedModel: selectedModel });
    });
  });
  