// Background service worker for WPlace AutoBOT Extension

// Test resource loading on extension starto
chrome.runtime.onStartup.addListener(async () => {
    console.log('🚀 WPlace AutoBOT Extension started');
    const resources = await loadExtensionResources();
    console.log('📦 Initial resource test:', resources);
});

chrome.runtime.onInstalled.addListener(async () => {
    console.log('🔧 WPlace AutoBOT Extension installed');
    const resources = await loadExtensionResources();
    console.log('📦 Installation resource test:', resources);
});


async function executeLocalScript(scriptName, tabId) {
    try {
        console.log(`Loading script: ${scriptName}`);

        // Check if we need to inject dependencies first for Auto-Image.js or Art-Extractor.js
        if (scriptName === 'Auto-Image.js' || scriptName === 'Art-Extractor.js') {
            console.log(`🔑 ${scriptName} detected, ensuring dependencies are loaded first...`);

            try {
                // First inject token-manager.js
                const tokenManagerUrl = chrome.runtime.getURL('scripts/token-manager.js');
                const tokenManagerResponse = await fetch(tokenManagerUrl);

                if (tokenManagerResponse.ok) {
                    const tokenManagerCode = await tokenManagerResponse.text();
                    console.log('🔑 Token manager loaded, injecting first...');

                    // Execute token manager first
                    await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        world: "MAIN",
                        func: (code) => {
                            console.log('%c🔑 Loading WPlace Token Manager...', 'color: #4ade80; font-weight: bold;');
                            const script = document.createElement('script');
                            script.textContent = code;
                            document.head.appendChild(script);
                            script.remove();
                            console.log('%c✅ Token Manager loaded successfully', 'color: #4ade80; font-weight: bold;');
                        },
                        args: [tokenManagerCode]
                    });

                    console.log('✅ Token manager injected successfully');
                } else {
                    console.warn('⚠️ Could not load token-manager.js, proceeding without it');
                }

                // Then inject image-processor.js
                const imageProcessorUrl = chrome.runtime.getURL('scripts/image-processor.js');
                const imageProcessorResponse = await fetch(imageProcessorUrl);

                if (imageProcessorResponse.ok) {
                    const imageProcessorCode = await imageProcessorResponse.text();
                    console.log('🖼️ Image processor loaded, injecting second...');

                    // Execute image processor second
                    await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        world: "MAIN",
                        func: (code) => {
                            console.log('%c🖼️ Loading WPlace Image Processor...', 'color: #3b82f6; font-weight: bold;');
                            const script = document.createElement('script');
                            script.textContent = code;
                            document.head.appendChild(script);
                            script.remove();
                            console.log('%c✅ Image Processor loaded successfully', 'color: #3b82f6; font-weight: bold;');
                        },
                        args: [imageProcessorCode]
                    });

                    console.log('✅ Image processor injected successfully');
                } else {
                    console.warn('⚠️ Could not load image-processor.js, proceeding without it');
                }

                // Then inject overlay-manager.js
                const overlayManagerUrl = chrome.runtime.getURL('scripts/overlay-manager.js');
                const overlayManagerResponse = await fetch(overlayManagerUrl);

                if (overlayManagerResponse.ok) {
                    const overlayManagerCode = await overlayManagerResponse.text();
                    console.log('🎨 Overlay manager loaded, injecting third...');

                    // Execute overlay manager thirds
                    await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        world: "MAIN",
                        func: (code) => {
                            console.log('%c🎨 Loading WPlace Overlay Manager...', 'color: #8b5cf6; font-weight: bold;');
                            const script = document.createElement('script');
                            script.textContent = code;
                            document.head.appendChild(script);
                            script.remove();
                            console.log('%c✅ Overlay Manager loaded successfully', 'color: #8b5cf6; font-weight: bold;');
                        },
                        args: [overlayManagerCode]
                    });

                    console.log('✅ Overlay manager injected successfully');
                } else {
                    console.warn('⚠️ Could not load overlay-manager.js, proceeding without it');
                }

                // Finally inject utils-manager.js
                const utilsManagerUrl = chrome.runtime.getURL('scripts/utils-manager.js');
                const utilsManagerResponse = await fetch(utilsManagerUrl);

                if (utilsManagerResponse.ok) {
                    const utilsManagerCode = await utilsManagerResponse.text();
                    console.log('🛠️ Utils manager loaded, injecting fourth...');

                    // Execute utils manager fourth
                    await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        world: "MAIN",
                        func: (code) => {
                            console.log('%c🛠️ Loading WPlace Utils Manager...', 'color: #f59e0b; font-weight: bold;');
                            const script = document.createElement('script');
                            script.textContent = code;
                            document.head.appendChild(script);
                            script.remove();
                            console.log('%c✅ Utils Manager loaded successfully', 'color: #f59e0b; font-weight: bold;');
                        },
                        args: [utilsManagerCode]
                    });

                    console.log('✅ Utils manager injected successfully');
                } else {
                    console.warn('⚠️ Could not load utils-manager.js, proceeding without it');
                }

                // Small delay to ensure dependencies are fully initialized
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.warn('⚠️ Error loading dependencies:', error);
            }
        }

        // Determine script path - Script-manager files are in root, others in scripts/
        let scriptUrl;
        if (scriptName === 'Script-manager.js' || scriptName === 'Script-manager-fixed.js') {
            scriptUrl = chrome.runtime.getURL(scriptName);
        } else {
            scriptUrl = chrome.runtime.getURL(`scripts/${scriptName}`);
        }

        const response = await fetch(scriptUrl);

        if (!response.ok) {
            throw new Error(`Failed to load script: ${response.status} ${response.statusText}`);
        }

        const scriptCode = await response.text();
        console.log(`Script loaded: ${scriptCode.length} characters`);

        // Load theme and language resources
        const resources = await loadExtensionResources();

        // Execute in MAIN world context (bypasses CSP)
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            world: "MAIN", // Key: executes in page context, not extension context
            func: (code, name, themeCSS, languages) => {
                console.log(`%c🚀 Executing ${name}...`, 'color: #4ade80; font-weight: bold; font-size: 14px;');

                // Create detailed resource report
                console.group(`%c📊 WPlace AutoBOT Resource Report for ${name}`, 'color: #3b82f6; font-weight: bold; font-size: 16px;');

                // Debug: Log what resources we received
                console.log(`%c📦 Raw Resources Received:`, 'color: #8b5cf6; font-weight: bold;');
                console.log(`  - Themes object:`, themeCSS);
                console.log(`  - Languages object:`, languages);
                console.log(`  - Theme count: ${Object.keys(themeCSS || {}).length}`);
                console.log(`  - Language count: ${Object.keys(languages || {}).length}`);

                // Inject CSS themes if available
                if (themeCSS && Object.keys(themeCSS).length > 0) {
                    console.group(`%c🎨 Theme Processing`, 'color: #8b5cf6; font-weight: bold;');
                    console.log(`%c📁 Loading ${Object.keys(themeCSS).length} theme files from extension local storage...`, 'color: #8b5cf6;');

                    // Create a global themes object
                    window.AUTOBOT_THEMES = themeCSS;

                    // Log detailed theme information
                    Object.entries(themeCSS).forEach(([filename, content]) => {
                        console.log(`%c📄 Theme File: ${filename}`, 'color: #8b5cf6; font-weight: bold;');
                        console.log(`  📏 Size: ${content.length.toLocaleString()} characters`);
                        console.log(`  📍 Source: Extension local file (chrome-extension://)`);
                        console.log(`  🔗 Full path: themes/${filename}`);

                        // Show first few lines as preview
                        const preview = content.substring(0, 200).split('\\n').slice(0, 3).join('\\n');
                        console.log(`  👀 Preview: ${preview}${content.length > 200 ? '...' : ''}`);
                        console.log(`  ✅ Status: Loaded successfully`);
                    });

                    // Inject auto-image-styles.css if available
                    if (themeCSS['auto-image-styles.css']) {
                        const autoImageContent = themeCSS['auto-image-styles.css'];
                        const styleElement = document.createElement('style');
                        styleElement.id = 'autobot-auto-image-styles';
                        styleElement.textContent = autoImageContent;
                        document.head.appendChild(styleElement);

                        console.log(`%c✨ AUTO-INJECTED: auto-image-styles.css`, 'color: #10b981; font-weight: bold;');
                        console.log(`  📏 Injected size: ${autoImageContent.length.toLocaleString()} characters`);
                        console.log(`  📍 Source: Extension local file`);
                        console.log(`  🎯 Target: <head> as <style> element`);
                        console.log(`  🆔 Element ID: autobot-auto-image-styles`);
                    } else {
                        console.warn(`%c⚠️ auto-image-styles.css not found in loaded themes`, 'color: #f59e0b; font-weight: bold;');
                    }
                    console.groupEnd();
                } else {
                    console.warn(`%c⚠️ No themes received from extension`, 'color: #f59e0b; font-weight: bold;');
                    console.log(`  📁 Expected source: Extension local files`);
                    console.log(`  📋 Expected files: auto-image-styles.css, acrylic.css, classic.css, etc.`);
                    window.AUTOBOT_THEMES = {};
                }

                // Inject language data if available
                if (languages && Object.keys(languages).length > 0) {
                    console.group(`%c🌍 Language Processing`, 'color: #06b6d4; font-weight: bold;');
                    console.log(`%c📁 Loading ${Object.keys(languages).length} language files from extension local storage...`, 'color: #06b6d4;');

                    window.AUTOBOT_LANGUAGES = languages;

                    // Log detailed language information
                    Object.entries(languages).forEach(([filename, content]) => {
                        console.log(`%c📄 Language File: ${filename}`, 'color: #06b6d4; font-weight: bold;');
                        console.log(`  🌐 Language: ${filename.replace('.json', '').toUpperCase()}`);
                        console.log(`  📏 Keys count: ${Object.keys(content).length.toLocaleString()}`);
                        console.log(`  📍 Source: Extension local file (chrome-extension://)`);
                        console.log(`  🔗 Full path: lang/${filename}`);

                        // Show some sample keys
                        const sampleKeys = Object.keys(content).slice(0, 5);
                        console.log(`  🔑 Sample keys: ${sampleKeys.join(', ')}${Object.keys(content).length > 5 ? '...' : ''}`);
                        console.log(`  ✅ Status: Loaded successfully`);
                    });

                    // Helper function to get language data with detailed logging
                    window.getLanguage = function (lang = 'en') {
                        const langFile = `${lang}.json`;
                        let sourceFile = langFile;
                        let successMessage = 'Found exact match';
                        let result = window.AUTOBOT_LANGUAGES[langFile];

                        if (!result) {
                            const localeMatch = Object.keys(window.AUTOBOT_LANGUAGES).find(file => file.toLowerCase().startsWith(`${lang.toLowerCase()}-`));
                            if (localeMatch) {
                                result = window.AUTOBOT_LANGUAGES[localeMatch];
                                sourceFile = localeMatch;
                                successMessage = `Using regional fallback (${localeMatch.replace('.json', '')})`;
                            }
                        }

                        if (!result) {
                            result = window.AUTOBOT_LANGUAGES['en.json'] || {};
                            sourceFile = 'en.json';
                            successMessage = 'Fallback to English';
                        }

                        console.group(`%c🔤 Language Access: ${lang.toUpperCase()}`, 'color: #06b6d4; font-weight: bold;');
                        console.log(`  📋 Requested: ${lang}`);
                        console.log(`  📄 File: ${sourceFile}`);
                        console.log(`  📍 Source: Extension local file`);
                        console.log(`  📏 Keys returned: ${Object.keys(result).length}`);
                        console.log(`  ✅ Success: ${successMessage}`);
                        console.log(`  📝 Data preview:`, result);
                        console.groupEnd();

                        return result;
                    };

                    console.log(`%c🔤 Available languages: ${Object.keys(languages).map(f => f.replace('.json', '')).join(', ')}`, 'color: #06b6d4;');
                    console.groupEnd();
                } else {
                    console.warn(`%c⚠️ No languages received from extension`, 'color: #f59e0b; font-weight: bold;');
                    console.log(`  📁 Expected source: Extension local files`);
                    console.log(`  📋 Expected files: en.json, de.json, fr.json, etc.`);
                    window.AUTOBOT_LANGUAGES = {};
                    window.getLanguage = function () {
                        console.warn(`%c⚠️ getLanguage() called but no languages available`, 'color: #f59e0b;');
                        return {};
                    };
                }

                // Helper function to apply theme with detailed logging
                window.applyTheme = function (themeName) {
                    console.group(`%c🎨 Theme Application: ${themeName}`, 'color: #8b5cf6; font-weight: bold;');

                    if (!window.AUTOBOT_THEMES || Object.keys(window.AUTOBOT_THEMES).length === 0) {
                        console.error(`%c❌ No themes available in extension`, 'color: #ef4444; font-weight: bold;');
                        console.log(`  📁 Expected source: Extension local files`);
                        console.log(`  📋 Expected location: window.AUTOBOT_THEMES`);
                        console.groupEnd();
                        return false;
                    }

                    const themeFile = themeName + '.css';
                    console.log(`  📋 Requested theme: ${themeName}`);
                    console.log(`  📄 Looking for file: ${themeFile}`);
                    console.log(`  📁 Available themes: ${Object.keys(window.AUTOBOT_THEMES).join(', ')}`);

                    if (window.AUTOBOT_THEMES[themeFile]) {
                        const themeContent = window.AUTOBOT_THEMES[themeFile];

                        // Remove existing theme
                        const existing = document.getElementById('autobot-theme');
                        if (existing) {
                            console.log(`  🗑️ Removing previous theme element`);
                            existing.remove();
                        }

                        // Apply new theme
                        const styleElement = document.createElement('style');
                        styleElement.id = 'autobot-theme';
                        styleElement.textContent = themeContent;
                        document.head.appendChild(styleElement);

                        console.log(`%c✅ Theme applied successfully: ${themeName}`, 'color: #10b981; font-weight: bold;');
                        console.log(`  📏 Content size: ${themeContent.length.toLocaleString()} characters`);
                        console.log(`  📍 Source: Extension local file`);
                        console.log(`  🎯 Target: <head> as <style> element`);
                        console.log(`  🆔 Element ID: autobot-theme`);

                        // Show preview of applied CSS
                        const preview = themeContent.substring(0, 150).split('\\n').slice(0, 2).join('\\n');
                        console.log(`  👀 CSS Preview: ${preview}...`);

                        console.groupEnd();
                        return true;
                    } else {
                        console.error(`%c❌ Theme not found: ${themeName}`, 'color: #ef4444; font-weight: bold;');
                        console.log(`  📄 Requested file: ${themeFile}`);
                        console.log(`  📁 Available themes: ${Object.keys(window.AUTOBOT_THEMES).join(', ')}`);
                        console.groupEnd();
                        return false;
                    }
                };

                // Final resource summary
                console.group(`%c📋 Resource Summary`, 'color: #10b981; font-weight: bold;');
                console.log(`%c🎨 Themes loaded: ${Object.keys(window.AUTOBOT_THEMES || {}).length}`, 'color: #8b5cf6;');
                console.log(`%c🌍 Languages loaded: ${Object.keys(window.AUTOBOT_LANGUAGES || {}).length}`, 'color: #06b6d4;');
                console.log(`%c🛠️ Helper functions available:`, 'color: #10b981;');
                console.log(`  - applyTheme(themeName) - Apply CSS theme`);
                console.log(`  - getLanguage(lang) - Get language translations`);
                console.log(`%c📍 All resources loaded from: Extension local files`, 'color: #10b981;');
                console.groupEnd();

                console.groupEnd(); // End main resource report

                // Create script element to execute the code
                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
                script.remove(); // Clean up after execution

                console.log(`%c✅ ${name} executed successfully with full resource access`, 'color: #4ade80; font-weight: bold;');
            },
            args: [scriptCode, scriptName, resources.themes, resources.languages]
        });

        console.log('Script executed successfully in MAIN context');

    } catch (error) {
        console.error('Error executing script:', error);
        throw error;
    }
}

async function loadExtensionResources() {
    console.group('%c🔧 WPlace AutoBOT Resource Loading System', 'color: #3b82f6; font-weight: bold; font-size: 16px;');
    const startTime = performance.now();

    const resources = {
        themes: {},
        languages: {}
    };

    try {
        console.log('%c� Starting resource loading from extension directory...', 'color: #3b82f6; font-weight: bold;');

        // Load theme files
        console.group('%c🎨 Theme Files Loading', 'color: #8b5cf6; font-weight: bold;');
        const themeFiles = [
            'auto-image-styles.css',
            'themes/acrylic.css',
            'themes/classic-light.css',
            'themes/classic.css',
            'themes/neon.css',
            'themes/neon-cyan.css',
            'themes/neon-light.css'
        ];

        for (const themeFile of themeFiles) {
            try {
                console.log(`%c� Loading theme: ${themeFile}`, 'color: #8b5cf6;');
                console.log(`  📍 Source path: ${themeFile}`);
                console.log(`  🔗 Full URL: chrome-extension://${chrome.runtime.id}/${themeFile}`);

                const themeUrl = chrome.runtime.getURL(themeFile);
                console.log(`  🌐 Resolved URL: ${themeUrl}`);

                const response = await fetch(themeUrl);
                console.log(`  📡 Fetch response status: ${response.status} ${response.statusText}`);
                console.log(`  📋 Response headers:`, Object.fromEntries(response.headers.entries()));

                if (response.ok) {
                    const content = await response.text();
                    const fileName = themeFile.split('/').pop();
                    resources.themes[fileName] = content;

                    console.log(`%c✅ ${fileName} loaded successfully`, 'color: #10b981; font-weight: bold;');
                    console.log(`  📏 File size: ${content.length.toLocaleString()} characters`);
                    console.log(`  📊 File size: ${(content.length / 1024).toFixed(2)} KB`);
                    console.log(`  🔍 Content type: CSS stylesheet`);

                    // Show content preview
                    const firstLine = content.split('\n')[0];
                    const lastLine = content.split('\n').slice(-1)[0];
                    console.log(`  👀 First line: ${firstLine.substring(0, 100)}${firstLine.length > 100 ? '...' : ''}`);
                    console.log(`  👀 Last line: ${lastLine.substring(0, 100)}${lastLine.length > 100 ? '...' : ''}`);

                    // Count CSS rules
                    const ruleCount = (content.match(/\{[^}]*\}/g) || []).length;
                    console.log(`  📝 Estimated CSS rules: ${ruleCount.toLocaleString()}`);

                } else {
                    console.error(`%c❌ Failed to load ${themeFile}`, 'color: #ef4444; font-weight: bold;');
                    console.error(`  📡 Status: ${response.status} ${response.statusText}`);
                    console.error(`  🌐 URL: ${themeUrl}`);
                }
            } catch (error) {
                console.error(`%c💥 Exception loading theme ${themeFile}:`, 'color: #ef4444; font-weight: bold;', error);
                console.error(`  🔍 Error type: ${error.constructor.name}`);
                console.error(`  📝 Error message: ${error.message}`);
                console.error(`  📍 Error stack: ${error.stack}`);
            }
        }
        console.groupEnd();

        // Load language files
        console.group('%c🌍 Language Files Loading', 'color: #06b6d4; font-weight: bold;');
        const languageFiles = [
            'lang/de.json',
            'lang/en.json',
            'lang/es.json',
            'lang/fr.json',
            'lang/id.json',
            'lang/ja.json',
            'lang/ko.json',
            'lang/pt.json',
            'lang/ru.json',
            'lang/tr.json',
            'lang/uk.json',
            'lang/vi.json',
            'lang/zh-CN.json',
            'lang/zh-TW.json'
        ];

        // Check if nested lang folder exists
        try {
            console.log('%c📂 Checking for nested language folder...', 'color: #06b6d4;');
            const esUrl = chrome.runtime.getURL('lang/lang/es-MX.json');
            const esResponse = await fetch(esUrl);
            if (esResponse.ok) {
                languageFiles.push('lang/lang/es-MX.json');
                console.log(`%c✅ Found nested language file: es-MX.json`, 'color: #10b981;');
            } else {
                console.log(`%c📝 No nested language folder found`, 'color: #06b6d4;');
            }
        } catch (e) {
            console.log(`%c📝 No nested language folder available`, 'color: #06b6d4;');
        }

        for (const langFile of languageFiles) {
            try {
                console.log(`%c� Loading language: ${langFile}`, 'color: #06b6d4;');
                console.log(`  🌐 Language: ${langFile.replace('lang/', '').replace('.json', '').toUpperCase()}`);
                console.log(`  📍 Source path: ${langFile}`);
                console.log(`  🔗 Full URL: chrome-extension://${chrome.runtime.id}/${langFile}`);

                const langUrl = chrome.runtime.getURL(langFile);
                console.log(`  🌐 Resolved URL: ${langUrl}`);

                const response = await fetch(langUrl);
                console.log(`  📡 Fetch response status: ${response.status} ${response.statusText}`);

                if (response.ok) {
                    const text = await response.text();
                    console.log(`  📏 Raw text size: ${text.length.toLocaleString()} characters`);

                    const parsed = JSON.parse(text);
                    const fileName = langFile.split('/').pop();
                    resources.languages[fileName] = parsed;

                    console.log(`%c✅ ${fileName} loaded successfully`, 'color: #10b981; font-weight: bold;');
                    console.log(`  📏 JSON size: ${text.length.toLocaleString()} characters`);
                    console.log(`  📊 File size: ${(text.length / 1024).toFixed(2)} KB`);
                    console.log(`  🔑 Translation keys: ${Object.keys(parsed).length.toLocaleString()}`);
                    console.log(`  🔍 Content type: JSON translation data`);

                    // Show some sample keys
                    const sampleKeys = Object.keys(parsed).slice(0, 5);
                    console.log(`  🎯 Sample keys: ${sampleKeys.join(', ')}${Object.keys(parsed).length > 5 ? '...' : ''}`);

                    // Show sample translations
                    const samples = sampleKeys.map(key => `${key}: "${parsed[key]}"`).slice(0, 3);
                    console.log(`  📝 Sample translations: ${samples.join(', ')}`);

                } else {
                    console.error(`%c❌ Failed to load ${langFile}`, 'color: #ef4444; font-weight: bold;');
                    console.error(`  📡 Status: ${response.status} ${response.statusText}`);
                    console.error(`  🌐 URL: ${langUrl}`);
                }
            } catch (error) {
                console.error(`%c💥 Exception loading language ${langFile}:`, 'color: #ef4444; font-weight: bold;', error);
                console.error(`  🔍 Error type: ${error.constructor.name}`);
                console.error(`  📝 Error message: ${error.message}`);
                if (error instanceof SyntaxError) {
                    console.error(`  🔍 JSON Parse Error - file may be corrupted or invalid`);
                }
            }
        }

        // Ensure base Spanish file is available even if only regional variant exists
        if (!resources.languages['es.json'] && resources.languages['es-MX.json']) {
            resources.languages['es.json'] = resources.languages['es-MX.json'];
            console.log(`%c✅ Added fallback mapping: es-MX.json ➝ es.json`, 'color: #10b981; font-weight: bold;');
        }
        console.groupEnd();

        const loadTime = performance.now() - startTime;

        // Final summary with detailed statistics
        console.group('%c� Resource Loading Summary', 'color: #10b981; font-weight: bold;');
        console.log(`%c⏱️ Total loading time: ${loadTime.toFixed(2)}ms`, 'color: #10b981; font-weight: bold;');
        console.log(`%c🎨 Themes loaded: ${Object.keys(resources.themes).length}/${themeFiles.length}`, 'color: #8b5cf6; font-weight: bold;');
        console.log(`%c🌍 Languages loaded: ${Object.keys(resources.languages).length}/${languageFiles.length}`, 'color: #06b6d4; font-weight: bold;');

        // Calculate total size
        const themeSize = Object.values(resources.themes).reduce((sum, content) => sum + content.length, 0);
        const langSize = Object.values(resources.languages).reduce((sum, content) => sum + JSON.stringify(content).length, 0);
        const totalSize = themeSize + langSize;

        console.log(`%c📊 Total data loaded: ${(totalSize / 1024).toFixed(2)} KB`, 'color: #10b981; font-weight: bold;');
        console.log(`  🎨 Themes: ${(themeSize / 1024).toFixed(2)} KB`);
        console.log(`  🌍 Languages: ${(langSize / 1024).toFixed(2)} KB`);

        console.log(`%c📁 Resource sources:`, 'color: #10b981; font-weight: bold;');
        console.log(`  📍 Extension ID: ${chrome.runtime.id}`);
        console.log(`  🔗 Base URL: chrome-extension://${chrome.runtime.id}/`);
        console.log(`  📂 Themes folder: chrome-extension://${chrome.runtime.id}/themes/`);
        console.log(`  📂 Languages folder: chrome-extension://${chrome.runtime.id}/lang/`);

        // List successful loads
        if (Object.keys(resources.themes).length > 0) {
            console.log(`%c✅ Loaded themes: ${Object.keys(resources.themes).join(', ')}`, 'color: #8b5cf6;');
        }
        if (Object.keys(resources.languages).length > 0) {
            const langs = Object.keys(resources.languages).map(f => f.replace('.json', '')).join(', ');
            console.log(`%c✅ Loaded languages: ${langs}`, 'color: #06b6d4;');
        }

        console.log(`%c🚀 Resources ready for injection into scripts`, 'color: #10b981; font-weight: bold;');
        console.groupEnd();
        console.groupEnd();

    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error('%c💥 Critical error in resource loading system:', 'color: #ef4444; font-weight: bold; font-size: 14px;', error);
        console.error(`  ⏱️ Failed after: ${loadTime.toFixed(2)}ms`);
        console.error(`  🔍 Error type: ${error.constructor.name}`);
        console.error(`  📝 Error message: ${error.message}`);
        console.error(`  📍 Error stack: ${error.stack}`);
        console.groupEnd();
    }

    return resources;
}

const cookieDomain = ".backend.wplace.live";

function mergeAccountRecords(existing = {}, incoming = {}) {
    const merged = { ...existing };

    Object.entries(incoming).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (typeof value === 'string') {
            const trimmed = value.trim();

            if (trimmed.length === 0 && typeof merged[key] === 'string' && merged[key].trim().length > 0) {
                return;
            }

            merged[key] = trimmed;
        } else {
            merged[key] = value;
        }
    });

    if (typeof merged.token === 'string') {
        merged.token = merged.token.trim();
        if (merged.token.length === 0) {
            delete merged.token;
        }
    }

    if (!merged.token && existing.token) {
        merged.token = existing.token;
    }

    if (!merged.ID && existing.ID) {
        merged.ID = existing.ID;
    }

    if (!merged.name && existing.name) {
        merged.name = existing.name;
    }

    return merged;
}

function deduplicateAccounts(accounts = []) {
    const result = [];
    const tokenIndexMap = new Map();
    const idIndexMap = new Map();

    accounts.forEach((account) => {
        if (!account) {
            return;
        }

        const sanitized = mergeAccountRecords({}, account);
        const token = sanitized.token;
        const id = sanitized.ID;

        let targetIndex = -1;
        if (id && idIndexMap.has(id)) {
            targetIndex = idIndexMap.get(id);
        } else if (token && tokenIndexMap.has(token)) {
            targetIndex = tokenIndexMap.get(token);
        }

        if (targetIndex > -1) {
            const existing = result[targetIndex];
            const previousToken = existing.token;
            const merged = mergeAccountRecords(existing, sanitized);
            result[targetIndex] = merged;

            if (previousToken && previousToken !== merged.token) {
                tokenIndexMap.delete(previousToken);
            }

            if (merged.token) {
                tokenIndexMap.set(merged.token, targetIndex);
            }

            if (merged.ID) {
                idIndexMap.set(merged.ID, targetIndex);
            }
        } else {
            result.push(sanitized);
            const newIndex = result.length - 1;

            if (sanitized.token) {
                tokenIndexMap.set(sanitized.token, newIndex);
            }

            if (sanitized.ID) {
                idIndexMap.set(sanitized.ID, newIndex);
            }
        }
    });

    return result;
}

async function preserveAndResetJ() {
    let savedValue = null;
    let savedExpirationDate = null; // ✅ Store expiration date

    try {
        const oldJ = await chrome.cookies.get({
            url: "https://backend.wplace.live/",
            name: "j",
        });

        if (oldJ && oldJ.value) {
            savedValue = oldJ.value.trim();
            savedExpirationDate = oldJ.expirationDate; // ✅ Capture expiration
            console.log("[bg] Saved j cookie:", savedValue);
            console.log("[bg] Cookie expires at:", savedExpirationDate ? new Date(savedExpirationDate * 1000).toISOString() : 'session');

            const accountInfo = await checkTokenAndGetInfo(savedValue);

            if (accountInfo) {
                const store = await chrome.storage.local.get("infoAccounts");
                let infoAccounts = store.infoAccounts || [];

                let existingIndex = -1;
                if (accountInfo.ID) {
                    existingIndex = infoAccounts.findIndex(account => account.ID === accountInfo.ID);
                }

                if (existingIndex === -1 && accountInfo.token) {
                    existingIndex = infoAccounts.findIndex(account => account.token === accountInfo.token);
                }

                const mergedAccount = mergeAccountRecords(
                    existingIndex > -1 ? infoAccounts[existingIndex] : {},
                    accountInfo
                );

                const accountWithMeta = {
                    ...mergedAccount,
                    expirationDate: savedExpirationDate,
                    lastActive: new Date().toISOString()
                };

                if (existingIndex > -1) {
                    infoAccounts[existingIndex] = accountWithMeta;
                    console.log(`✅ Updated account ${accountWithMeta.name} (${accountWithMeta.ID}) with new data.`);
                } else {
                    infoAccounts.push(accountWithMeta);
                    console.log(`✅ New account added: ${accountWithMeta.name} (${accountWithMeta.ID}) with expiration.`);
                }

                const beforeDedup = infoAccounts.length;
                infoAccounts = deduplicateAccounts(infoAccounts);
                if (infoAccounts.length !== beforeDedup) {
                    console.log(`♻️ Removed ${beforeDedup - infoAccounts.length} duplicate account(s) during preservation.`);
                }

                await chrome.storage.local.set({ infoAccounts });
                await exportInfoAccount();

            } else {
                console.warn("❌ Current token is invalid, not saving.");
            }
        } else {
            console.warn("[bg] No 'j' cookie found. Skipping account verification.");
        }

        setTimeout(async () => {
            await new Promise((resolve) => {
                chrome.browsingData.remove(
                    { origins: ["https://wplace.live"] },
                    { cookies: true },
                    () => {
                        console.log("[bg] Nuke done (delayed)");
                        resolve();
                    }
                );
            });

            if (savedValue) {
                setCookie(savedValue, savedExpirationDate); // ✅ Pass expiration date
            } else {
                console.log("[bg] No j to restore, leaving nuked");
            }
        }, 2000);

    } catch (err) {
        console.error("[bg] Error in preserveAndResetJ:", err);
    }
}

async function filterInvalid() {
    const store = await chrome.storage.local.get("infoAccounts");
    let infoAccounts = store.infoAccounts || [];

    const initialLength = infoAccounts.length;
    infoAccounts = deduplicateAccounts(infoAccounts);
    if (infoAccounts.length !== initialLength) {
        console.log(`♻️ Removed ${initialLength - infoAccounts.length} duplicate account(s) before validation.`);
    }

    const validAccounts = [];

    for (const account of infoAccounts) {
        if (!account?.token) {
            console.warn("[bg] Skipping account without token during validation:", account);
            continue;
        }

        const verifiedInfo = await checkTokenAndGetInfo(account.token);
        if (verifiedInfo) {
            console.log("Token valid:", account.token);
            const mergedAccount = mergeAccountRecords(account, verifiedInfo);
            mergedAccount.lastVerified = new Date().toISOString();
            validAccounts.push(mergedAccount);
        } else {
            console.log("Token invalid:", account.token);
        }
    }

    const dedupedValidAccounts = deduplicateAccounts(validAccounts);
    await chrome.storage.local.set({ infoAccounts: dedupedValidAccounts });
    console.log(`✅ Filtered and saved ${dedupedValidAccounts.length} valid accounts.`);
    await exportInfoAccount();
}

async function exportInfoAccount() {
    const store = await chrome.storage.local.get("infoAccounts");
    const rawAccounts = store.infoAccounts || [];
    const dedupedAccounts = deduplicateAccounts(rawAccounts);

    if (dedupedAccounts.length !== rawAccounts.length) {
        console.log(`♻️ exportInfoAccount removed ${rawAccounts.length - dedupedAccounts.length} duplicate info account(s).`);
        await chrome.storage.local.set({ infoAccounts: dedupedAccounts });
    }

    const tokens = dedupedAccounts
        .map(info => info.token)
        .filter(token => typeof token === 'string' && token.length > 0);

    const uniqueTokens = Array.from(new Set(tokens));
    await chrome.storage.local.set({ accounts: uniqueTokens });
}

async function checkTokenAndGetInfo(token) {
    if (!token) {
        return null;
    }
    console.log("Checking with token:", token);
    try {
        await setCookie(token);
        const response = await fetch("https://backend.wplace.live/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const userData = await response.json();
            console.log("Basic user data:", userData);

            // Enhanced user info object with WPlace API fields
            const userInfo = {
                ID: userData.id,
                name: userData.name,
                token: token,
                Charges: Math.floor(userData.charges.count),
                Max: userData.charges.max,
                Droplets: userData.droplets,
                totalPixelsPainted: userData.pixelsPainted,
                level: Math.floor(userData.level),
                showLastPixel: userData.showLastPixel,
                discord: userData.discord,
            };
            // console.log("User info after /me:", userInfo);

            try {
                const allianceResponse = await fetch(`https://backend.wplace.live/alliance/`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (allianceResponse.ok) {
                    const allianceData = await allianceResponse.json();
                    userInfo.allianceName = allianceData.name;
                    userInfo.allianceRole = allianceData.role;
                }
            } catch (allianceError) {
                console.log("Alliance info not available:", allianceError.message);
            }

            console.log("Enhanced user info:", userInfo);
            return userInfo;
        }

        if (response.status === 401) {
            console.log("Token invalid: Unauthorized (401)");
        } else {
            console.error(`⚠️ Token check failed with status: ${response.status}`);
        }
        return null;

    } catch (e) {
        console.error("❌ Network or fetch error:", e);
        return null;
    }
}

chrome.webNavigation.onCompleted.addListener(
    async (details) => {
        if (details.url.includes("wplace.live")) {
            console.log("[bg] Page load detected → nuking cookies");
            await preserveAndResetJ();

            // Check and execute startup script
            try {
                const result = await chrome.storage.local.get('startupScript');
                if (result.startupScript) {
                    console.log(`[bg] Executing startup script: ${result.startupScript}`);
                    await executeLocalScript(result.startupScript, details.tabId);
                }
            } catch (error) {
                console.error('[bg] Error executing startup script:', error);
            }
        }
    },
    { url: [{ hostContains: "wplace.live" }] }
);

async function setCookie(value, expirationDate = null) {
    const cleaned = value.trim();
    console.log("[bg] setCookie CALLED with:", cleaned);
    if (expirationDate) {
        console.log("[bg] Setting cookie expiration:", new Date(expirationDate * 1000).toISOString());
    } else {
        console.log("[bg] No expiration provided - will use server default or calculate");
    }

    return new Promise((resolve, reject) => {
        const cookieDetails = {
            url: "https://backend.wplace.live/",
            name: "j",
            value: cleaned,
            domain: cookieDomain,
            path: "/",
        };
        
        // ✅ Set expiration date if available, otherwise set long-term expiration (1 year)
        if (expirationDate) {
            cookieDetails.expirationDate = expirationDate;
        } else {
            // Set cookie to expire in 1 year if no expiration provided
            const oneYearFromNow = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
            cookieDetails.expirationDate = oneYearFromNow;
            console.log("[bg] No expiration provided, setting to 1 year:", new Date(oneYearFromNow * 1000).toISOString());
        }

        chrome.cookies.set(cookieDetails, (cookie) => {
            if (chrome.runtime.lastError) {
                console.error(
                    "[bg] cookie set error:",
                    chrome.runtime.lastError.message
                );
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                console.log("[bg] cookie set result:", cookie);
                console.log("[bg] Cookie will expire:", cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toISOString() : 'session');

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: "cookieSet",
                            value: cleaned,
                        });
                    }
                });

                resolve(cookie);
            }
        });
    });
}

async function deleteAccountAtIndex(index) {
    try {
        const data = await chrome.storage.local.get("infoAccounts");
        let infoAccounts = data.infoAccounts || [];

        if (index < 0 || index >= infoAccounts.length) {
            console.warn("[bg] Invalid index:", index);
            return false;
        }

        const removed = infoAccounts.splice(index, 1);
        await chrome.storage.local.set({ infoAccounts });

        console.log(`[bg] Deleted account at index ${index}:`, removed[0]);
        console.log(`[bg] Remaining accounts:`, infoAccounts);
        await exportInfoAccount();
        return true;
    } catch (err) {
        console.error("[bg] Error in deleteAccountAtIndex:", err);
        return false;
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("📩 Background received message:", msg);

    if (msg.type === "setCookie" && msg.value) {
        (async () => {
            try {
                console.log("🍪 Setting cookie...");
                await setCookie(msg.value);
                console.log("✅ Cookie set successfully");
                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("❌ setCookie failed", e);
                sendResponse({ status: "error", error: e.message });
            }
        })();
        return true;
    }

    if (msg.type === "getAccounts") {
        (async () => {
            try {
                console.log("📂 Fetching accounts...");
                await filterInvalid();
                const result = await chrome.storage.local.get("accounts");
                console.log("📤 Returning accounts:", result.accounts);
                sendResponse({ accounts: result.accounts || [] });
            } catch (e) {
                console.error("❌ getAccounts failed", e);
                sendResponse({ accounts: [] });
            }
        })();
        return true;
    }

    if (msg.type === "deleteAccount" && typeof msg.index === "number") {
        (async () => {
            try {
                const ok = await deleteAccountAtIndex(msg.index);
                sendResponse({ status: ok ? "ok" : "error" });
            } catch (e) {
                console.error("❌ deleteAccount failed", e);
                sendResponse({ status: "error", error: e.message });
            }
        })();
        return true;
    }

    if (msg.type === "refreshCurrentAccount") {
        (async () => {
            try {
                console.log("🔄 Refreshing current account...");
                await preserveAndResetJ();
                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("❌ refreshCurrentAccount failed", e);
                sendResponse({ status: "error", error: e.message });
            }
        })();
        return true;
    }

    if (msg.action === 'executeScript') {
        // Get tabId from sender or request
        const tabId = msg.tabId || sender.tab?.id;

        if (!tabId) {
            sendResponse({ success: false, error: 'Could not determine target tab' });
            return;
        }

        // Use IIFE for async handling
        (async () => {
            try {
                await executeLocalScript(msg.scriptName, tabId);
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Important: indicates async response
    }
});

