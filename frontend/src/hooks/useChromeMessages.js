import { useEffect } from 'react';

/**
 * Hook para escuchar mensajes de Chrome Runtime
 * @param {Function} callback - Función que se ejecuta al recibir un mensaje
 */
export function useChromeMessages(callback) {
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      return;
    }

    const handleMessage = (message, sender, sendResponse) => {
      callback(message, sender, sendResponse);
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [callback]);
}
