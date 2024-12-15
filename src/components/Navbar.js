import Link from 'next/link';
import styles from '../styles/components/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.name}>
        <p>Taejus Yee</p>
      </Link>
      <ul className={styles.navLinks}>
      <li><Link href="/projects" className={styles.navButton}>Projects</Link></li>
        <li><Link href="/resume" className={styles.navButton}>Resume</Link></li>
        <li><Link href="/about" className={styles.navButton}>About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar