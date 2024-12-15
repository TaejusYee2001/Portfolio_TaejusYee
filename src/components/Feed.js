import Link from 'next/link';
import styles from '@/styles/components/Feed.module.css';

const Feed = () => {
  const projects = [
    { id: 1, title: 'Low-Light Pan Tilt Zoom Camera Object Tracker', link: '/projects/project1', image: '/dark_road.jpeg' },
    { id: 2, title: 'Momentum-Based ETF Portfolio Optimization', link: '/projects/project2', image: '/dark_road.jpeg' },
    { id: 3, title: 'Social Media Automation Tool', link: '/projects/project3', image: '/dark_road.jpeg' },
    { id: 4, title: 'Sharpshooter', link: '/projects/project4', image: '/dark_road.jpeg' },
  ];

  return (
    <div className={styles.feed}>
      {projects.map((project) => (
        <Link key={project.id} href={project.link} className={styles.project}>
          <img src={project.image} alt={project.title} className={styles.thumbnail} />
          <p>{project.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default Feed
