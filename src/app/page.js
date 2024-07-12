import '@styles/globals.css'


import Image from 'next/image'; 
import Navbar from '@components/Navbar';

import OctreeScene from '@components/OctreeScene/ThreeTestScene';
import HomeScene from '@components/HomeScene/HomeScene';



/*<Flocking/>*/
/*<OctreeScene/>*/
const Home = () => {
  return (
    <div className="h-full flex flex-col items-center">
      <HomeScene />
      <Navbar/>
      <div className="main_container w-full flex-center flex-col">
        <main className="font-jura bg-transparent">
          <h1 className="text-sky-400 text-center bg-transparent">
            Welcome to my personal portfolio!
            <br/>
            Click on the links below to try out the demos for yourself. 
          </h1>
        </main>
      </div>
      <div className="fixed_bottom_container">
        <Image
          src="/images/github-mark.png"
          width={40}
          height={40}
          alt="Github logo"
        />
        <Image
          src="/images/LI-In-Bug.png"
          width={49}
          height={49}
          alt="Linkedin logo"
        />
        <Image
          src="/images/Instagram_Glyph_Gradient.png"
          width={40}
          height={40}
          alt="Instagram logo"
        />
      </div>
    </div>
  )
}

export default Home
