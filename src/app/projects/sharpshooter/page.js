import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/ProjectPages.module.css';

const Sharpshooter = () => {
	return(
		<div className={styles.container}>
			<Navbar/>
			<div className={styles.mainContent}>
				<div className={styles.title}>
					Sharpshooter
				</div>
				<div className={styles.linkContainer}>
					<a
						href="https://github.com/TaejusYee2001/Sharpshooter"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}
					>
						View On GitHub
					</a>
					<a
						href="https://taejusyee2001.github.io/Sharpshooter/"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}
					>
						Play The Game
					</a>
				</div>
				<div className={styles.descriptionContainer}>
					<h1>
						Description
					</h1>
					<p>
						Sharpshooter is a game created with <a href="https://webglsamples.org/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>WebGL</a>, a 
						JavaScript API for rendering high-performance interactive 3D and 2D graphics within the browser. The project uses custom lighting, shaders, and a custom WebGL wrapper, <a href="https://angusgibbs.github.io/tinyjs/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>tiny.js</a>, to implement 3D rendering techniques. An exploration of 3D rendering from a computational and artistic perspective, it features concepts and mechanics such as object modeling, collision detection, physics-based dart motion, and mouse-based interactivity to create a lively, fun, and engaging gameplay experience.
					</p>
				</div>
				<div className={styles.video}>
					<video
						src="/sharpshooter.mp4"
						className={styles.video}
						autoPlay
						loop
						muted
					/>
				</div>
			</div>
			<Footer/>
		</div>
	);
};

export default Sharpshooter; 