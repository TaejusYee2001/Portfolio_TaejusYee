import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/pages/Resume.module.css";

const Resume = () => {
  return (
    <div className={styles.resume_page}>
      <Navbar />
      <div className={styles.pdf_container}>
        <div className={styles.download_button_container}>
          <a href="/resume.pdf" download className={styles.download_button}>
            Download PDF here
          </a>
        </div>
        <img src="/resume.png" alt="Resume" className={styles.img_viewer} />
      </div>
      <Footer/>
    </div>
  );
};

export default Resume;
