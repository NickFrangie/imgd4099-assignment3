import { default as seagulls } from "./seagulls.js";
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.1/dist/tweakpane.min.js';

async function main() {  
  // Tweakpane
  const params = { feed: 0.5, kill: 0.5, diffusionA: .75, diffusionB: .75}
  const pane = new Pane();
  pane
    .addBinding(params, 'feed', { min: 0, max: 1 })
    .on('change',  e => { params.feed = e.value; })
  pane
    .addBinding(params, 'kill', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.kill = e.value; })
  pane
    .addBinding(params, 'diffusionA', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.diffusionA = e.value; })
  pane
    .addBinding(params, 'diffusionB', { min: 0, max: 1 })
    .on('change',  e => { sg.uniforms.diffusionB = e.value; })
  
  // Variables
  const sg = await seagulls.init(),
        frag = await seagulls.import("./frag.wgsl"),
        compute = await seagulls.import("./compute.wgsl");
    
  const render = seagulls.constants.vertex + frag;
  
  const size = window.innerWidth * window.innerHeight,
        state = new Float32Array(size);

  const workgroups = [
    Math.round(window.innerWidth / 8), 
    Math.round(window.innerHeight / 8), 
    1
  ] 
  
  // Seagull
  sg.buffers({ stateA:state, stateB:state })
    .uniforms({ 
      resolution: [window.innerWidth, window.innerHeight],
      feed: params.feed,
      kill: params.kill,
      diffusionA: params.diffusionA,
      diffusionB: params.diffusionB
    })
    .backbuffer(false)
    .pingpong(1)
    .compute(
      compute,
      workgroups,
      { pingpong: ["stateA"] }
    )
    .render(render)
    .run();
}

main();