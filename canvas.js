
var context;

var fileTxt = "";

var hasFileBeingDrawn = false;

var keyWords = ["POINT", "LINE", "BEZIER", "POLYGON", "TEXT", "ARC"];

// Função: Acessa o objeto do canvas e pega o seu contexto 2D.
function getCanvas() {
	var canvas = document.getElementById('canvas');
	if (typeof(context) === 'undefined')
		context = canvas.getContext("2d");
}

// Função: Limpa o Canvas.
function clearCanvas(){
	if (typeof(context) !== 'undefined') {
		context.clearRect(0, 0, canvas.width, canvas.height);
		hasFileBeingDrawn = false;
	} else {
		console.error("Canvas's context not found.");
	}
}

// Função: Cria um texto no canvas dada posição e fonte do mesmo.
function createText(x, y, text, font){
	if (typeof(context) !== 'undefined') {
		context.font = font;
		context.strokeText(text, x, y);
	} else {
		console.error("Canvas's context not found.");
	}
}

// Função: Cria um arco de circulo usando as coordenadas x e y do centro, o raio do circulo, os angulos inicial e final.
function createArc(x, y, r, sAngle, eAngle){
	if (typeof(context) !== 'undefined') {
		context.beginPath();
		context.arc(x, y, r, sAngle * Math.PI, eAngle * Math.PI);
		context.stroke();
	} else {
		console.error("Canvas's context not found.");
	}
}

// Função: Cria um segmento de reta usando as coordendas x e y do ponto inicial e final.
function createLine(startPointX, startPointY, endPointX, endPointY) {
	if (typeof(context) !== 'undefined') {
		context.beginPath();
		context.moveTo(startPointX, startPointY);
		context.lineTo(endPointX, endPointY);
		context.stroke();
	} else {
		console.error("Canvas's context not found.");
	}
}

// Função: Cria um poligono usando um conjunto de pontos criando, assim, uma sequência de linhas.
function createPolygon(points) {
	if (typeof(context) !== 'undefined') {
		for (var i = 0; i < points.length; i = i + 4) {
			createLine(points[i], points[i + 1], points[i + 2], points[i + 3]);
		}
	} else {
		console.error("Canvas's context not found.");
	}
}

// Função: Cria uma curva de Bezier usando um ponto inicial, um ponto final e dois pontos de controle.
function createBezierCurve(startPointX, startPointY, endPointX, endPointY, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y){
	if (typeof(context) !== 'undefined') {
		context.beginPath();
		context.moveTo(startPointX, startPointY);
		context.bezierCurveTo(controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endPointX, endPointY);
		context.stroke();
	} else {
		console.error("Canvas's context not found.");		
	}
}

// Função: Cria uma curva quadrática usando um ponto inicial, um ponto final e um ponto de controle. (TÁ AQUI MAS DESCOBRI DEPOIS QUE NÃO PRECISAVA FAZER)
function createQuadraticCurve(startPointX, startPointY, endPointX, endPointY, controlPointX, controlPointY){
	if (typeof(context) !== 'undefined') {
		context.beginPath();
		context.moveTo(startPointX, startPointY);
		context.quadraticCurveTo(controlPointX, controlPointY, endPointX, endPointY);
		context.stroke();
	} else {
		console.error("Canvas's context not found.");
	}
}

// Função: Pega um arquivo de texto vindo do input e guarda seu conteúdo em fileTxt.
function openFile(event) {
    var input = event.target;

    var reader = new FileReader();

    reader.onload = function(){
		fileTxt = reader.result;
    };

    if (typeof(input.files[0]) !== 'undefined'){
    	reader.readAsText(input.files[0]);
    	hasFileBeingDrawn = false;
    }
}

// Função: Dado case atual e a linha atual, retorna se é hora de mudar para um novo case.
function isTimeToChangeCase(current, next){
	if(current != "" || next != ""){
		for(var i = 0; i < keyWords.length; i++){
			if (current == keyWords[i]) 
				continue;
			if (next == keyWords[i])
				return true;
		}
	}
	return false;
}


// Função: Usando um arquivo de texto, lê e desenha seus comandos no canvas.
function drawFile(){

	if (hasFileBeingDrawn){
		console.error("Current file has already being drawn. Clear canvas to redraw or select a new file.");
		return;
	}

	if (fileTxt != "") { // Há algo pra ser desenhado no canvas.

		clearCanvas(); // Limpa o canvas caso um novo precise ser desenhado.
		
		lines = fileTxt.split(/\r?\n/);
		console.log(lines);

		for (var i = 0; i < lines.length; i++) {
			var action = lines[i];
			switch(action){
				case "POINT":
					for (var j = i + 1; j < lines.length; j++) {
						if (isTimeToChangeCase(action, lines[j])){
							break;
						} else {
							var line = lines[j].split(" ");
							createArc(line[0], line[1], 1, 0, 2); // Ponto como um arco de raio 1
						}
					}
					break;
				case "LINE":
					for (var j = i + 1; j < lines.length; j++) {
						if (isTimeToChangeCase(action, lines[j])){
							break;
						} else {
							var line = lines[j].split(" ");
							createLine(line[0], line[1], line[2], line[3]);
						}
					}
					break;
				case "POLYGON":
					for (var j = i + 1; j < lines.length; j++) {
						if (isTimeToChangeCase(action, lines[j])){
							break;
						} else {
							var line = lines[j].split(" ");
							createPolygon(line);
						}
					}
					break;
				case "BEZIER":
					for (var j = i + 1; j < lines.length; j++) {
						if (isTimeToChangeCase(action, lines[j])){
							break;
						} else {
							var line = lines[j].split(" ");
							createBezierCurve(line[0], line[1], line[6], line[7], line[2], line[3], line[4], line[5]);
						}
					}
					break;
				case "ARC":
					for (var j = i + 1; j < lines.length; j++) {
						if (isTimeToChangeCase(action, lines[j])){
							break;
						} else {
							var line = lines[j].split(" ");
							createArc(line[0], line[1], line[2], line[3], line[4]);
						}
					}
					break;
				case "TEXT":
					for (var j = i + 1; j < lines.length; j++) {
						if (isTimeToChangeCase(action, lines[j])){
							break;
						} else {
							var line = lines[j].split(" ");
							var text = "";
							for(var k = 2; k < line.length; k++){
								text += line[k] + " ";
							}
							createText(line[0], line[1], text, "15px Arial");
						}
					}
					break;
			}

			hasFileBeingDrawn = true;
		}
	} else {
		console.error("No file to be drawn. Please, enter a text file and try again.");
	}
}

