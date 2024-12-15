import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/About.module.css';

const Projects = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <p>
          Hello, I’m Taejus! I’m a recent graduate in Mathematics of Computation, an interdisciplinary major that blends mathematics and
          computer science. Welcome to my personal site, where I showcase my work, thoughts, studies, and projects — ongoing and completed 
          alike.
        </p>
        <div className={styles.bioContent}>
          <img src='/profile.png'>
          </img>
          <div className={styles.bioText}>
            <p>
              Bio:
            </p>
            <p>
              I grew up in San Francisco, California, and graduated from San Francisco Waldorf High School in 2020. I went on to attend 
              University of California, Los Angeles, (UCLA) from 2020 to 2024, graduating with a B.S. in Mathematics of Computation. 
            </p>
            <p>
              During my time at UCLA, I explored the intersections of mathematics, computer science, and technology, working on projects 
              that combined cutting-edge research with real-world applications. As a researcher in the Jalali Lab, I developed a low-light 
              optimized pan-tilt-zoom camera tracking system and accelerated proprietary algorithms with GPU-optimized Python and C++ 
              implementations. These efforts earned me the opportunity to present at NVIDIA's GPU Technology Conference in 2024.
            </p>
            <p>
              In addition to research, I interned at Wireless Photonics, where I designed control software for free-space optical 
              communication systems and fine-tuned laser signal quality using mathematical optimization algorithms. I also worked with 
              BASF VC during a summer capstone internship, evaluating the scalability and market potential of early-stage startups, 
              ultimately delivering investment recommendations to senior executives.
            </p>
            <p>
              A little about me:
            </p>
            <p>
              Throughout my life, I have always been drawn to the intersections between disciplines (often more than the individual 
              disciplines themselves). This passion is reflected in my choice of major: I’m fascinated by how mathematical theories can 
              revolutionize computational algorithms and how modern computational tools can reveal new mathematical insights through 
              visualization, simulation, and analysis.
            </p>
            <p>
              This desire to learn about the interconnectedness of things extends beyond my academic and professional pursuits as well. 
              In my free time, I enjoy traveling, drawing, reading, exercising, and playing the piano. These many passions are central 
              to my identity, and have not only helped me tackle software development from unique perspectives, but also have given me 
              an appreciation for the vast variety of forces that converge to shape our human experience. 
            </p>
            <p>
              It is for this reason that I launched this website — to create a space where I can archive and present my work, share my 
              thoughts, and showcase the projects that reflect my journey and interests. Enjoy!
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Projects;