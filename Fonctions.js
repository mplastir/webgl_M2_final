// =====================================================
function setSeuil(seuilCurseur) {
	floatSeuil = seuilCurseur;
}

// =====================================================
function setN(nCurseur) {
	n = nCurseur;
}

// =====================================================
function setChoix(){
    var C = document.getElementById("3D");
    var C2 = document.getElementById("2D");
    if (C.checked) Choix = true;
    else if (C2.checked) Choix = false;
}

// =====================================================
function setAlpha(alphaCurseur){
	alpha = alphaCurseur;
}

// =====================================================
function setCol(){
    var C = document.getElementById("Fausses couleurs");
    var C2 = document.getElementById("Niveau de gris");
    if (C.checked) col = 0;
    else if (C2.checked) col = 1;
}

// =====================================================
function convertHex(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16)/255;
    v = parseInt(hex.substring(2,4), 16)/255;
    b = parseInt(hex.substring(4,6), 16)/255;

    var rvb = [r,v,b];

    return rvb;
}

// =====================================================
function setCol1(){
    var c1 = document.getElementById("col1");
    Lut1 = convertHex(c1.value);
}

// =====================================================
function setCol2(){
    var c2 = document.getElementById("col2");
    Lut2 = convertHex(c2.value);
}

// =====================================================
function setCol3(){
    var c3 = document.getElementById("col3");
    Lut3 = convertHex(c3.value);
}

// =====================================================
function setCol4(){
    var c4 = document.getElementById("col4");
    Lut4 = convertHex(c4.value);
}

// =====================================================
function setCol5(){
    var c5 = document.getElementById("col5");
    Lut5 = convertHex(c5.value);
}