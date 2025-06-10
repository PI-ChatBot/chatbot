export const storage = {
  set: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  get: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};