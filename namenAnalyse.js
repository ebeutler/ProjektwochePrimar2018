(function(window, undefined){

	// Starten der Berechnung
	var startAnalyse = function(event) {
		event.preventDefault();
		var startZeit = new Date();
		// Vorbereiten der eingegebenen Daten
		var daten = $('#daten')[0].value
				.replace(/\s/g, '') // Entfernen Leerschlaege und Zeilenumbrueche
				.replace(/[-_\.,;:\!\?]/g, '') // Entfernen aller '-_.,;:!?'
				.toLowerCase(); // Alle Grossbuchstaben in klein aendern
		// Entscheiden nach welcher Methode die Berechnung gemacht werden soll und starten derselben
		if($('#algorithmus')[0].value === 'counting') {
			algoCounting(daten);
		} else if($('#algorithmus')[0].value === 'bubble') {
			algoBubble(daten);
		} else if($('#algorithmus')[0].value === 'quick') {
			algoQuick(daten);
		} else if($('#algorithmus')[0].value === 'insert') {
			algoInsert(daten);
		} else if($('#algorithmus')[0].value === 'merge') {
			algoMerge(daten);
		}
		$('#laufzeit').toggle(true).text('Laufzeit: ' + (new Date() - startZeit).toLocaleString('de-CH') + 'ms');
	};
	
	// Berechnen der Ergebnisse mit 'Bubble Sort'
	var algoBubble = function(daten) {
		var schritte = 0;
		do { // Mach das, solange bis alles sortiert ist 'while(!fertig)'
			var fertig = true; // Jeder durchlauf startet mit der Annahme, alles sei sortiert
			if(daten.length > 1) { // Es gibt nur dann etwas zu sortieren wenn mehr als ein Buchstabe eingegeben wurde
				for(i = 0; i < (daten.length - 1); i++) { // Ausfuehren fuer jeden Buchstaben im Text, ausser dem letzten
					// Pruefe ob der Buchstabe nach dem, im Text darauffolgenden, kommt 
					// (z.B. 'hans' -> 'h' kommt nach 'a' im Alphabet, muss also gedreht werden)
					if(daten.charCodeAt(i) > daten.charCodeAt(i+1)) {
						// Wechsle den Buchstaben mit dem darauffolgenden
						var temp = daten[i];
						daten = daten.replaceAt(i, daten[i+1]);
						daten = daten.replaceAt(i+1, temp);
						fertig = false; // Da zwei Buchstaben gedreht wurden war noch nicht alles sortiert
					}
					schritte++;
				}
			}
		} while(!fertig);
		ergebnisTabelleAnzeigen(datenFormatieren(daten), daten, schritte, daten.length, daten.length-1, (daten.length-1)*daten.length);
	};
	
	// Berechnen der Ergebnisse mit 'Counting Sort'
	var algoCounting = function(daten) {
		var schritte = 0;
		var eimer = neuerEimer();
		for(i = 0; i < daten.length; i++) { // Ausfuehren fuer jeden Buchstaben im Text
			var index = daten.charCodeAt(i); // Finde die Nummer des Eimers in den der Buchstabe gehoert
			eimer[index] += String.fromCharCode(index); // Lege den Buchstaben in den richtigen Eimer
			schritte += 2; // +2 weil der Buchstabe am Ende wieder aus dem Eimer genommen werden muss
		}
		ergebnisTabelleAnzeigen(eimer.slice(), eimer.join(''), schritte, daten.length, 2*daten.length, 2*daten.length);
	};
	
	// Berechnen der Ergebnisse mit 'Insert Sort'
	var algoInsert = function(daten) {
		var schritte = 0;
		for(i = 1; i < daten.length; i++) {
			var k = i-1;
			while((k > 0) && (daten[k] > daten[i])) {
				k--;
				schritte++;
			}
			if(daten[k] > daten[i]) {
				daten = daten.shiftTo(i, k);
			} else {
				daten = daten.shiftTo(i, k+1);
			}
			schritte++;
		}
		ergebnisTabelleAnzeigen(datenFormatieren(daten), daten, schritte, daten.length, daten.length-1, (daten.length/2)*daten.length);
	};
	
	// Berechnen der Ergebnisse mit 'Merge Sort'
	var algoMerge = function(daten) {
		var resultat = mergeSort(daten);
		ergebnisTabelleAnzeigen(datenFormatieren(resultat.daten), resultat.daten, resultat.schritte, daten.length, daten.length*Math.ceil(Math.log(daten.length)), daten.length*Math.ceil(Math.log(daten.length)));
	};
	
	var mergeSort = function(daten) {
		if(daten.length == 1) {
			return { 'daten' : daten, 'schritte' : 0 };
		}
		var mitteIndex = Math.floor(daten.length / 2);
		return verschmelzen(mergeSort(daten.substring(0, mitteIndex)), mergeSort(daten.substring(mitteIndex)));
	};
	
	var verschmelzen = function(links, rechts) {
		var schritte = links.schritte + rechts.schritte;
		var resultatDaten = '';
		var iLinks = 0;
		var iRechts = 0;
		while((iLinks < links.daten.length) && (iRechts < rechts.daten.length)) {
			if(links.daten[iLinks] < rechts.daten[iRechts]) {
				resultatDaten += links.daten[iLinks];
				iLinks++;
			} else {
				resultatDaten += rechts.daten[iRechts];
				iRechts++;
			}
			schritte++;
		}
//		schritte += (links.daten.length - iLinks) + (rechts.daten.length - iRechts);
		return { 'daten' :  resultatDaten + links.daten.substring(iLinks) + rechts.daten.substring(iRechts), 'schritte' : schritte};
	};
	
	// Berechnen der Ergebnisse mit 'Quick Sort'
	var algoQuick = function(daten) {
		var eingabe = { 'daten': daten, 'schritte' : 0 };
		quickSort(eingabe, 0, daten.length-1, 0);
		// Minimal Math.floor(daten.length*Math.log(daten.length)) kann kleiner sein bei gleich grossen Zeichen
		ergebnisTabelleAnzeigen(datenFormatieren(eingabe.daten), eingabe.daten, eingabe.schritte, daten.length, daten.length*Math.ceil(Math.log(daten.length)), daten.length*daten.length);
	};
	
	// Hauptmethode von Quick Sort
	var quickSort = function(eingabe, links, rechts, depth) {
		if((rechts - links) >= 1) {
			index = aufteilen(eingabe, links, rechts);
			if(links < (index - 1)) {
				quickSort(eingabe, links, (index - 1), depth+1);
			}
			if(index < rechts) {
				quickSort(eingabe, index, rechts, depth+1);
			}
		}
	};
	
	// Teilt die Daten in alle kleineren und groesseren als das Mittelelement (Quick Sort)
	var aufteilen = function(eingabe, links, rechts) {
		var mitteIndex = links + Math.floor((rechts - links) / 2);
		var mitte = eingabe.daten[mitteIndex];
		while(links <= rechts) {
			while(eingabe.daten[links] < mitte) {
				links++;
			}
			while(eingabe.daten[rechts] > mitte) {
				rechts--;
			}
			if(links <= rechts) {
				eingabe.daten = eingabe.daten.swap(links, rechts);
				links++;
				rechts--;
			}
			eingabe.schritte++;
		}
		return links;
	};
	
	// Anzeigen der berechneten Ergebnisse
	var ergebnisTabelleAnzeigen = function(eimer, sortiert, schritte, buchstabenTotal, minimumSchritte, maximumSchritte) {
		$('#schritte').text(schritte.toLocaleString('de-CH'));
		$('#buchstaben').text(buchstabenTotal.toLocaleString('de-CH'));
		$('#minmax').text(minimumSchritte.toLocaleString('de-CH') + ' / ' + maximumSchritte.toLocaleString('de-CH'));
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
		$('#resultate').toggle(true);
		var top = $('ul#resultate').outerHeight() - $('form').outerHeight() + 20;
		$('#resultat').text(sortiert).css('margin-top', Math.max(20, top)).toggle(true);
		$('#resultatGedreht').text(sortiert.split('').reverse().join('')).toggle(true);
	};
	
	// Vorbereiten der Ergebnisse um die Resultate einheitlich darzustellen
	var datenFormatieren = function(daten) {
		var eimer = neuerEimer();
		for(i = 0; i < daten.length; i++) {
			var index = daten.charCodeAt(i);
			eimer[index] += String.fromCharCode(index);
		}
		return eimer;
	};
	
	// Erstellen eines neuen (leeren) Eimers mit Platz fuer die moeglichen Zeichen
	var neuerEimer = function() {
		return Array.apply(null, new Array(256))
				.map(function(e, i) { return ''; });
	};
	
	// Hilfsmethode zum ersetzen einzelner Zeichen in einem Text
	String.prototype.replaceAt = function(index, replacement) {
		return this.substr(0, index) + replacement + this.substr(index + replacement.length);
	};
	
	// Hilfsmethode zum ersetzen verschieben Zeichen in einem Text
	String.prototype.shiftTo = function(fromIndex, toIndex) {
		if(fromIndex < toIndex) {
			return this.substring(0, fromIndex) + this.substring(fromIndex+1, toIndex) + this[fromIndex] + this.substring(toIndex);
		} else {
			return this.substring(0, toIndex) + this[fromIndex] + this.substring(toIndex, fromIndex) + this.substring(fromIndex+1);
		}
	};
	
	// Hilfsmethode zum vertauschen zweier Zeichen in einem Text
	String.prototype.swap = function(index1, index2) {
		if(index1 == index2) {
			return this;
		}
		if(index1 > index2) {
			var tmp = index1;
			index1 = index2;
			index2 = tmp;
		}
		return this.substring(0, index1) + this[index2] + this.substring(index1+1, index2) + this[index1] + this.substring(index2+1);
	};
	
	// 'Berechnen' Knopf beobachten (was passiert bei Klick darauf)
	$( document ).ready(function() {
		$('#count').click(startAnalyse);
	});
})(window);