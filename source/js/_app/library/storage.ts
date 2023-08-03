// Html5LocalStorage的一个API
export const $storage = {
  set (key: string, value: string): void {
    localStorage.setItem(key, value)
  },
  get (key: string): string {
    return localStorage.getItem(key)
  },
  del (key: string): void {
    localStorage.removeItem(key)
  }
}
