import { VERSION } from "@/constants";

// Extend Window interface to track intercepted window.open
declare global {
  interface Window {
    __openIntercepted?: boolean;
  }
}

// ... existing code ...

handleIframeLoad(iframe) {
    // ... existing code ...
    try {
        // Intercept window.open to prevent new browser tabs and use internal tab system
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow && !iframeWindow.__openIntercepted) {
            const originalOpen = iframeWindow.open.bind(iframeWindow);
            iframeWindow.open = function(url?: string | URL, target?: string, features?: string) {
                // If a URL is provided, create a new tab in the internal system
                if (url) {
                    const urlString = url.toString();
                    const newTab: Tab = {
                        id: `tab-${Date.now()}`,
                        title: "Loading...",
                        url: urlString,
                        favicon: "",
                        isActive: true,
                    };
                    setTabs((prevTabs) =>
                        prevTabs.map((tab) => ({ ...tab, isActive: false })).concat(newTab)
                    );
                    setInputUrl(urlString);
                    // Return null to indicate no window was opened
                    return null as any;
                }
                // Fall back to original behavior for edge cases
                return originalOpen(url, target, features);
            };
            // Mark this window as intercepted to avoid double-wrapping
            iframeWindow.__openIntercepted = true;
        }
    } catch (error) {
        console.warn(
            `Could not intercept window.open for tab ${tab.id}:`,
            error
        );
    }
    // ... existing code ...
}