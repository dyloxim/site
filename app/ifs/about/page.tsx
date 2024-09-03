import styles from './about.module.css';
import type { Viewport } from 'next'
 
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const About = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>

          <p>
            This application creates images of <a href="https://en.wikipedia.org/wiki/Iterated_function_system">iterated function system</a> fractal sets.
          </p>

          <p>
            Taking a list of <a href="https://en.wikipedia.org/wiki/Affine_transformation">affine transformations</a> as its input, it then produces an image using the <a href="https://en.wikipedia.org/wiki/Chaos_game">chaos game</a> process.
          </p>

          <br/><h3>
                 Interaction
               </h3>

          <div className={styles.demoClipWrapper}>
            <video className={styles.demoClip} controls>
              <source src="/media/ifs/ifs_demo.webm" type="video/webm"/>
            </video>
          </div>

          <p>
            Works best on desktop. Click the background to show the control points and change the image by dragging these points around. Scale the display area with the pinch-to-zoom gesture or with CTRL-[mouse wheel].
          </p>

          <br/>
          <h3>
            Code
          </h3>
          <p><a href="https://github.com/dyloxim/site/tree/main/src/IFS">View source</a></p>

          <br/>
          <h3>Related resources</h3>
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/Fractal-generating_software">Wikipedia - Fractal-generating software</a></li>
            <li><a href="https://www.larryriddle.agnesscott.org/ifs/ifs.htm">Larry Riddle, Agnes Scott College - IFS info page</a></li>
            <li><a href="https://ifstile.com/">IFS Tile - 'algebraic framework for finding and analyzing self-affine tiles and fractals'</a></li>
          </ul>

          <br/>
          <h3>Contact</h3>
          <pre className="email">wrrwvv (at) dyloxim.com</pre>
        </div>
      </div>
    </>
  )
}

export default About;
