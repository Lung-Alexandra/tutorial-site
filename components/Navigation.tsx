import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {List, ListItem, ListItemText, Collapse, IconButton, Typography, ListItemButton} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {children} from "hastscript/lib/jsx-classic";

// Type definitions for navigation tree
type NavItem = {
    path?: string;
    [key: string]: NavItem | string | undefined;
};

interface NavigationProps {
    nav: {
        tree: Record<string, NavItem>;
    };
}

const Navigation: React.FC<NavigationProps> = ({ nav }) => {
    const router = useRouter();
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    const navTree = nav?.tree || {};

    useEffect(() => {
        const pathParts = router.asPath.split('/').filter(Boolean);
        const expanded: Record<string, boolean> = {};

        // Expand relevant folders based on the current path
        if (pathParts[0] === 'tutorial') {
            pathParts.slice(1).forEach((part, index) => {
                const path = pathParts.slice(1, index + 2).join('/');
                expanded[path] = true;
            });
        }

        setExpandedFolders(expanded);
    }, [router.asPath, navTree]);

    const toggleFolder = (folderPath: string) => {
        setExpandedFolders((prev) => ({ ...prev, [folderPath.toLowerCase()]: !prev[folderPath] }));
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const renderNavItems = (items: Record<string, NavItem>, parentPath = '', level = 0) => (
        <List component="div" disablePadding>
            {Object.entries(items).map(([name, value]) => {
                const currentPath = parentPath ? `${parentPath}/${name}` : name;

                // If it's a link
                if (typeof value === 'object' && (value as NavItem).path) {
                    const path = (value as NavItem).path;
                    const isActive = router.asPath === path;
                    return (
                        <ListItemButton
                            key={path}
                            selected={isActive}
                            onClick={() => handleNavigation(path)}
                            sx={{pl: 2*level+4}}
                        >
                            <ListItemText primary={name} sx={{fontWeight: isActive ? 'bold' : 'normal' }} />
                        </ListItemButton>
                    );
                }

                // If it's a folder
                if (typeof value === 'object') {
                    const isExpanded = expandedFolders[currentPath.toLowerCase()] || false;
                    return (
                        <>
                            <ListItemButton
                                key={value.path}
                                onClick={() => toggleFolder(currentPath)}
                                sx={{pl: 2*level}}
                            >
                                <IconButton>
                                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                                <ListItemText primary={name} />
                            </ListItemButton>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                {renderNavItems(value as Record<string, NavItem>, currentPath, level + 1)}
                            </Collapse>
                        </>
                    );
                }

                return null;
            })}
        </List>
    );

    return (
        <nav style={{flexShrink: 0, width: '100%' }}>
            <Typography variant="h6">
                Secțiuni Tutorial
            </Typography>
            {Object.keys(navTree).length === 0 ? (
                <Typography variant="body1">
                    Nu există secțiuni disponibile.
                </Typography>
            ) : (
                renderNavItems(navTree)
            )}
        </nav>
    );
};

export default Navigation;
