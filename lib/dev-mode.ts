/**
 * Development mode utilities for testing without Telegram
 */

// Check if we're in development mode
// Can be enabled by setting NEXT_PUBLIC_DEV_MODE=true in .env.local
// Automatically enabled when NODE_ENV === "development"
export const isDevMode =
  typeof process !== "undefined" && (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEV_MODE === "true")

export function createMockTelegramWebApp() {
  if (typeof window === "undefined") return

  // Create mock Telegram WebApp object
  const mockUser = {
    id: 123456789,
    first_name: "Test",
    last_name: "User",
    username: "testuser",
    language_code: "en",
  }

  const mockInitData = `user=${JSON.stringify(mockUser)}&auth_date=${Math.floor(Date.now() / 1000)}&hash=mock_hash`

  // @ts-ignore - Mock Telegram WebApp
  window.Telegram = {
    WebApp: {
      initData: mockInitData,
      initDataUnsafe: {
        user: mockUser,
      },
      ready: () => {},
      expand: () => {},
      showAlert: (message: string) => alert(message),
      showConfirm: (message: string) => confirm(message),
      showPopup: (params: any) => {},
      showScanQrPopup: (params: any) => {},
      closeScanQrPopup: () => {},
      onEvent: (eventType: string, eventHandler: Function) => {},
      offEvent: (eventType: string, eventHandler: Function) => {},
      sendData: (data: string) => {},
      openLink: (url: string) => window.open(url, "_blank"),
      openTelegramLink: (url: string) => {},
      openInvoice: (url: string, callback?: Function) => {},
      readTextFromClipboard: (callback?: Function) => {},
      requestWriteAccess: (callback?: Function) => {},
      requestContact: (callback?: Function) => {},
      version: "6.0",
      platform: "web",
      colorScheme: "light",
      themeParams: {},
      isExpanded: true,
      viewportHeight: window.innerHeight,
      viewportStableHeight: window.innerHeight,
      headerColor: "#ffffff",
      backgroundColor: "#ffffff",
      BackButton: {
        isVisible: false,
        onClick: (callback: Function) => {},
        offClick: (callback: Function) => {},
        show: () => {},
        hide: () => {},
      },
      MainButton: {
        text: "",
        color: "",
        textColor: "",
        isVisible: false,
        isActive: true,
        isProgressVisible: false,
        setText: (text: string) => {},
        onClick: (callback: Function) => {},
        offClick: (callback: Function) => {},
        show: () => {},
        hide: () => {},
        enable: () => {},
        disable: () => {},
        showProgress: () => {},
        hideProgress: () => {},
        setParams: (params: any) => {},
      },
      HapticFeedback: {
        impactOccurred: (style: string) => {},
        notificationOccurred: (type: string) => {},
        selectionChanged: () => {},
      },
      CloudStorage: {
        setItem: (key: string, value: string, callback?: Function) => {},
        getItem: (key: string, callback?: Function) => {},
        getItems: (keys: string[], callback?: Function) => {},
        removeItem: (key: string, callback?: Function) => {},
        removeItems: (keys: string[], callback?: Function) => {},
        getKeys: (callback?: Function) => {},
      },
      BiometricManager: {
        init: (params: any) => {},
        openSettings: () => {},
        authenticate: (params: any) => {},
        requestAccess: (params: any) => {},
        authenticateWithPassword: (params: any) => {},
      },
    } as any,
  }

  console.log("🔧 Development Mode: Mock Telegram WebApp initialized")
}

