import Script from 'next/script'

export default function IFSPage() {
  return (
    <div>
      <Script src="webpack/IFS.bundle.js"/>
      <div id="main" style={{backgroundColor: '#f5f5f5', padding: 20 + 'px', borderRadius: 2.1 + 'rem', border: 1 + 'px' + 'solid #4141ff'}}>
        <div id="canvas-container"> </div>
        <canvas style={{marginBottom: 0.5+ 'rem', imageRendering: "pixelated"}}
          id="canvas" width="300" height="300"></canvas>
        <div id="report"></div>
      </div>
      <div id="presets">
        <input style={{backgroundColor: "#ddd"}} type="button" value="Binary Tree" alt="binaryTree"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="Serpinski" alt="serpinski"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="Sand Dollar" alt="sandDollar"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="Maple Leaf" alt="mapleLeaf"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="Barnsley Fern" alt="barnsleyFern"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="Koch Snowflake" alt="koch"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="Random" alt="random"/>
      </div>
      <div id='lock-box' style={{visibility: "hidden"}}>
        <input id='check-box' type='checkbox' value='Keep current random transformation' defaultChecked/>
        Lock current transformation (rather than generating a new pattern each time)
      </div>
      <h4 id="frame-title">↑ Choose an image to generate ↑</h4>
      <div id='slide-controls' hidden={true}>
        <input style={{backgroundColor: "#ddd"}} type="button" value="previous slide" id="previous-button"/>
        <input style={{backgroundColor: "#ddd"}} type="button" value="next slide" id="next-button"/>
      </div>
      <div id="frame-description-container">
        <p style={{padding: "0.5 + rem + 1 rem", borderTop: "1 + px solid #333333", fontSize: 1.1 + "em"}} id="frame-description">
        </p>
      </div>
    </div>

  )
}

// MAIN DIV STYLE
// style=""
