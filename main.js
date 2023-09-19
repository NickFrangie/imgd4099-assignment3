import { default as seagulls } from "./seagulls.js";
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.1/dist/tweakpane.min.js';

const params = { feed: 0.055, kill: 0.062, diffusionA: 1.0, diffusionB: .5, timescale: 1 };
let sg;

// Setup
function setup() {
  // Tweakpane
  const pane = new Pane();
  pane
    .addBinding(params, 'feed', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.feed = e.value; });
  pane
    .addBinding(params, 'kill', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.kill = e.value; });
  pane
    .addBinding(params, 'diffusionA', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.diffusionA = e.value; });
  pane
    .addBinding(params, 'diffusionB', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.diffusionB = e.value; });
  // pane
  //   .addBinding(params, 'timescale', { min: .8, max: 4 })
  //   .on('change',  e => { sg.uniforms.timescale = e.value; });
  pane
    .addButton({ title: 'Reset' })
    .on('click', main );
}

async function main() {    
  // Variables
  sg = await seagulls.init();
  const frag = await seagulls.import("./frag.wgsl"),
        compute = await seagulls.import("./compute.wgsl");
    
  const render = seagulls.constants.vertex + frag;
  
  const size = window.innerWidth * window.innerHeight,
        stateA = new Float32Array(size),
        stateB = new Float32Array(size);
  
  const workgroups = [
    Math.round(window.innerWidth / 8), 
    Math.round(window.innerHeight / 8), 
    1
  ]
  
  for( let i = 0; i < size; i++ ) {
    stateA[i] = Math.round(Math.random());
    stateB[i] = Math.round(Math.random());
  }

  
  // Seagull
  sg.buffers({ stateA1:stateA, stateA2:stateA, stateB1:stateB, stateB2:stateB })
    .uniforms({ 
      resolution: [window.innerWidth, window.innerHeight],
      feed: params.feed,
      kill: params.kill,
      diffusionA: params.diffusionA,
      diffusionB: params.diffusionB,
      timescale: params.timescale
    })
    .backbuffer(false)
    .pingpong(1)
    .compute(
      compute,
      workgroups,
      { pingpong: ["stateA1", "stateB1"] }
    )
    .render(render)
    .run();
}

setup();
main();