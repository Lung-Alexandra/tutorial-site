import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = ({ nav }) => {
    const router = useRouter();
    // Starea pentru foldere expandate
    const [expandedFolders, setExpandedFolders] = useState({});

    // Luăm structura arborescentă din navigare
    const navTree = nav && nav.tree ? nav.tree : {};

    // Debug
    console.log("Navigation structure:", navTree);

    // Setează folderul activ ca expandat inițial
    useEffect(() => {
        if (router.asPath) {
            // Împărțim calea curentă în componente
            const pathParts = router.asPath.split('/').filter(Boolean);

            // Initializăm un obiect pentru folderele expandate
            const initialExpanded = {};

            // Expandăm toate folderele principale pe pagina tutorial sau subdirectoare
            if (pathParts[0] === 'tutorial') {
                // În primul rând, expandăm toate folderele principale
                Object.keys(navTree).forEach(key => {
                    initialExpanded[key] = true;
                });

                // Apoi, dacă suntem într-un subdirector, expandăm și calea curentă
                if (pathParts.length > 1) {
                    let expandPath = '';
                    for (let i = 0; i < pathParts.length; i++) {
                        expandPath = expandPath ? `${expandPath}/${pathParts[i]}` : pathParts[i];
                        initialExpanded[expandPath] = true;
                    }
                }

                setExpandedFolders(initialExpanded);
            }
        }
    }, [router.asPath, navTree]);

    // Funcție pentru expandarea/restrângerea unui folder
    const toggleFolder = (folderPath) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderPath]: !prev[folderPath]
        }));
    };

    // Verifică dacă avem elemente de navigare
    if (!navTree || Object.keys(navTree).length === 0) {
        return (
            <nav className="sidebar">
                <div className="sidebar-content">
                    <h2>Secțiuni Tutorial</h2>
                    <p>Nu există secțiuni disponibile.</p>
                </div>
            </nav>
        );
    }

    // Funcție recursivă pentru a construi navigarea
    const renderNavigation = (items, parentPath = '') => {
        if (!items || Object.keys(items).length === 0) {
            return null;
        }

        return (
            <ul className={parentPath ? (expandedFolders[parentPath] ? "nav-list expanded" : "nav-list") : "nav-list"}>
                {Object.entries(items).map(([name, value]) => {
                    // Construim calea curentă pentru acest element
                    const currentPath = parentPath ? `${parentPath}/${name}` : name;

                    // Dacă valoarea are o proprietate path, înseamnă că este un fișier
                    if (value && typeof value === 'object' && value.path) {
                        // Este un fișier (are proprietatea path)
                        const isActive = router.asPath === value.path;

                        return (
                            <li key={value.path} className={isActive ? 'active' : ''}>
                                <Link href={value.path} legacyBehavior>
                                    <a>
                                        {name}
                                    </a>
                                </Link>
                            </li>
                        );
                    } else if (value && typeof value === 'object') {
                        // Este un folder (conține alte elemente)
                        const isExpanded = expandedFolders[currentPath] || false;

                        // Verificăm dacă folderul curent este pe calea activă
                        const isOnActivePath = router.asPath.includes(currentPath.toLowerCase());

                        return (
                            <li key={name} className="nav-category">
                                <div
                                    className={`folder-name ${isOnActivePath ? 'active' : ''}`}
                                    onClick={() => toggleFolder(currentPath)}
                                >
                                    <span className="expand-icon">
                                        {isExpanded ? '▼' : '►'}
                                    </span>
                                    {name}
                                </div>
                                {renderNavigation(value, currentPath)}
                            </li>
                        );
                    }

                    return null;
                })}
            </ul>
        );
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-content">
                <h2>Secțiuni Tutorial</h2>
                {renderNavigation(navTree)}
            </div>
        </nav>
    );
};

export default Navigation; 