/**
*
* @author Mikko Tekoniemi 
* 
*/
var MAX_KEYS = 65536;
var MAX_BUTTONS = 10;
var keys = [MAX_KEYS];
var keyState = [MAX_KEYS];
var keyTyped = [MAX_KEYS];
var buttons = [MAX_BUTTONS];
var buttonState = [MAX_BUTTONS];
var buttonClicked = [MAX_BUTTONS];
var mouseX, mouseY;
function initInput(canvas) {
	window.addEventListener('keydown', function (e) {
		keys[e.keyCode || e.which] = true;
	}, true);
	window.addEventListener('keyup', function (e) {
		keys[e.keyCode || e.which] = false;
	}, true);
	window.addEventListener('mousedown', function (e) {
		buttons[e.keyCode || e.which] = true;
	}, true);
	window.addEventListener('mouseup', function (e) {
		buttons[e.keyCode || e.which] = false;
	}, true);
	window.addEventListener('mousemove', function (evt) {
		var mouse = getMousePos(canvas, evt);
		mouseX = mouse.x;
		mouseY = mouse.y;
	});
}
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function updateInput() {
	for (var i = 0; i < MAX_KEYS; i++)
		keyTyped[i] = keys[i] && !keyState[i];
	for (var i = 0; i < MAX_KEYS; i++)
		keyState[i] = keys[i];
	for (var i = 0; i < MAX_BUTTONS; i++)
		buttonClicked[i] = buttons[i] && !buttonState[i];
	for (var i = 0; i < MAX_BUTTONS; i++)
		buttonState[i] = buttons[i];
}

function isKeyDown(key) {
	if (key >= 0 && key <= keys.length - 1) return keys[key];
	return false;
}

function isKeyTyped(key) {
	if (key >= 0 && key <= keyTyped.length - 1) return keyTyped[key];
	return false;
}

function isButtonDown(button) {
	if (button >= 0 && button <= buttons.length - 1) return buttons[button];
	return false;
}

function isButtonClicked(button) {
	if (button >= 0 && button <= buttonClicked.length - 1) return buttonClicked[button];
	return false;
}

function GetAxis(axis) {
	switch (axis) {
		case "Vertical":
			return isKeyDown(Keys.W) && isKeyDown(Keys.S) ? 0 : isKeyDown(Keys.W) ? 1 : isKeyDown(Keys.S) ? -1 : 0;
		case "Horizontal":
			return isKeyDown(Keys.A) && isKeyDown(Keys.D) ? 0 : isKeyDown(Keys.D) ? 1 : isKeyDown(Keys.A) ? -1 : 0;
	}
}

var Keys = {
	A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90
}