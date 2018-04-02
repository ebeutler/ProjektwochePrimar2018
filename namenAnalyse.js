(function(window, undefined){

	var startAnalyse = function(event) {
		event.preventDefault();
		var daten = $('#daten')[0].value
				.replace(/\s/g, '')
				.replace(/-/g, '')
				.toLowerCase();
		if($('#algorithmus')[0].value === 'counting') {
			algoCounting(daten);
		} else {
			algoBubble(daten);
		}
	};
	
	var algoBubble = function(daten) {
		var schritte = 0;
		do {
			var fertig = true;
			if(daten.length > 1) {
				for(i = 0; i < (daten.length - 1); i++) {
					if(daten.charCodeAt(i+1) < daten.charCodeAt(i)) {
						var temp = daten[i];
						daten = daten.replaceAt(i, daten[i+1]);
						daten = daten.replaceAt(i+1, temp);
						fertig = false;
					}
					schritte++;
				}
			}
		} while(!fertig);
		ergebnisTabelleAnzeigen(datenFormatieren(daten), daten, schritte);
	};
	
	var algoCounting = function(daten) {
		var schritte = 0;
		var eimer = neuerEimer();
		for(i = 0; i < daten.length; i++) {
			var index = daten.charCodeAt(i);
			eimer[index] += String.fromCharCode(index);
			schritte++;
		}
		schritte += eimer.length;
		ergebnisTabelleAnzeigen(eimer.slice(), eimer.join(''), schritte);
	};
	
	var ergebnisTabelleAnzeigen = function(eimer, sortiert, schritte) {
		$('#schritte').text(schritte.toLocaleString('de-CH'));
		$('li.resultat').remove();
		var eimerNachLaenge = eimer.sort(function(ele1, ele2) { return ele2.length - ele1.length; });
		var max = -1;
		for(i = 0; i < eimerNachLaenge.length; i++) {
			if(eimerNachLaenge[i].length > 0) {
				if(max < 0) max = eimerNachLaenge[i].length;
				var neuerEintrag = "<li class=\"resultat\"><span class=\"zahl\">"
						+ eimerNachLaenge[i][0] + ": " + eimerNachLaenge[i].length
						+ "</span><span class=\"balken\" style=\"width:" 
						+ (500 * (eimerNachLaenge[i].length / max))
						+ "px;\"></span></li>";
				$('ul#resultate').append(neuerEintrag);
			}
		}
		var top = $('ul#resultate').outerHeight() - $('form').outerHeight() + 20;
		$('#resultat').text(sortiert).css('margin-top', Math.max(20, top));
	};
	
	var datenFormatieren = function(daten) {
		var eimer = neuerEimer();
		for(i = 0; i < daten.length; i++) {
			var index = daten.charCodeAt(i);
			eimer[index] += String.fromCharCode(index);
		}
		return eimer;
	};
	
	var neuerEimer = function() {
		return Array.apply(null, new Array(256))
				.map(function(e, i) { return ''; });
	};
	
	String.prototype.replaceAt = function(index, replacement) {
		return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
	};
	
	$( document ).ready(function() {
		$('#count').click(startAnalyse);
	});
})(window);