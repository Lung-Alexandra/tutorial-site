import React, {useEffect, useState} from 'react';
import {useTheme} from "../pages/ThemeContext";

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    // Code that sets the theme in the old way
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.body.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme'); // pentru compatibilitate
        } else {
            document.body.setAttribute('data-theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    const toggleThemeOld = () => {
        setDarkMode(!darkMode);
    };

    return (
        <button onClick={() => {toggleTheme(); toggleThemeOld()}}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
};

export default ThemeToggleButton;
