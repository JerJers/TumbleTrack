const KEY = 'tumbletrack:basic-auth'

export function getAuthHeader() {
    let value = localStorage.getItem(KEY)
    if (!value) {
        const user = window.prompt('TumbleTrack username:')
        const pass = window.prompt('TumbleTrack password:')
        value = btoa(`${user || "}:${pass || "}`)
        localStorage.setItem(KEY, value)
    }
    return `Basic ${value}`
}



//Call this if a request comes back 401, so the next request re prompts
export function clearAuthHeader() {
    localStorage.removeItem(KEY)
}