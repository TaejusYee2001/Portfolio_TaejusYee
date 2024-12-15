import Feed from '@/components/Feed';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <Feed />
      </div>
      <Footer/>
    </div>
  );
}