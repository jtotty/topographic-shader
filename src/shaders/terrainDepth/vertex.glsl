#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

// This is used for computing an equivalent of gl_FragCoord.z that is as high precision as possible.
// Some platforms compute gl_FragCoord at a lower precision which makes the manually computed value better for
// depth-based postprocessing effects. Reproduced on iPad with A10 processor / iPadOS 13.3.1.
varying vec2 vHighPrecisionZW;

uniform float uTime;

#pragma glslify: getElevation = require('../partials/getElevation.glsl')

void main() {
	#include <uv_vertex>

	#include <skinbase_vertex>

	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	// #include <project_vertex>

	// Replacing the <project_vertex> to map our terrain height/depth for the bokeh shader
	vec4 position = vec4(transformed, 1.0);

	#ifdef USE_INSTANCING
    	position = instanceMatrix * position;
	#endif

	vec4 mPosition = modelMatrix * position;

	// float elevation = getElevation(mPosition.x + vec2(uTime * 0.0003, uTime * 0.0));
	float elevation = getElevation(mPosition.xyz + vec3(uTime * 0.0003, uTime * 0.0003, uTime * 0.0003));
  	mPosition.xyz *= elevation * 0.01;

	vec4 mvPosition = viewMatrix * mPosition;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vHighPrecisionZW = gl_Position.zw;
}