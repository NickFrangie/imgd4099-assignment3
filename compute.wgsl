@group(0) @binding(0) var<uniform> res: vec2f;
@group(0) @binding(1) var<uniform> feed: f32;
@group(0) @binding(2) var<uniform> kill: f32;
@group(0) @binding(3) var<uniform> diffusionA: f32;
@group(0) @binding(4) var<uniform> diffusionB: f32;
@group(0) @binding(5) var<storage, read_write> stateAin: array<f32>;
@group(0) @binding(6) var<storage, read_write> stateAout: array<f32>;
@group(0) @binding(7) var<storage, read_write> stateBin: array<f32>;
@group(0) @binding(8) var<storage, read_write> stateBout: array<f32>;

fn index( x:i32, y:i32 ) -> u32 {
  let _res = vec2i(res);
  return u32( abs(y % _res.y) * _res.x + abs(x % _res.x ) );
}

@compute
@workgroup_size(8,8)
fn cs( @builtin(global_invocation_id) _cell:vec3u ) {
  let cell = vec3i(_cell);

  let i = index(cell.x, cell.y);
  let activeNeighbors = stateAin[ index(cell.x + 1, cell.y + 1) ] +
                        stateAin[ index(cell.x + 1, cell.y)      ] +
                        stateAin[ index(cell.x + 1, cell.y - 1) ] +
                        stateAin[ index(cell.x, cell.y - 1)      ] +
                        stateAin[ index(cell.x - 1, cell.y - 1) ] +
                        stateAin[ index(cell.x - 1, cell.y)      ] +
                        stateAin[ index(cell.x - 1, cell.y + 1) ] +
                        stateAin[ index(cell.x, cell.y + 1)      ];

  if( activeNeighbors == 2.0 ) {
    stateAout[i] = stateAin[i];
  }else if( activeNeighbors == 3.) {
    stateAout[i] = 1.;
  }else{
    stateAout[i] = 0.;
  }
}
