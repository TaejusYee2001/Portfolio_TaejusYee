import Link from 'next/link';
import styles from '../styles/components/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>
            Copyright {new Date().getFullYear()} Taejus Yee - All rights reserved.
        </p>
        <ul className={styles.socialLinks}>
          <li>
            <Link 
              href="https://github.com/TaejusYee2001" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <img 
                src="/github_logo.png" 
                alt="GitHub" 
                className={`${styles.logoImage} ${styles.githubLogo}`}
              />
            </Link>
          </li>
          <li>
            <Link 
              href="https://linkedin.com/in/taejusyee" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <img 
                src="/linkedin_logo.png" 
                alt="LinkedIn" 
                className={`${styles.logoImage} ${styles.linkedinLogo}`}
              />
            </Link>
          </li>
          <li>
            <Link 
              href="https://instagram.com/taejithejedi" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <img 
                src="/instagram_logo.png" 
                alt="Instagram" 
                className={`${styles.logoImage} ${styles.instagramLogo}`}
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;