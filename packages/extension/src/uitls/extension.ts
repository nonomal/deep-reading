
export function sendMessage<T, R = any>(message: T, options?: chrome.runtime.MessageOptions) {
    return new Promise<R>((resolve) => {
        chrome.runtime.sendMessage(message, options || {}, resolve)
    })
}

export function sendMessageToTab<T>(tabId: number, message: T) {
    return new Promise<any>((resolve) => {
        chrome.tabs.sendMessage(tabId, message, resolve)
    })
}

type Sender = chrome.runtime.MessageSender
type SendResponse = (response: any) => void
export function addMessageListener<T>(fn: (data: T, sender?: Sender, sendResponse?: SendResponse) => void) {
    chrome.runtime.onMessage.addListener(fn)
    return () => chrome.runtime.onMessage.removeListener(fn)
}

export function getCurrentTab() {
    return new Promise<chrome.tabs.Tab>((resolve) => {
        chrome.tabs.getCurrent(resolve)
    })
}

export function getActiveTab() {
    return new Promise<chrome.tabs.Tab>((resolve) => {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, (tabs) => resolve(tabs.length > 0 ? tabs[0] : null))
    })
}

type QueryInfo = chrome.tabs.QueryInfo
export function queryTabs(query: QueryInfo) {
    return new Promise<chrome.tabs.Tab[]>((resolve) => {
        chrome.tabs.query(query, resolve)
    })
}

type UpdateProperties = chrome.tabs.UpdateProperties
export function updateTab(tabId: number, properties: UpdateProperties) {
    return new Promise<chrome.tabs.Tab>((resolve) => {
        chrome.tabs.update(tabId, properties, resolve)
    })
}

export function getURL(path: string) {
    return chrome.runtime.getURL(path)
}

export function getSyncStorage<T, Key = string | string[] | Record<string, T>>(keys: Key) {
    return new Promise<Record<string, T>>((resolve) => {
        chrome.storage.sync.get(keys, resolve)
    })
}

export function setSyncStorage<T>(items: T) {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.set(items, resolve)
    })
}

export function getLocalStorage<T, Key = string | string[]>(keys: Key) {
    return new Promise<Record<string, T>>((resolve) => {
        chrome.storage.local.get(keys, resolve)
    })
}

export function setLocalStorage<T>(items: T) {
    return new Promise<void>((resolve) => {
        chrome.storage.local.set(items, resolve)
    })
}

type ScriptInjection = chrome.scripting.ScriptInjection
type InjectDetails = chrome.tabs.InjectDetails
export async function executeScript(injection: ScriptInjection) {
    const manifestVersion = chrome.runtime.getManifest().manifest_version
    if (manifestVersion >= 3) {
        return new Promise<void>((resolve) => {
            chrome.scripting.executeScript(injection, () => resolve())
        })
    }

    const tabId = injection.target.tabId
    const files = injection.files

    for (let file of files) {
        const details: InjectDetails = {
            file: file,
            allFrames: injection.target.allFrames
        }
        await new Promise<void>((resolve) => {
            chrome.tabs.executeScript(tabId, details, () => resolve())
        })
    }
}


type InstalledDetails = chrome.runtime.InstalledDetails
export function addInstalledListener(callback: (details: InstalledDetails) => void) {
    chrome.runtime.onInstalled.addListener(callback)
    return () => chrome.runtime.onInstalled.removeListener(callback)
}


export function getManifest() {
    return chrome.runtime.getManifest()
}


export function addStartupListener(callback: () => void) {
    chrome.runtime.onStartup.addListener(callback)
    return () => chrome.runtime.onStartup.removeListener(callback)
}

export function setUninstallURL(url: string) {
    chrome.runtime.setUninstallURL(url)
}

type UpdateInfo = chrome.windows.UpdateInfo
type WindowsWindow = chrome.windows.Window
export function updateWindow(winId: number, info: UpdateInfo) {
    return new Promise<WindowsWindow>((resolve) => {
        chrome.windows.update(winId, info, resolve)
    })
}

export function createContextMenus(properties: chrome.contextMenus.CreateProperties) {
    return new Promise<void>((resolve) => {
        chrome.contextMenus.create(properties, resolve)
    })
}

export function updateContextMenus(id: string, properties: chrome.contextMenus.UpdateProperties) {
    return new Promise<void>((resolve) => {
        chrome.contextMenus.update(id, properties, resolve)
    })
}

type CMCallback = (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => void
export function addContextMenusListener(fn: CMCallback) {
    chrome.contextMenus.onClicked.addListener(fn)
    return () => chrome.contextMenus.onClicked.removeListener(fn)
}
