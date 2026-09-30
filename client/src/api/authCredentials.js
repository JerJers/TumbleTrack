const KEY = 'tumbletrack:basic-auth'

let pendingResolvers = []
let openModal = null

export function registerAuthModal(openFn) {
    openModal = openFn
}

export function getAuthHeader() {
    let value = localStorage.getItem(KEY)
    if (value) return Promise.resolve(`Basic ${value}`)

        return new Promise((resolve) => {
            pendingResolvers.push(resolve)
            if (pendingResolvers.length === 1 && openModal) {
                openModal()
            }   
        })
}

export function submitAuthCredentials(user, pass) {
    const value = btoa(`${user || ''}:${pass || ''}`)
    localStorage.setItem(KEY, value)
    const resolvers = pendingResolvers
    pendingResolvers = []
    resolvers.forEach((resolve) => resolve(`Basic ${value}`))
}

//Call this if a request comes back 401, so the next request re prompts
export function clearAuthHeader() {
    localStorage.removeItem(KEY)
}
