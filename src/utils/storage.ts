import { openDB } from 'idb';

// Local Storage
export const getFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

// Session Storage
export const getFromSessionStorage = (key: string) => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setToSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeFromSessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

// IndexedDB
export const saveToIndexedDB = async (storeName: string, data: any[]) => {
  const db = await openDB('appDB', 1, {
    upgrade(db) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    },
  });
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  data.forEach(item => {
    store.put(item);
  });
  await tx.done;
};

export const getFromIndexedDB = async (storeName: string) => {
  const db = await openDB('appDB', 1);
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const allItems = await store.getAll();
  await tx.done;
  return allItems;
};
