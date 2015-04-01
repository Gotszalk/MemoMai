/*zmienne globalne*/
var ruch = 0;
var punkty = 0;
var kart = 8; //na planszy
var odkrytych = 0;//potrzebuje tego? tak
var doPary={nazwa: "", x: undefined, y: undefined}; //co czeka na dobranie pary


//dźwięki
var mistrz = new Audio("snd/mistrzostwo.m4a"); // buffers automatically when created
var gratki = new Audio("snd/gratuluje.m4a");
var powodzi = new Audio("snd/powodzenia.m4a");
var dobrze = new Audio("snd/dobrze.m4a");
var hmm = new Audio("snd/hmm.m4a");
//snd.play();

var plansza = new Array (7);

var zwierzatka = [
	{nr: 1, nazwa: "hipcio", obrazek: "hipcio.jpg", karty: 2},
	{nr: 2, nazwa: "lewek", obrazek: "lewek.jpg", karty: 2},
	{nr: 3, nazwa: "myszka", obrazek: "myszka.jpg", karty: 2},
	{nr: 4, nazwa: "owieczka", obrazek: "owieczka.jpg", karty: 2}
];
//koniec zmiennych

//funkcje
function znajdz(zwierz){
	for(i=0; i<4; i++){
		if(zwierzatka[i].nazwa === zwierz){
			return i;
		}
	}
}

function losowanie() {
	// pętla po planszy
	for (x=0; x<2; x++){
		for(y = 0; y < 4; y++){
	
			//losuj aż do znalezienia jeszcze karty na stosie
			do {
				var los = Math.floor(Math.random()*(4));
				var zwierzatko = zwierzatka[los];
			} while (zwierzatko.karty === 0);
			
			zwierzatko.karty--;
			//chyba lepiej
			// nie działa pole = plansza[x,y];
			plansza[y * 4 + x] = zwierzatko.nazwa;
			//plansza[x][y].odsloniete = false;
			}
	}
}

function wyswietlKarty() {
	for(x = 0; x < 2; x++){
		for(y = 0; y < 4; y++){
			var cela = "cela" + x + y;
			document.getElementById(cela).innerHTML = "<img src='img/" + zwierzatka[znajdz(plansza[y *4 + x])].obrazek + "' class='karta' >";
			document.getElementById(cela).style.transform = "rotateX(0deg)"; // no i odkręć!
		}
	}
}

function zwinKarte(x,y){

	var nazwaCeli = "cela" + x + y;
	var cela = document.getElementById(nazwaCeli);
	cela.style.transform = "rotateX(90deg)";
	cela.classList.add('zblokowana');
}

function wyswietlJedna(x,y){
//raczej nie uzywana funkcja????
	var indeksPola = y * 4 + x;
	var cela = "cela" + x + y;
	var karta = znajdz(plansza[indeksPola]);
	var img = zwierzatka[karta].obrazek;
	
	document.getElementById(cela).innerHTML = "<img src='img/" + img + "' class='karta' >";

}

function zaslonKarte(x,y){

	var cela = "cela" + x + y;
	var el = document.getElementById(cela);
	
	el.innerHTML = "<img src='img/serduszko.jpg' alt='serduszko' class='karta animk'>";
	el.classList.remove('zblokowana');//pozwolenie na zdarzenie
}

function zaslonKarty() {
	for(x = 0; x < 2; x++){
		for(y = 0; y < 4; y++){
			zaslonKarte(x,y);
		}
	}
}

function wyswietlJednaI(cela){

	if(odkrytych<2){
		var x = parseInt(cela.substring(4,5));
		var y = parseInt(cela.substring(5,6));
		if((doPary.x !== x) || (doPary.y !== y)){
			var indeksPola = y * 4 + x;
			var zwierz = plansza[indeksPola];
			var karta = znajdz(zwierz);
			var img = zwierzatka[karta].obrazek;
			
			document.getElementById(cela).innerHTML = "<img src='img/" + img + "' class='karta' >";
			
			odkrytych++;
			ruch++;
			document.getElementById("ruch").innerHTML = ruch;
			
			if(doPary.nazwa === ""){
			//jeśli to pierwsza odsłaniana z pary...
				doPary.nazwa = zwierz;
				doPary.x = x;
				doPary.y = y;
				kart--;
			} else if(doPary.nazwa === zwierz){
				//jeśli para znaleziona...
				setTimeout(function(){
					
					dobrze.play();
					zwinKarte(doPary.x,doPary.y);
					zwinKarte(x,y);
					
					odkrytych = 0;
					kart--;
					punkty++;
					doPary.nazwa = "";
					doPary.x = undefined;
					doPary.y = undefined;
					
					document.getElementById("pkt").innerHTML = punkty;
					
					if(kart === 0){
						if(ruch == 8){
							mistrz.play();
							alert("mistrzostwo!"); //przy minimalnej ilości ruchów
						} else {
							gratki.play();
							alert("gratulacje!!!"); // przy zakończeniu
						}
						//location.reload(); nie generujmy ruchu tylko odkręcajmy przy nast grze
					}
				},1000);
						
			} else {
				// jeśli to nie para...
				setTimeout(function(){
					
					hmm.play();
					zaslonKarte(doPary.x, doPary.y);
					zaslonKarte(x,y);
		
					odkrytych = 0;
					kart++;
					doPary.nazwa = "";
					doPary.x = undefined;
					doPary.y = undefined;
				},1000);
			}
		}
	}
}

function gra() {
	ruch = 0;
	punkty = 0;
	kart = 8;
	document.getElementById("pkt").innerHTML = punkty;
	document.getElementById("ruch").innerHTML = ruch;
	
	powodzi.play();
	alert("powodzenia!!!!");
	for(i = 0; i < 4; i++){
		zwierzatka[i].karty = 2; //na nowo mamy 2 karty per zwierzatko w talii
	}
	losowanie();
	wyswietlKarty();
	setTimeout(function(){zaslonKarty()},2000);
}
//koniec funkcji

//obsługa zdarzeń
var zdarzenia = {
	init: function() {
	var cela;
		for(x = 0; x < 2; x++){
			for(y = 0; y < 4; y++){
				cela = "cela" + x + y;
				//el = document.getElementById(cela);
				
				document.getElementById(cela).addEventListener("click", this, false);
			}
		}

	},
	handleEvent: function(e) {
		//'karta' jest odkryta a 'karta animk' nie
		//'zblokowana' jest zdjęta 
		if((e.target.className !== 'zblokowana')&&(e.target.className !== 'karta')) 
			wyswietlJednaI(e.target.parentNode.id);

	},
	/*usun: function(elem) {
		elem.removeEventListener('click', this, false);
	}*/
};

/*
 * uzbrój elementy
 */
//zdarzenia.init();
 
/*
init na początku, przed graj()!
potem uzbrojenie - w graj()
przy zwinięciu karty (zwinKarte()) rozbrojenie
*/