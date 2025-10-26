const DB_NAME = 'recipeextracterImageCache';
const STORE_NAME = 'recipe_images';
const DB_VERSION = 1;

let db: IDBDatabase;

// Function to initialize the database
const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('IndexedDB error:', request.error);
            reject('Error opening DB');
        };

        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};

// Save an image (base64 data URL) to the store
export const saveImage = async (key: string, imageDataUrl: string): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id: key, data: imageDataUrl });

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error('Error saving image to IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

// Get an image data URL from the store
export const getImage = async (key: string): Promise<string | null> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.data);
            } else {
                resolve(null);
            }
        };

        request.onerror = () => {
            console.error('Error getting image from IndexedDB:', request.error);
            reject(request.error);
        };
    });
};