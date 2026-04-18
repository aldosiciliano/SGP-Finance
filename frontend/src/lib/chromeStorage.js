/**
 * Wrapper de chrome.storage.local con fallback a localStorage
 * para que el código funcione tanto en extensión como en desarrollo web.
 */

const isExtension = typeof chrome !== 'undefined' && chrome.storage;

export const storageGet = (key) => {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => resolve(result[key]));
    });
  }
  return Promise.resolve(localStorage.getItem(key));
};

export const storageSet = (key, value) => {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, value);
  return Promise.resolve();
};

export const storageRemove = (key) => {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], resolve);
    });
  }
  localStorage.removeItem(key);
  return Promise.resolve();
};
