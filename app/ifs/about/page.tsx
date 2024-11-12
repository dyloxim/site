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

          <br/><h2>
                 Interaction
               </h2>
          <br/>

          <h3>Demo and Introduction</h3>

          <div className={styles.demoClipWrapper}>
            <video className={styles.demoClip} controls>
              <source src="/media/ifs/ifs_demo.webm" type="video/webm"/>
            </video>
          </div>


          <p>
            Works best on desktop. Tap the background to show the control points, and change the image by dragging these points around. Scale the display area with the pinch-to-zoom gesture or with CTRL-[mouse wheel], and move around the image by dragging the background.
          </p>
          <br/>

          <h3>Keyboard & Mouse Controls</h3>

          <ul>
            <li><b>space</b>: start/stop the drawing process</li>
            <li><b>backspace</b>: when a function is selected, remove that function</li>
            <li><b>cmd/meta + drag</b>: duplicate a function</li>
          </ul>
          <br/>

          <h3>modifier key actions</h3>

          <p>When dragging function system control points holding down different modifier keys will change the reulting behaviour, effects are as follows;</p>

          <br/>

          <h4>translation vector:</h4>
          <ul>
            <li><b>alt</b>: constrain to nearest point lying on either horizontal, vertical,
              or diagonal</li>
            <li><b>ctrl</b>: snap to grid with 0.1 increments</li>
          </ul>

          <h4>individual basis vectors</h4>
          <ul>
            <li><b>alt</b>: constrain basis to its original span</li>
            <li><b>shift</b>: allow rotation only</li>
            <li><b>ctrl</b>: snap to grid with 0.1 increments</li>
          </ul>

          <h4>combined basis vectors</h4>
          <ul>
            <li><b>no modifier</b>: keeps original angle between basis and ratio of lengths, allows rotation and proportional scaling</li>
            <li><b>meta/cmd</b>: allow proportional scaling only</li>
            <li><b>shift</b>: allow rotation only</li>
            <li><b>alt</b>: constrains each basis to its original span</li>
            <li><b>ctrl</b>: snap to grid with 0.1 increments</li>
          </ul>

          <br/>
          <h2>
            Code
          </h2>
          <p><a href="https://github.com/dyloxim/site">View source</a></p>

          <br/>
          <h2>Related resources</h2>
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/Fractal-generating_software">Wikipedia - Fractal-generating software</a></li>
            <li><a href="https://www.larryriddle.agnesscott.org/ifs/ifs.htm">Larry Riddle, Agnes Scott College - IFS info page</a></li>
            <li><a href="https://ifstile.com/">IFS Tile - 'algebraic framework for finding and analyzing self-affine tiles and fractals'</a></li>
          </ul>

          <br/>
          <h2>Contact</h2>
          <pre className="email">wrrwvv (at) dyloxim.com</pre>
        </div>
      </div>
    </>
  )
}

export default About;
