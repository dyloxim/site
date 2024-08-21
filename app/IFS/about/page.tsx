
const About = () => {
  return (
    <>
      <br/>

      <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
        <div style={{display: "block", width: "750px"}}>
          <br/>
          <p>This application creates images of <a href="https://en.wikipedia.org/wiki/Iterated_function_system">iterated function system</a> fractal sets.
          </p>
          <p>Taking a list of <a href="https://en.wikipedia.org/wiki/Affine_transformation">affine transformations</a> as its input, it then produces an image using the <a href="https://en.wikipedia.org/wiki/Chaos_game">chaos game</a> process.
          </p>

          <br/>
          <h3>Interaction</h3>
          <video style={{objectFit: "cover", objectPosition: "bottom left" }} width="700" height="441" controls>
            <source src="/IFSdemo.webm" type="video/webm"/>
          </video>
          <p>Control points can be revealed by clicking on the canvas, and moving these will mutate the loaded transforms. CTRL-[mouse wheel] or pinch zoom on trackpads and mobile will rescale the display area.</p>
          <p>The readout of loaded transforms beneath the main controls are interactive and changing these values will reload the dislpay.</p>

          <br/>
          <h3>Code</h3>
          <p>
            The core program is written in <a href="https://www.typescriptlang.org/">typescript</a>, the UI is written in <a href="https://react.dev/">react</a> and the website was built with <a href="https://nextjs.org/">nextjs</a> - code available <a href="https://github.com/dyloxim/site/tree/main/src/IFS">on github</a>.
          </p>

          <br/>
          <h3>See Also</h3>
          <ul>
            <li><a href="https://ifstile.com/">IFS Tile</a> - 'algebraic framework for finding and analyzing self-affine tiles and fractals'</li>
            <li><a href="https://www.larryriddle.agnesscott.org/ifs/ifs.htm">Larry Riddle, Agnes Scott College: IFS info page</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Fractal-generating_software">Wikipedia - Fractal-generating software</a></li>
          </ul>

          <br/>
          <h3>Contact</h3>
          <pre>wrrwvv (at) dyloxim.com</pre>

        </div>
      </div>
    </>
  )
}

export default About;
