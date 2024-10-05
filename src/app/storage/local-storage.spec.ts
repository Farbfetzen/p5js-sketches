import {
    clearLocalStorage,
    getLocalStorageItem,
    removeLocalStorageItem,
    setLocalStorageItem,
} from "src/app/storage/local-storage";

describe("LocalStorage", () => {
    const key = "key";
    const keyWithPrefix = "p5s-key";
    const value = "value";

    beforeEach(() => {
        localStorage.clear();
    });

    it("should set item", () => {
        expect(localStorage.getItem(keyWithPrefix)).toBeNull();
        setLocalStorageItem(key, value);
        expect(localStorage.getItem(keyWithPrefix)).toEqual(value);
    });

    it("should get item", () => {
        localStorage.setItem(keyWithPrefix, value);
        expect(getLocalStorageItem(key)).toEqual(value);
    });

    it("should return null if key not found", () => {
        expect(getLocalStorageItem("foo")).toBeNull();
    });

    it("should remove item", () => {
        localStorage.setItem(keyWithPrefix, value);
        expect(localStorage.getItem(keyWithPrefix)).toEqual(value);
        removeLocalStorageItem(key);
        expect(localStorage.getItem(keyWithPrefix)).toBeNull();
    });

    it("should clear all items with the prefix", () => {
        const secondKey = keyWithPrefix + "2";
        localStorage.setItem(keyWithPrefix, value);
        localStorage.setItem(secondKey, value);
        localStorage.setItem("other", "stuff");
        clearLocalStorage();
        expect(localStorage.getItem(keyWithPrefix)).toBeNull();
        expect(localStorage.getItem(secondKey)).toBeNull();
        expect(localStorage.getItem("other")).toEqual("stuff");
    });
});
