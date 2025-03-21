import Layout from '../../components/Layout';
import Link from 'next/link';
import { getNavigation } from '../../lib/navigation';

export default function TutorialIndex({ navigation }) {
    // Extragem structura plată pentru grupare
    const navFlat = navigation.flat || {};

    return (
        <Layout nav={navigation} metadata={{ title: 'All Tutorials', description: 'Browse all available tutorials' }}>
            <div className="tutorial-index">
                <h1>All Tutorials</h1>
                <p className="intro">Browse our complete collection of tutorials organized by categories.</p>

                <div className="tutorial-categories">
                    {Object.entries(groupByCategory(navFlat)).map(([category, items]) => (
                        <div key={category} className="category-section">
                            <h2>{formatCategoryName(category)}</h2>
                            <ul className="tutorial-list">
                                {items.map(item => (
                                    <li key={item.path}>
                                        <Link href={item.path} legacyBehavior>
                                            <a className="tutorial-list-item">
                                                <span className="title">{item.title}</span>
                                                <span className="arrow">→</span>
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

// Grupează tutorialele pe categorii
function groupByCategory(navigationFlat) {
    const categories = {};

    Object.entries(navigationFlat).forEach(([path, title]) => {
        const pathParts = path.split('/').filter(Boolean);

        // Ignorăm primul 'tutorial' din cale și verificăm să avem cel puțin o categorie
        if (pathParts.length >= 2 && pathParts[0] === 'tutorial') {
            const category = pathParts[1];

            if (!categories[category]) {
                categories[category] = [];
            }

            categories[category].push({
                path: path,
                title: title
            });
        }
    });

    // Sortăm tutorialele în fiecare categorie
    Object.keys(categories).forEach(category => {
        categories[category].sort((a, b) => a.title.localeCompare(b.title));
    });

    return categories;
}

// Formatează numele categoriei pentru afișare
function formatCategoryName(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function getStaticProps() {
    // Obținem structura de navigare
    const navigation = await getNavigation();

    return {
        props: {
            navigation
        },
        // Re-generare la fiecare 10 minute
        revalidate: 600
    };
} 