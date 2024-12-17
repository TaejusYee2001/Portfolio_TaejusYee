import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RefractionScene from '@/components/refraction/RefractionScene';
import OctreeScene from '@/components/octree/OctreeScene';
import styles from '@/styles/pages/ProjectPages.module.css';

const FlockingSim = () => {
  return(
		<div className={styles.container}>
			<Navbar/>
			<div className={styles.mainContent}>
        <div className={styles.title}>
          Refraction Simulation
        </div>
        <div className={styles.linkContainer}>
					<a
						href="https://github.com/TaejusYee2001/Portfolio_TaejusYee/tree/master/src/components/refraction"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}
					>
						See Code
					</a>
				</div>
        <div className={styles.descriptionContainer}>
          <h1>
            Description:
          </h1>
          <p>
            This project, inspired by this <a href="https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>blog post</a>, explores the physics of light refraction through an interactive computational simulation. It leverages
            modern web technologies and 3D graphics frameworks to create a dynamic visualization that allows real-time manipulation of 
            optical properties. In doing so, this simulation aims to provide an intuitive understanding of how light bends and transforms 
            when passing through transparent mediums. The implementation uses <a href="https://threejs.org/" 
						target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Three.js</a> and custom <a href="https://en.wikipedia.org/wiki/Shader" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>shader</a> techniques 
            to render the optical interactions. 
          </p>
        </div>
        {<RefractionScene/>}
        {/*<OctreeScene/>*/}
        <div className={styles.descriptionContainer}>
          <h1>
            Understading Optical Parameters
          </h1>
          <p>
            <b>Indices of Refraction</b>
          </p>
          <p>
            These indices describe the degree to which different colors of light bend when passing through a material. Usually, physicists think of refractive indices as a property of a material, however, for this simulation, it is easier to attach the refractive index to the color of the light instead.
            This is because each color (red, green, blue, cyan, yellow, purple) has a unique frequency and wavelength, and thus, when travelling through any medium, a unique speed as well. This means that a given color of light bends slightly differently than any other color when passing through a transparent material. 
            In this simulation, each color's index determines how much that color will be transformed and bent by the material.
          </p>
          <p>
            <b>Refraction Power</b>
          </p>
          <p>
            This parameter controls the overall intensity of light bending and distortion. A property of the material, this parameter would be the closest to the <a href="https://en.wikipedia.org/wiki/Refractive_index" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>refractive index</a> physicists are familiar with.
          </p>
          <p>
            <b>Chromatic Aberration</b>
          </p>
          <p>
            Chromatic aberration simulates the optical distortion that naturally occurs when different color wavelengths focus at slightly different points, mimicking the imperfections found in optical systems like camera lenses or complex natural materials. This phenomenon creates subtle color fringing and slight color separations 
            at material edges, adding a realistic and nuanced quality to light interactions that captures the inherent complexity of how light behaves when passing through different mediums.
          </p>
          <p>
            <b>Saturation</b>
          </p>
          <p>
            Saturation controls the intensity and purity of colors in the simulation, acting as a dynamic color control mechanism. At a value of 1.0, colors appear in their natural, original state. When values fall below 1.0, colors become increasingly desaturated, transforming into muted, grayish tones, while values above 1.0 
            intensify colors, making them more vibrant and vivid. This parameter allows for both artistic expression and perceptual manipulation of the visual output, providing a powerful tool for adjusting the visual aesthetic of the simulation.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FlockingSim; 
