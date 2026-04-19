// Abrir Side Panel automáticamente al hacer clic en el ícono
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Listener para el comando Alt+G (quick-expense)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'quick-expense') {
    const width = 340;
    const height = 260;
    
    // Obtener la ventana actual para centrar
    const currentWindow = await chrome.windows.getCurrent();
    const left = Math.round(currentWindow.left + (currentWindow.width - width) / 2);
    const top = Math.round(currentWindow.top + (currentWindow.height - height) / 2);
    
    chrome.windows.create({
      url: 'src/popup.html',
      type: 'popup',
      width,
      height,
      left,
      top,
      focused: true
    });
  }
});
