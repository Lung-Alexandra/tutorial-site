import Layout from '../components/Layout';

export default function Materials() {
    return (
        <Layout title="Materials">
            <div className="container">
                <h1>Materials</h1>
                <p>Materials and resources for learning OpenGL.</p>

                <div className="materials-list">
                    <div className="material-item">
                        <h2>Official Documentation</h2>
                        <p>
                            <a href="https://www.opengl.org/documentation/" target="_blank" rel="noopener noreferrer">
                                OpenGL Documentation
                            </a>
                        </p>
                    </div>

                    <div className="material-item">
                        <h2>Learn OpenGL</h2>
                        <p>
                            <a href="https://learnopengl.com/" target="_blank" rel="noopener noreferrer">
                                Learn OpenGL - Modern OpenGL Tutorials
                            </a>
                        </p>
                    </div>

                    <div className="material-item">
                        <h2>OpenGL Tutorials</h2>
                        <p>
                            <a href="http://www.opengl-tutorial.org/" target="_blank" rel="noopener noreferrer">
                                OpenGL Tutorial
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 