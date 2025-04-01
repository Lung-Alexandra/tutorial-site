import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextType {
    theme: PaletteMode;
    toggleTheme: () => void;
}

const defaultContextValue: ThemeContextType = {
    theme: 'light',
    toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState<PaletteMode>('light');
    const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as PaletteMode;
        if (savedTheme) {
            setTheme(savedTheme);
        }
        setIsThemeLoaded(true); // Indicate that the theme is loaded
    }, []);

    if (!isThemeLoaded) {
        return null;
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const muiTheme = createTheme({
        palette: {
            mode: theme,
        },
    });

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <MUIThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
