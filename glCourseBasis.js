
// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var floatZ = -0.1;
var floatSeuil = 0.0;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
var n=361;
var alpha=0.5;
var texture = [];
mat4.identity(objMatrix);
var Lut1=[0.0, 0.9, 0.0];
var	Lut2=[0.0, 0.9, 0.9];
var	Lut3=[0.0, 0.0, 0.9];
var	Lut4=[0.9, 0.0, 0.9];
var	Lut5=[0.9, 0.0, 0.0];
var Choix = true;
var col = 0;


// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	initGL(canvas);
	initBuffers();

	for (i=0; i<10; i++){
		initTexture("image-0000"+i+".jpg", i);
	}

	for (i=10; i<100; i++){
		initTexture("image-000"+i+".jpg", i);
	}

	for (i=100; i<n; i++){
		initTexture("image-00"+i+".jpg", i);
	}

	
	
	loadShaders('shader');

	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	gl.enable(gl.DEPTH_TEST);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

	drawScene();
	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

// =====================================================
function initBuffers() {
	// Vertices (array)
	vertices = [
		-0.3, -0.3,
		-0.3,  0.3,
		 0.3,  0.3,
		 0.3, -0.3];
	vertexBuffer = gl.createBuffer(); //création du carré
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); //envoie du tableau
	vertexBuffer.itemSize = 2; //3D
	vertexBuffer.numItems = 4; //4 sommets

	// Texture coords (array) = comment la texture va se mettre sur la forme
	// coordonnées toujours entre 0 et 1
	texcoords = [ 
		  1.0, 0.0,
		  1.0, 1.0,
		  0.0, 1.0,
		  0.0, 0.0 ];
	texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	texCoordBuffer.itemSize = 2;
	texCoordBuffer.numItems = 4;
	
	// Index buffer (array)
	var indices = [ 
		0, 1, 2, 0, 2, 3];
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = indices.length;
	
}


// =====================================================
function initTexture(name, i)
{
	var texImage = new Image();
	texImage.src = name;


	texture[i] = gl.createTexture();
	texture[i].image = texImage;

	texImage.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture[i]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture[i].image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.activeTexture(gl.TEXTURE0);
	}
}



// =====================================================
function loadShaders(shader) {
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { vertShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(ext=='.fs') { fragShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(shadersLoaded==2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    }
  }
  xhttp.open("GET", filename+ext, true);
  xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.texCoordsAttribute = gl.getAttribLocation(shaderProgram, "texCoords");
	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);
	
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	shaderProgram.floatZ = gl.getUniformLocation(shaderProgram, "UZpos");
	shaderProgram.floatSeuil = gl.getUniformLocation(shaderProgram, "USeuil");
	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "UAlpha");
	
	shaderProgram.col = gl.getUniformLocation(shaderProgram, "UCol");
	shaderProgram.Lut1 = gl.getUniformLocation(shaderProgram, "ULut1");
	shaderProgram.Lut2 = gl.getUniformLocation(shaderProgram, "ULut2");
	shaderProgram.Lut3 = gl.getUniformLocation(shaderProgram, "ULut3");
	shaderProgram.Lut4 = gl.getUniformLocation(shaderProgram, "ULu4");
	shaderProgram.Lut5 = gl.getUniformLocation(shaderProgram, "ULut5");
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
     	vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texCoordsAttribute,
      	texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

}


// =====================================================
function setMatrixUniforms() {
	if(shaderProgram != null) {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		gl.uniform1f(shaderProgram.floatSeuil, floatSeuil);
		gl.uniform1f(shaderProgram.alpha, alpha);
		gl.uniform1i(shaderProgram.col, col);
		gl.uniform3fv(shaderProgram.Lut1, Lut1)
		gl.uniform3fv(shaderProgram.Lut2, Lut2)
		gl.uniform3fv(shaderProgram.Lut3, Lut3)
		gl.uniform3fv(shaderProgram.Lut4, Lut4)
		gl.uniform3fv(shaderProgram.Lut5, Lut5)
	}
}

// =====================================================
function setZPos(floatZ) {
	if(shaderProgram != null) {
		gl.uniform1f(shaderProgram.floatZ, floatZ);
	}
}



// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if(shaderProgram != null) {

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
		mat4.multiply(mvMatrix, objMatrix);

		setMatrixUniforms();

		if (Choix){
			for (i=0; i<n; i++){
				if (i<10){
					gl.bindTexture(gl.TEXTURE_2D,texture[i]);
				
					setZPos((i-n/2)/500);
					gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}else if (i<100){
					gl.bindTexture(gl.TEXTURE_2D,texture[i]);
				
					setZPos((i-n/2)/500);
					gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}else{
					gl.bindTexture(gl.TEXTURE_2D,texture[i]);
				
					setZPos((i-n/2)/500);
					gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}
			}
		}else{
			setZPos(0.0);
			gl.bindTexture(gl.TEXTURE_2D,texture[n]);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}	
}
 