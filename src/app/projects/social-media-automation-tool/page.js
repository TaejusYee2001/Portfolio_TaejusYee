import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/ProjectPages.module.css';

const SocialMediaTool = () => {
  return(
    <div className={styles.container}>
      <Navbar/>
      <div className={styles.mainContent}>
        <div className={styles.title}>
					AI Social Media Automation Tool
				</div>
        <div className={styles.linkContainer}>
					<a
						href="https://github.com/TaejusYee2001/TikTok-Bot"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.linkButton}
					>
						View On GitHub
					</a>
        </div>
        <div className={styles.descriptionContainer}>
          <h1>
            Description:
          </h1>
          <p>
            This project explores the automation and generation of viral social media content accounts and archetypes. Launched as a tool for transforming funny and engaging stories
            on <a href="https://www.reddit.com/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Reddit</a> into short-form social media videos, it has become a generic pipeline for automatically generating and 
            uploading any story or narrative-based content to a social media platform of choice using the latest AI models for audio and video. 
          </p>
        </div>
        <div className={styles.videoContainer}>
          <video
						src="/tiktok.mp4"
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
            <b>Getting Text</b>
          </p>
          <p>
            The first part of the content generation process is getting the story: for Reddit, content must be scraped or fetched via an API. We implemented a webscraper using <a href="https://www.selenium.dev/documentation/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Selenium</a> and <a href="https://beautiful-soup-4.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>BeautifulSoup</a> to
            fetch text data from the website while bypassing anti-bot mechanisms using smart browser automation and pagination techniques.
          </p>
          <p>
            <b>Text-To-Speech</b>
          </p>
          <p>
            Next, we leveraged <a href="https://github.com/coqui-ai/TTS" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Coqui.ai's TTS library</a> to use customizable and trainable text-to-speech models for generating realistic audio samples from the input text data. This allowed us to filter out innappropriate words, specify pronunciation for abbreviations and contractions, manage the speaking speed, and test 
            different voices to measure the impact on virality and video traction upon launch.   
          </p>
          <p>
            <b>Subtitle Generation</b>
          </p>
          <p>
            With high quality audio samples ready to go, we needed a way to generate subtitles to keep viewers engaged on each post. To achieve this, we used <a href="https://openai.com/index/whisper/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>OpenAI's Whisper model</a> to 
            recognize and timestamp the speech from the generated audio files at individual word levels. 
          </p>
          <p>
            <b>Video Composition</b>
          </p>
          <p>
            With all the previous pieces in hand, it was now just a matter of assembling everything into a cohesive video format. To stitch together the final output videos, we used <a href="https://ffmpeg.org/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>FFmpeg</a>, a cross-platform solution for editing and streaming audio and video. 
          </p>
          <h1>
            Deployment and Analysis:
          </h1>
          <p>
            <b>Docker</b>
          </p>
          <p>
            One of the main advantages of automating the content generation process is being able to standardize and deploy multiple instances of the pipeline. To streamline this process, 
            we containerized our application using <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Docker</a>, allowing us to run the generation script on any Docker-compatible machine, and giving us the freedom to make an automated scheduler to run the container remotely.
          </p>
          <p>
            <b>Automated Uploads</b>
          </p>
          <p>
            Although we had developed the full content generation pipeline at this point, we still needed a way to automate uploads to our social media pages. To do this, we used <a href="https://github.com/makiisthenes/TiktokAutoUploader" target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>TiktokAutoUploader</a>, an open-source repository for uploading videos programmatically.
          </p>
          <h1>
            Results and Insights:
          </h1>
          <p>
            This project is still in development. Stay tuned for more insights as we observe how the content is recieved accross different platforms!
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default SocialMediaTool