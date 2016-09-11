function ChordFactory(strings)
{
	this.strings = strings;
}

ChordFactory.prototype.createChord = function (chordString)
{
	var regexp = /[\dX](\[\d?B?\])?/g;

	var result = chordString.toUpperCase().match(regexp);
	var notes = [];

	for (i=0; i<result.length; i++) {
		var regexp2 = /([\dX])(?:\[(\d)?(B)?\])?/;
		var matches = result[i].match(regexp2);
		notes.push({
			index: matches[1],
			finger: matches[2],
			barre: !!matches[3]
		});			
	}

	if (notes.length < this.strings.length) {
		throw 'You provide too few notes';
	} else if (notes.length > this.strings.length) {
		throw 'You provide too many notes';
	}

	return {
		strings: this.strings,
		notes: notes
	};
}
