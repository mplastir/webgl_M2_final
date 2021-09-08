
precision mediump float;

varying vec2 tCoords;

uniform vec3 ULut1;
uniform vec3 ULut2;
uniform vec3 ULut3;
uniform vec3 ULut4;
uniform vec3 ULut5;

uniform int UCol;

uniform sampler2D uSampler;
uniform float USeuil;
uniform float UAlpha;

void main(void) {
	vec3 V3;
	vec3 V32;
	V3[0] = texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r;
	V3[1] = texture2D(uSampler, vec2(tCoords.s, tCoords.t)).g;
	V3[2] = texture2D(uSampler, vec2(tCoords.s, tCoords.t)).b;

	if(UCol==0){
		if (V3[0]<=0.2){
			V32=ULut1;
		}else if(V3[0]<=0.4){
			V32=ULut2;
		}else if(V3[0]<=0.6){
			V32=ULut3;
		}else if(V3[0]<=0.8){
			V32=ULut4;
		}else{
			V32=ULut5;
		}

		if (V3[0]<USeuil){
			gl_FragColor = vec4(V32, 0.0);
		}else{
			gl_FragColor = vec4(V32, UAlpha);
		}
	}else{
		if (V3[0]<USeuil){
			gl_FragColor = vec4(V3, 0.0);
		}else{
			gl_FragColor = vec4(V3, UAlpha);
		}
	}
	
}

