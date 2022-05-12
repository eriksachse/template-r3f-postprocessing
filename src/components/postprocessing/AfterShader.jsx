/**
 * Afterimage shader
 * I created this effect inspired by a demo on codepen:
 * https://codepen.io/brunoimbrizi/pen/MoRJaN?page=1&
 */

const AfterShader = {
  uniforms: {
    damp: { value: 0.96 },
    tOld: { value: null },
    tNew: { value: null },
    resolution: { value: null },
    time: { value: 0.0 },
    value1: { type: "f", value: 0.0 },
  },

  vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
		uniform float damp;
		uniform sampler2D tOld;
		uniform sampler2D tNew;
		varying vec2 vUv;
    uniform vec2 resolution;
    uniform float time;
    uniform float value1;

    float luminance (vec4 c) { 
        return (c.r+c.g+c.b)/5.; 
    }

		void main() {
      vec2 unit = value1 / resolution.xy;
      
      vec4 frame = texture(tOld, vUv);
      vec4 video = texture(tNew, vUv);
      
      float angle = luminance(frame) * 1.1;
      angle += time*0.2;
      angle += luminance(video) * 10.1;
      vec2 offset = vec2(sin(angle), cos(angle*10.)) * unit;
          
      frame = texture(tOld, vUv + offset);
      
      vec4 color = mix(frame, video, smoothstep(.2, .6, length(video-frame)));
      gl_FragColor = color;
		}`,
};

export { AfterShader };
