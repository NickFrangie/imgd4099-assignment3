@group(0) @binding(0) var<uniform> res: vec2f;
@group(0) @binding(1) var<uniform> feed: f32;
@group(0) @binding(2) var<uniform> kill: f32;
@group(0) @binding(3) var<uniform> diffusionA: f32;
@group(0) @binding(4) var<uniform> diffusionB: f32;
@group(0) @binding(5) var<storage> stateA: array<f32>;
@group(0) @binding(7) var<storage> stateB: array<f32>;

@fragment 
fn fs( @builtin(position) pos : vec4f ) -> @location(0) vec4f {
  let idx : u32 = u32( pos.y * res.x + pos.x );
  let v = stateA[ idx ];
  return vec4f( v,v,v, 1.);
}
