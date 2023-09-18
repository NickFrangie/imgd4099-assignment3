import { default as seagulls } from './seagulls.js'
import { default as Video    } from './video.js'
import { default as Audio    } from './audio.js'

import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.1/dist/tweakpane.min.js';

var mouseX = null;
var mouseY = null;
var mouseDown = null;
    
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
document.body.onmousedown = (e) => {mouseDown = 1;};
document.body.onmouseup = (e) => {mouseDown = 0;};

function onMouseUpdate(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
}

async function main() {
  // Variables
  let time = 0;
  const params = { timeScale: 1, camMixer: .95, camColor: .75, feedback: .8, mouseColor: { r:1, g:0, b:0  } }
  
  // Tweakpane
  const pane = new Pane();
  pane
    .addBinding(params, 'timeScale', { min: 0, max: 2 })
    .on('change',  e => { params.timeScale = e.value; })
  pane
    .addBinding(params, 'camMixer', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.camMixer = e.value; })
  pane
    .addBinding(params, 'camColor', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.camColor = e.value; })
  pane
    .addBinding(params, 'feedback', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.feedback = e.value; })
  pane
    .addBinding(params, 'mouseColor', { color: { type:'float' } })
    .on('change',  e => { sg.uniforms.mouseColor = Object.values(e.value); })
  
  // Initialization
  const sg = await seagulls.init()
  const frag = await seagulls.import( './frag.wgsl' );
  document.body.onclick = Audio.start
  await Video.init()

  // Seagulls
  sg.uniforms({ 
    time:0, 
    res:[window.innerWidth, window.innerHeight],
    audio:[0,0,0],
    mouse:[0,0,0],
    camMixer: params.camMixer,
    camColor: params.camColor,
    feedback: params.feedback,
    mouseColor: Object.values( params.mouseColor )
  })
  .onframe( ()=> {
    time += params.timeScale / 10;
    
    sg.uniforms.time = time;
    sg.uniforms.audio = [ Audio.low, Audio.mid, Audio.high ];
    sg.uniforms.mouse = [ mouseX, mouseY, mouseDown];
  })
  .textures([ Video.element ]) 
  .render( frag )
  .run()
}

main()
