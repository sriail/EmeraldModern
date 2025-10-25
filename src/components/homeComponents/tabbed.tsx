  // Handle new tab requests from iframes (for about:blank cloak compatibility)
  useEffect(() => {
    const handleNewTabRequest = (event: MessageEvent) => {
      // Check if this is a request to open a new tab
      if (event.data?.type === "openNewTab" && event.data?.url) {
        const url = event.data.url;
        
        // Create a new tab with the requested URL
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          title: "Loading...",
          url: url,
          favicon: "",
          isActive: true,
        };
        
        setTabs((prevTabs) =>
          prevTabs.map((tab) => ({ ...tab, isActive: false })).concat(newTab)
        );
        setInputUrl(url);
      }
    };

    window.addEventListener("message", handleNewTabRequest);

    return () => {
      window.removeEventListener("message", handleNewTabRequest);
    };
  }, []);