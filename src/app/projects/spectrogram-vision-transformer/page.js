import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/pages/ProjectPages.module.css';

const LowLightPTZTracker = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <div className={styles.title}>
            Spectrogram Vision Transformer
        </div>
        <div className={styles.linkContainer}>
        </div>
        <div className={styles.descriptionContainer}>
          <h1>Description:</h1>
          <p>
            This project aimed to recreate and expand upon the results in this <a href="https://arxiv.org/pdf/2403.11047" 
            target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>paper</a>, titled <i>From Pixels to Predictions: Spectrogram and Vision Transformer for Better Time Series Forecasting</i> and published by AI researchers at JP Morgan. 
            As a part of my work on image processing and computer vision during my time with the <a href="https://photonics.ucla.edu/" 
            target="_blank" rel="noopener noreferrer" className={styles.embeddedLink}>Jalali Lab</a> at UCLA, I was tasked with following the methodology, recreating the implementation of the prediction model, and applying our lab's physics-based algorithms to the input images to enhance the results described in the research. 
          </p>
          <p>
            The central idea of the paper is to use visual representations of time series data alongside vision AI models for predictions instead of leveraging traditional techniques in time series analysis. The reasoning is that frequency information, both spatial and temporal, is hypothesized to have predictive power, and this spatial and temporal frequency 
            information is more easily encoded in the visual domain. This allows a machine learning model to better understand how frequency information impacts complex time series dynamics, thereby improving its predictive power.
          </p>
        </div>
        <div className={styles.descriptionContainer}>
          <h1>
            Spectrograms:
          </h1>
          <p>
            The first task in recreating the paper results was to generate a dataset of spectrogram images (a sample can be seen below). A spectrogram is a visual representation of a signal's frequency content over time, displayed as a 2D image. The horizontal axis represents time increments, the vertical axis represents frequency components, and the color intensity at each point indicates the signal's amplitude or power at a specific frequency and time. 
            To obtain the frequency composition, wavelet transforms were used, which decompose the signal into scaled and shifted versions of a base wavelet. Unlike traditional Fourier transforms, wavelet transforms capture both time and frequency information simultaneously, making them particularly effective for non-stationary signals where frequency content changes over time. This process enables the creation of a detailed time-frequency map, as seen in the spectrogram.
          </p>
        </div>
        <div className={styles.imageContainer}>
					<img
						src="/spectrogram.png"
						alt="Spectrogram"
						className={styles.posterImage}
					/>
				</div>
        <div className={styles.descriptionContainer}>
          <h1>
            Machine Learning:
          </h1>
          <p>
            Once the spectrogram dataset was generated (from financial time series data), we began architecting and training a vision transformer to get predictions on the data. The transformer architecture can be seen below.
          </p>
        </div>
        <div className={styles.imageContainer}>
					<img
						src="/transformer.png"
						alt="Spectrogram"
						className={styles.posterImage}
					/>
				</div>
        <div className={styles.descriptionContainer}>
          <p>
            The spectrogram image is first divided into fixed size patches, which are flattened into vectors and linearly embedded into a higher dimensional space. Position embeddings are added to the patch embeddings to retain spatial information.
            The multi-head self-attention block then allows the model to focus on different parts of the image simultaneously, learning relationships and dependencies, and outputs a high-dimensional feature vector encoding the context. The multilayer perceptron head then processes the high-dimensional feature vector through its layers, reducing the dimensionality to the dimension 
            of the output label space. 
          </p>
          <h1>
            Results:
          </h1>
          <p>
            This project is still ongoing — results and code will be released upon completion.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LowLightPTZTracker;