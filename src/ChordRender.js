function ChordRender(settings)
{
	this.lines = settings ? (settings.lines || 5) : 5;
	this.boxWidth = settings ? (settings.boxWidth || 16) : 16;
	this.boxHeight = settings ? (settings.boxHeight || 16) : 16;
	this.lineSize = settings ? (settings.lineSize || 1) : 1;
	this.topLineSize = settings ? (settings.topLineSize || 5) : 5;
	this.topDistance = settings ? (settings.topDistance || 5) : 5;

	this.fingerNumberColor = settings ? (settings.fingerNumberColor || '#FFFFFF') : '#FFFFFF';
	this.fingerNumberFont = settings ? (settings.fingerNumberFont || 'Arial') : 'Arial';
	this.fingerNumberFontSize = settings ? (settings.fingerNumberFont || 10) : 10;
	
	this.bottomDistance = settings ? (settings.bottomDistance || 2) : 2;
	this.bottomNoteColor = settings ? (settings.bottomNoteColor || '#000000') : '#000000';
	this.bottomNoteFont = settings ? (settings.bottomNoteFont || 'Arial') : 'Arial';
	this.bottomNoteFontSize = settings ? (settings.bottomNoteFontSize || 10) : 10;
}

ChordRender.prototype.render = function (element, chord)
{
	var stringsCount = chord.strings.length - 1;
	var circleRadius = this.boxWidth / 2 - 1;
	var topMoveForEmptyStrings = 2 * circleRadius + this.topDistance;
	var chordWidth = stringsCount * this.boxWidth + (stringsCount + 1) * this.lineSize;

	var canvas = document.createElement('canvas');
	canvas.width = chordWidth + 2 * (circleRadius);
	canvas.height = this.lines * this.boxHeight + this.lines * this.lineSize + this.topLineSize + topMoveForEmptyStrings + this.bottomDistance + this.bottomNoteFontSize;

	var ctx = canvas.getContext('2d');
	ctx.translate(0.5, 0.5)
	ctx.lineWidth = this.lineSize; 
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (var i=0; i<=stringsCount; i++) {
		var x = i * this.boxWidth + i * this.lineSize + circleRadius;

		ctx.beginPath();
		ctx.moveTo(x, topMoveForEmptyStrings);
		ctx.lineTo(x, canvas.height - (this.bottomDistance + this.bottomNoteFontSize + 1));
		ctx.stroke();
	}
	ctx.lineWidth = this.topLineSize; 
	ctx.beginPath();
	ctx.moveTo(circleRadius, (this.topLineSize - 1) / 2 + topMoveForEmptyStrings);
	ctx.lineTo(canvas.width - (circleRadius + 1), (this.topLineSize - 1) / 2 + topMoveForEmptyStrings);
	ctx.stroke();	
	ctx.lineWidth = this.lineSize; 
	for (var i=1; i<=this.lines; i++) {
		ctx.beginPath();
		ctx.moveTo(circleRadius, i * this.boxHeight + this.topLineSize + (i - 1) * this.lineSize + topMoveForEmptyStrings);
		ctx.lineTo(canvas.width - (circleRadius + 1), i * this.boxHeight + this.topLineSize + (i - 1) * this.lineSize + topMoveForEmptyStrings);
		ctx.stroke();
	}

	for (var i=0; i<chord.notes.length; i++) {
		var actualLineX = i * this.boxWidth + i * this.lineSize + circleRadius;

		if (chord.notes[i].index == 'X') {
			var y = circleRadius;

			ctx.beginPath();
			ctx.moveTo(actualLineX - (circleRadius - 2), y - (circleRadius - 2));
			ctx.lineTo(actualLineX + (circleRadius - 2), y + (circleRadius - 2));
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(actualLineX + (circleRadius - 2), y - (circleRadius - 2));
			ctx.lineTo(actualLineX - (circleRadius - 2), y + (circleRadius - 2));
			ctx.stroke();
		} else if (chord.notes[i].index == 0) {
			var y = circleRadius;

			ctx.beginPath();
			ctx.arc(actualLineX, y, circleRadius, 0, 2 * Math.PI, false);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			ctx.stroke();
		} else {
			var y = chord.notes[i].index * this.boxHeight + this.topLineSize + (chord.notes[i].index - 1) * this.lineSize - (this.boxHeight / 2 + this.lineSize / 2) + topMoveForEmptyStrings;

			ctx.beginPath();
			ctx.arc(actualLineX, y, circleRadius, 0, 2 * Math.PI, false);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.stroke();

			if (chord.notes[i].barre) {
				var x = stringsCount * this.boxWidth + stringsCount * this.lineSize + circleRadius;

				ctx.beginPath();
				ctx.arc(x, y, circleRadius, 0, 2 * Math.PI, false);
				ctx.fillStyle = "#000000";
				ctx.fill();
				ctx.stroke();

				ctx.fillRect(actualLineX, y - circleRadius, x - actualLineX, y + circleRadius - (y - circleRadius));
			}

			if (chord.notes[i].finger) {
				ctx.fillStyle = this.fingerNumberColor;
				ctx.font = this.fingerNumberFontSize + 'px ' + this.fingerNumberFont;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(chord.notes[i].finger.toString(), actualLineX, y);
			}
		}
	}

	for (var i=0; i<chord.strings.length; i++) {
		var x = i * this.boxWidth + i * this.lineSize + circleRadius;
		var y = canvas.height - (this.bottomNoteFontSize + 1);

		ctx.fillStyle = this.bottomNoteColor;
		ctx.font = this.bottomNoteFontSize + 'px ' + this.bottomNoteFont;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillText(chord.strings[i], x, y);
	}

	element.appendChild(canvas);
}