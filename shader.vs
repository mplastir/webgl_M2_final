
attribute vec2 aVertexPosition;
attribute vec2 texCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float UZpos;

varying vec2 tCoords;
//copie des coordonnées de texture

void main(void) {
	tCoords = texCoords;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, UZpos, 1.0);
}
