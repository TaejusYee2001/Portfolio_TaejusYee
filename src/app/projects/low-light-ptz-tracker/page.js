import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/ProjectPages.module.css';

const LowLightPTZTracker = () => {
	return (
		<div className={styles.container}>
			<Navbar />
			<div className={styles.mainContent}>
				<div className={styles.title}>
					Low-Light Pan-Tilt-Zoom Camera Object Tracker
				</div>
				<div className={styles.linkContainer}>
					<a
						href="https://github.com/TaejusYee2001/Low-Light_PTZ_Object_Tracker"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}
					>
						View On GitHub
					</a>
					<a 
						href="/GTC_Poster.jpg" 
						download 
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}>
						Download Research Poster
					</a>
					<a 
						href="https://www.youtube.com/playlist?list=PLtY1Eh6aIPqeaE5KJK5fdgZcCHsUUATuC" 
						download 
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}>
						View YouTube Playlist
					</a>
				</div>
				<div className={styles.descriptionContainer}>
					<h1>Description:</h1>
					<p>
						The ability to track and monitor objects in real-time has become an indispensable
						requirement for a wide range of applications, from surveillance and security to
						automation and robotics. This project responds to the challenges posed by low-light
						environments by combining the edge-compute capabilities of NVIDIA's Jetson Nano,
						the precision and versatility of Pan-Tilt-Zoom (PTZ) cameras, and the sophistication
						of <a href="https://github.com/JalaliLabUCLA/phycv" 
						target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Physics Inspired Computer Vision (PhyCV)</a> algorithms to achieve real-time object tracking in light-constrained
						environments. This project was featured as a <a href="https://www.nvidia.com/gtc/posters/?search=Physics%20Inspired#/session/1705022965922001O2as" 
						target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>poster presentation</a> at NVIDIA's GPU Technology
						Conference (GTC) 2024. 
					</p>
				</div>
				<div className={styles.imageContainer}>
					<img
						src="/GTC_Poster.jpg"
						alt="Low Light Enhancement"
						className={styles.posterImage}
					/>
				</div>
				<div className={styles.videoContainer}>
					<video
						src="/tracking.mp4"
						className={styles.video}
						autoPlay
						loop
						muted
					/>
				</div>
				<div className={styles.descriptionContainer}>
					<h1>
						Implementation:
					</h1>
					<p>
						The project aimed to demonstrate how PhyCV can enhance computer vision applications on the edge, particularly in 
						low-light environments. This was achieved by implementing an accelerated version of the <a href="https://elight.springeropen.com/articles/10.1186/s43593-022-00034-y" 
						target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Vision Enhancement via 
						Virtual Diffraction and Coherent Detection (VEViD) algorithm</a>, optimized for the Jetson Nano — a small, single-board 
						computer developed by NVIDIA. The algorithm was integrated with <a href="https://github.com/dusty-nv/jetson-inference" 
						target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>NVIDIA’s Jetson Inference object detection library</a> to enable real-time 
						object detection from a live camera feed. Additionally, a pan-tilt-zoom (PTZ) camera was connected to the Jetson to 
						demonstrate improved object tracking in low-light conditions.
					</p>
					<h1>
						Results:
					</h1>
					<p>
						The C++ algorithm implementation (in native CUDA) achieved about 2x runtime improvement and 7x memory efficiency in comparison
						to the Python implementation. 
					</p>
				</div>
				<div className={styles.imageContainer}>
					<img
						src="/performance.png"
						alt="Algorithm Performance"
						className={styles.posterImage}
					/>
				</div>
				<div className={styles.descriptionContainer}>
					<p>
						Object detection results improved dramatically when low-light enhancement with VEViD was utilized. Importantly, since VEViD is 
						low-dimensional and requires no training or inference, algorithm preprocessing can be done quickly and integrated into the object
						detection pipeline with little overhead. 
					</p>
				</div>
				<div className={styles.imageContainer}>
					<img
						src="/object_detection.png"
						alt="Object Detection Results"
						className={styles.posterImage}
					/>
				</div>
				<div className={styles.descriptionContainer}>
					<p>
						For a more detailed explanation of the project details, check out this <a href="https://www.youtube.com/playlist?list=PLtY1Eh6aIPqeaE5KJK5fdgZcCHsUUATuC" 
						target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>YouTube playlist</a>.
					</p>
					<h1>
						More:
					</h1>
					<p>
						Real-time low-light enhancement:
					</p>
				</div>
				<div className={styles.videoContainer}>
					<video
						src="/vevid_person.mp4"
						className={styles.video}
						autoPlay
						loop
						muted
					/>
				</div>
				<div className={styles.descriptionContainer}>
					<p>
						PTZ camera tracking:
					</p> 
				</div>
				<div className={styles.videoContainer}>
					<video
						src="/tracking_orig.mp4"
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

export default LowLightPTZTracker;
