import React, {useEffect, useState} from 'react';
import {useTheme} from "../pages/ThemeContext";

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (theme === "dark") {
            document.body.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme'); // pentru compatibilitate
        } else {
            document.body.setAttribute('data-theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-theme');
        }
    }, [theme]);

    return (
        <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
};

export default ThemeToggleButton;
