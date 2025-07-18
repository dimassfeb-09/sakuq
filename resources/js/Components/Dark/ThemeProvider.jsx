import { createContext, useContext, useEffect, useState } from 'react';

const initialState = {
    theme: 'system',
    setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export default function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme', ...props }) {
    const [theme, setThemeState] = useState(defaultTheme);
    useEffect(() => {
        const savedTheme = localStorage.getItem(storageKey) || defaultTheme;
        setThemeState(savedTheme);
    }, [defaultTheme, storageKey]);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme == 'system') {
            const systemTheme = window.matchMedia('(prefers-color-schema: dark)');
            root.classListadd(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const setTheme = (newTheme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    };
    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context == undefined) throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
