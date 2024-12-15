import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/Projects.module.css';

import Link from 'next/link';

const Projects = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <div className={styles.grid}>
          {/* Project 1: Low-Light PTZ Object Tracker */}
          <Link href="/projects/low-light-ptz-tracker" className={styles.project}>
            <video
              src="/tracking.mp4"
              className={styles.thumbnail}
              autoPlay
              loop
              muted
            />
            <p>Low-Light Pan Tilt Zoom Camera Object Tracker</p>
          </Link>

          {/* Project 2: Momentum-Based ETF Portfolio Optimization */}
          <Link href="/projects/momentum-based-etf-portfolio-automated-trading-strategy" className={styles.project}>
            <img 
              src="/ETF_flow_chart.png" 
              alt="ETF Portfolio Momentum-Based Automated Trading Strategy" 
              className={styles.thumbnail} 
            />
            <p>Momentum-Based ETF Portfolio Automated Trading Strategy</p>
          </Link>

          {/* Project 3: Social Media Automation Tool */}
          <Link href="/projects/social-media-automation-tool" className={styles.project}>
            <video
              src="/tiktok.mp4"
              className={styles.thumbnail}
              autoPlay
              loop
              muted
            />
            <p>AI Social Media Automation Tool</p>
          </Link>

          {/* Project 4: Sharpshooter */}
          <Link href="/projects/sharpshooter" className={styles.project}>
            <video
              src="/sharpshooter.mp4"
              className={styles.thumbnail}
              autoPlay
              loop
              muted
            />
            <p>Sharpshooter</p>
          </Link>

          {/* Project 5: Spectrogram Vision Transformer */}
          <Link href="/projects/spectrogram-vision-transformer" className={styles.project}>
            <img 
              src="/transformer.png" 
              alt="Spectrogram Vision Transformer" 
              className={styles.thumbnail} 
            />
            <p>Spectrogram Vision Transformer</p>
          </Link>

          {/* Project 6: Flocking Simulation */}
          <Link href="/projects/refraction-simulation" className={styles.project}>
            <video
              src="/refraction.mp4"
              className={styles.thumbnail}
              autoPlay
              loop
              muted
            />
            <p>Refraction Simulation</p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
