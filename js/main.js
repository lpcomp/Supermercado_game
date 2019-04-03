
var numQuestion;
var question;
var selectedOpc;
var audiosGames = new Array();
var lockClick = false;
var tempoAparecerSetaSom = -1;
var mute = false;
var tempPontos;

var acertos;

window.addEventListener("orientationchange", function() {resolveOri();}, false);

function resolveOri(){
	var ori = (window.orientation==0||window.orientation==180);
	$("#erroRotacao").css("display",(ori)?"block":"none");
	$("#imgErro").css("display",(ori)?"block":"none");
	$("#all").css("display",(!ori)?"block":"none");
}

registraAudio("Vanoss.mp3",0.07,true);
window.addEventListener("touchstart", arrast, {passive: true} );
window.addEventListener("touchmove", arrast, {passive: true} );

function arrast(e) {
	mouseX = e.touches[0].clientX;
	mouseY = e.touches[0].clientY;
	moveObj({pageX:mouseX,pageY:mouseY});
	//e.preventDefault();
}

window.onload = function(){ 	

	AudioEffect.onAllAudiosLoaded = carregouAudios;	
	rescale();
	resolveOri();

	$('#telaCaixa').bind('touchend',function (e) {
       	soltaObj();
       	e.preventDefault();
	});

	if (localStorage.getItem('pontos')) {
		$("#pPageInicial").html(localStorage.getItem('pontos'));
	}else{
		localStorage.setItem('pontos', 0);
		$("#pPageInicial").html(localStorage.getItem('pontos'));
	}	

	/************* novo ************/	
	criarMenuFases();

}

function carregouAudios() {
	var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	if(iOS){
		$("#loadingAnim").fadeOut();
		$("#startPlay").fadeIn();
		$("#startPlay img").css("transition","0.5s");
		setInterval(function(){
			changeTransform($("#startPlay img"),"scale(1)");
			setTimeout(function(){
				changeTransform($("#startPlay img"),"scale(1.2)");
			},500);
		},1000);
	}else{
		startPlayGame();
	}

	FastClick.attach(document.body);
}

function startPlayGame(){
	$("#startPlay").fadeOut();
	Inicio();	
	showSeta();	
}

function  Inicio () {
	lockClick = false;
	checkTuto = false;

	for (var i = 0; i < 6; i++) {
		setEvent($("#ced"+i)[0]);		
	}

	for (var k = 0; k < 5; k++) {
		setEvent($("#moe"+k)[0]);
	}
	
	$("#telaResultado").fadeOut();
	/**** tirando onclick antes re recomeçar ****/
	$("#opc0").attr("onclick"," ");
	$("#opc1").attr("onclick"," ");
	$("#opc2").attr("onclick"," ");
	$("#btSom").attr("onclick", " ");
	$("#caixaMaos").css({top:12,left:0});
	$("#titulo").css("top",-300);
	$("#titulo").animate({"top":20},500);

	$("#inicio_professor").css("bottom",-600);

	$("#balao_inicio").css("transition","0s");
	$("#balao_inicio").css({"transform":"scale(0)"});
	$("#msgInicio").css({"transform":"scale(0)"});
	$("#btIniciar").css("transition","0s");
	$("#btIniciar").css({"transform":"scale(0)"});
	newGame ();
	setTimeout( function () {
		$("#inicio_professor").animate({"bottom":-30},500);

		setTimeout( function () {
			$("#balao_inicio").css("transition",".5s");
			$("#balao_inicio").css({"transform":"scale(1)"});
			setTimeout( function () {
				$("#msgInicio").css({"transform":"scale(1)"});
				setTimeout( function () {
					$("#btIniciar").css("transition",".3s");
					$("#btIniciar").css({"transform":"scale(1)"});
					setTimeout( function () {lockClick = false;},300);
					
				}, 300 );
			}, 300 );
		}, 600 );
	}, 300 );

}

function  newGame () {
	if(lockClick)return;
	$("#telaGame").fadeIn();
	$("#btIniciar").css({"transform":"scale(0)"});
	//$("#btCheck").css("background","url(img/btn_corrigir2.png)")
	
	lockClick = true;
	numQuestion = -1;
	acertos = 0;
	//nextQuestion(true);

	setTimeout( function () {
		lockClick = false;

		/*$("#estrelas").fadeIn(2000);
		for (var i = 0; i < questions.length; i++) {
			$("#star_"+i).css("display","none");
		};*/

	}, 500 );

	setTimeout(function () {
		playSound("Vanoss.mp3");
		aniInicial();
	},1000);
	
}

/****************** novo ***********************/

function abrirModalFases (){
	$("#modalFase").fadeIn();
}

function criarMenuFases() {
	var tempCFases = '';

	for (var i = 0; i < fases.length; i++) {
		var tempSitu = "shopping_cart";//(fases[i].situacao == "livre")?("lock_open"):("lock_outline");
		tempCFases += '<tr onclick="abrirFase(\''+i+'\')"><td><i class="material-icons">'+tempSitu+'</i></td>';
	 	tempCFases += '<td>'+fases[i].nome+'</td><td>'+fases[i].dificuldade+'</td></tr>';						
	}

	$(".tabFases table").html(tempCFases);
}

function abrirFase (numFase){
	$("#telaSuperm").fadeIn();
	$("#modalFase").fadeOut();	
	criarLista(numFase);
	setTimeout(function(){
		abrirLista();
	},500);
	
}

var nDaFase;
var meuDinheiro = 0;
function criarLista(qualFase){
	var tempLista = '';

	tempLista += '<tr class="headGreen"><th>Quantidade</th><th>Produto</th><th>Categoria</th></tr>';

	if (fases[qualFase].produtosC.length != 0) {
		for (var i = 0; i < fases[qualFase].produtosC.length; i++) {
			tempLista += '<tr><th>'+fases[qualFase].produtosC[i].qtdP+'</th><th>'+fases[qualFase].produtosC[i].nome+'</th><th>'+fases[qualFase].produtosC[i].categoria+'</th></tr>';
		}
	}else{
		for (var i = 0; i < fases[qualFase].qualSessao.length; i++) {
			tempLista += '<tr><th> - </th><th>Qualquer produto dessa sessão</th><th>'+fases[qualFase].qualSessao[i]+'</th></tr>';
		}
	}
	
	nDaFase = qualFase;
	meuDinheiro = parseFloat(fases[nDaFase].seuDinheiro);

	$("#valorSeuD").html("R$ "+mascaraValor(meuDinheiro.toFixed(2)));
	$(".tabListas table").html(tempLista);
}

function abrirLista() {
	$("#modalLista").fadeIn();
}

function abrirCarrinho() {
	$("#valorTC").html("R$ "+mascaraValor(precoTotalCar));
	$("#modalCarrinho").fadeIn();
}

var qtdCar = 0;
var precoProd = 0;
var precoTotalCar = 0;
//controlaDinheiro = 0;
var carArray = new Array();
var idCar = 0;
var prodNAchado = true;

function addCar() {
	qtdCar = $(".boxQtd input").val();

	for (var i = 0; i < produtos.length; i++) {
		if (prodSelec == produtos[i].nome) {
			precoProd = produtos[i].preco;
			var tempSes = produtos[i].sessao;
		}
	}

	/*if (precoProd*qtdCar > Number(fases[nDaFase].seuDinheiro)) {
		$(".avisoDin").fadeIn();
		setTimeout(function(){
			$(".avisoDin").fadeOut();
		},2000);
		return;
	}*/

	precoTotalCar += Number(precoProd*qtdCar);

	if (precoTotalCar > parseFloat(fases[nDaFase].seuDinheiro)) {
		//$(".avisoDin").fadeIn();
		$("#modalAvisoDin").fadeIn();
		setTimeout(function(){
			//$(".avisoDin").fadeOut();
		},2000);
		precoTotalCar -= Number(precoProd*qtdCar);
		return;
	}
	
	//controlaDinheiro = precoTotalCar;

	for (var j = 0; j < carArray.length; j++) {
		if (carArray[j].nome == prodSelec) {
			carArray[j].qtd = parseInt(carArray[j].qtd)+parseInt(qtdCar);
			prodNAchado = false;
			break;
		}else{
			prodNAchado = true;
		}
	}

	if (prodNAchado || carArray.length == 0) {
		idCar++;

		carArray.push(new Object({"id":idCar,"nome":prodSelec,"qtd":qtdCar, "sessao":tempSes, "preco":precoProd*qtdCar}));

		var tempCar = '';

		tempCar+= '<tr><th>Quantidade</th><th>Produto</th><th>Preço</th><th>Remover?</th></tr>';	

		for (var k = 0; k < carArray.length; k++) {
			var tempPreco = mascaraValor(carArray[k].preco);
			tempCar += '<tr id="itemCar_'+carArray[k].id+'"><td>'+carArray[k].qtd+'</td><td>'+carArray[k].nome+'</td><td>'+tempPreco+'</td><td><i class="material-icons btRemoP" onclick="removeCar(\''+carArray[k].id+'\')">cancel</i></td></tr>';
		}

		$(".tabCarrinho table").html(tempCar);
	}else{
		var tempCar = '';

		tempCar+= '<tr><th>Quantidade</th><th>Produto</th><th>Preço</th><th>Remover?</th></tr>';	

		for (var k = 0; k < carArray.length; k++) {
			var tempPreco = mascaraValor(carArray[k].preco); 
			tempCar += '<tr id="itemCar_'+carArray[k].id+'"><td>'+carArray[k].qtd+'</td><td>'+carArray[k].nome+'</td><td>'+tempPreco+'</td><td><i class="material-icons btRemoP" onclick="removeCar(\''+carArray[k].id+'\')">cancel</i></td></tr>';
		}

		$(".tabCarrinho table").html(tempCar);
	}

	$("#modalProduto").fadeOut();
}

function removeCar(nItemCar) {
	//console.log($(".tabCarrinho table itemCar_"+nItemCar));
	for (var i = 0; i < carArray.length; i++) {
		if (nItemCar == carArray[i].id) {
			var tempProdutoRetirado = carArray[i].nome;
			var tempQtdRetirada = carArray[i].qtd;
			carArray.splice(i,1);
		}
	}

	for (var i = 0; i < produtos.length; i++) {
		if (tempProdutoRetirado == produtos[i].nome) {
			var tempValorPRetirado = produtos[i].preco;
			//precoProd = produtos[i].preco;
			//var tempSes = produtos[i].sessao;
		}
	}

	precoTotalCar -= Number(tempValorPRetirado)*tempQtdRetirada;

	$("#itemCar_"+nItemCar).remove();
	$("#valorTC").html("R$ "+mascaraValor(precoTotalCar));
	checkObjetivo();
	//addCar();
}

function abreSessaoP(nTipo){
	$("#linha0").html(" ");
	$("#linha1").html(" ");
	$("#linha2").html(" ");
	$("#linha3").html(" ");
	//var tempMontaP = '';
	var tempMontaP = new Array();
	for (var i = 0; i < produtos.length; i++) {
		if (nTipo == produtos[i].sessao) {
			//tempMontaP += '<div id="linha0" class="linhas">';
			//tempMontaP +=' <img onclick="abreProduto(\''+produtos[i].nome+'\');" src="'+produtos[i].img+'" />';
			tempMontaP.push('<img onclick="abreProduto(\''+produtos[i].nome+'\');" src="'+produtos[i].img+'" />');
			//tempMontaP +=' </div>';
			
		}		
	}

	var nEstante = 0;
	for (var i = 0; i < tempMontaP.length; i++) {

		if (i==5) {
			nEstante = 1;
		}else if(i==10){
			nEstante = 2;
		}else if(i==15){
			nEstante = 3;
		}

		$("#linha"+nEstante).append(tempMontaP[i]);

		/*if (i%4 == 0 && i!= 0) {
			nEstante = (i/4)-1;
			//$("#linha"+((i/4)-1)).html(tempMontaP);
			//tempMontaP = '';
		}*/
	}

	$(".prateleiras").css("left","0");
}

function fechaPrateleira(){
	$(".prateleiras").css("left","1000px");
	checkObjetivo();
}

var prodSelec;
function abreProduto(nomeProd){
	$("#modalProduto").fadeIn();
	prodSelec = nomeProd;

	for (var i = 0; i < produtos.length; i++) {
		if (prodSelec == produtos[i].nome) {
			var tempProd = produtos[i];
		}
	}

	$(".boxFoto img").attr("src", ""+tempProd.img+"");
	$(".boxNomeP span+span").html(tempProd.nome);
	$(".boxDescri span+span").html(tempProd.descricao);
	$(".boxPreco span+span").html("R$ "+tempProd.preco);
	$(".boxQtd input").val(1);	

}

function abreCarteira() {
	($("#areaDAD").css("top") == "0px")?($("#areaDAD").css("top","270px")):($("#areaDAD").css("top","0px"));
}

var precoTotal = 0;
var faltandoP;
function abreCaixa() {
	$("#telaCaixa").fadeIn();
	$("#telaSuperm").fadeOut();
	
	for (var i = 0; i < carArray.length; i++) {
		var tempNomeP = carArray[i].nome;

		for (var j = 0; j < produtos.length; j++) {
			if (tempNomeP == produtos[j].nome) {
				var valorPTemp = parseFloat(produtos[j].preco).toFixed(2);
			};
		};

		precoTotal += valorPTemp*parseFloat(carArray[i].qtd);
	};

	faltandoP = precoTotal;
	/*precoTotal = precoTotal.toFixed(2);
	precoTotal = precoTotal.replace(/(\d)(?=(\d{3})+\,)/g, '$1.');*/	

	$("#boxFeedT span+span").html("R$ "+mascaraValor(precoTotal.toFixed(2)));
	$("#dinPago").html("R$ "+mascaraValor(faltandoP.toFixed(2)));
	$(".boxMeuDinheiro span+span").html(mascaraValor(fases[nDaFase].seuDinheiro));

	verificaCarteira();

	setTimeout(function(){
		abreCarteira();
	},1000);

}

function mascaraValor(valor) {
    /*valor = valor.toString().replace(/[,.]/g, function (m) {
	    // m is the match found in the string
	    // If `,` is matched return `.`, if `.` matched return `,`
	    return m === ',' ? '.' : ',';
	});//replace(/\D/g,"");
    valor = valor.toString().replace(/(\d)(\d{8})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/,"$1,$2");*/
    valor = (parseFloat(valor)).toLocaleString('pt-BR');

    if (valor.split(',')[1] != undefined) {
		tempNV = valor.split(',')[1];
	    if (tempNV.length == 1) valor = valor+'0';
	    if (tempNV.length == 0) valor = valor+'00';

    }else{

	    valor = Number(valor);
	    valor = valor.toFixed(2);
    }
   
    return valor                    
}

function verificaCarteira() {
	
	//cedulas
	for (var i = 0; i < 6; i++) {
		if ($("#ced"+i).attr("valord") > meuDinheiro) {
			//não pode usar
			$("#ced"+i).css("opacity","0.5");
			$("#ced"+i).attr("bloqueado", "true");
		}else{
			//pode usar
			$("#ced"+i).css("opacity","1");
			$("#ced"+i).attr("bloqueado", "false");
		}
	}

	//moedas
	for (var j = 0; j < 5; j++) {
		if ($("#moe"+j).attr("valord") > meuDinheiro) {
			//não pode usar
			$("#moe"+j).css("opacity","0.5");
			$("#moe"+j).attr("bloqueado", "true");
		}else{
			//pode usar
			$("#moe"+j).css("opacity","1");
			$("#moe"+j).attr("bloqueado", "false");
		}
	}
}

/************** drag and drop ********************/
function allowDrop(ev) {
	ev.preventDefault();
}

var numBrinq;
var objEmMovimento = false;
var elementoCarregado;
var posOriginTop;
var posORiginLeft;
var dinArrastado;

function pegaObj(ele){
	//console.log(nEle);
	if( $(ele).attr("bloqueado") =="true" )return;
	if (objEmMovimento) return;	
	//if(lockClick) return;
	//if (noTutorial) return;
	//if (!tocouSom) return;
	objEmMovimento = true;
	//lockClick = true;
	elementoCarregado = ele;
	dinArrastado = $(ele).attr("valorD");
	$("#"+ele.id).css("pointer-events", "none");
	//numBrinq = ele.id.split("_")[1];
	//posArrastado = $(ele).position().left;
	//numA = $("#"+ele.id).attr("eu");//numA = ele.id.split("_"); 
	//posOriginal = $(elementoCarregado).position(); 
	posOriginTop = $(elementoCarregado).css('top');
	posORiginLeft = $(elementoCarregado).css('left');

	//brinquedo = $(elementoCarregado).attr("eu");

	//for (var i = 0; i < roupasUnitarias.length; i++) {
		//if(brinquedo!=roupasUnitarias[i]) 
	//$("#"+elementoCarregado.id+" img").attr("src", "img/Roupas/"+brinquedo.slice(0,brinquedo.length-1)+"2.png");
	//};	
	
	//$(elementoCarregado).css("z-index", "20");
}  

function moveObj(event){
	//console.log("meu x:"+event.pageX+" meu y:"+(event.pageY/prop - ($(elementoCarregado).height()/2)));
	$(elementoCarregado).css("z-index", "100");
	if(elementoCarregado && event.pageX>10){
		var top = event.pageY/prop - ($(elementoCarregado).height()/2);
		var left = (event.pageX - ($("#all").offset().left))/prop - ($(elementoCarregado).width()/2);
		$(elementoCarregado).css( { 'top':top,'left':left });
		//$(elementoCarregado).offset( { top: (event.pageY - ($(elementoCarregado).height()/2))*prop , left: (event.pageX - ($(elementoCarregado).width()/2))*prop } );
	}
}

var eleTemp;
var meuTroco;
//var roupasCarregadas = 0;
//var areasTela = ["areaCestaC","areaCestaR"];

function soltaObj(ele){ 
	//console.log("soltou!!");
	
	if(!elementoCarregado)return;  	
		
	$("#"+elementoCarregado.id).css("pointer-events", "all");
	$("#"+elementoCarregado.id).css("z-index", "7");

	var pontoX = $(elementoCarregado).position().left/prop+($(elementoCarregado).width())/2;
	var pontoY = $(elementoCarregado).position().top/prop+($(elementoCarregado).height())/2;
	
		if (pontoX > $("#areaDrop").position().left/prop && pontoY > $("#areaDrop").position().top/prop && pontoY < ($("#areaDrop").position().top/prop+$("#areaDrop").height()) && pontoX < ($("#areaDrop").position().left/prop+$("#areaDrop").width())) {
		
				$(elementoCarregado).fadeOut(200, function(){
					$(elementoCarregado).css({ top:posOriginTop, left:posORiginLeft});
					$(elementoCarregado).fadeIn(200);
					elementoCarregado = null;
					objEmMovimento = false;

					dinArrastado = Number(dinArrastado);

					faltandoP -= parseFloat(dinArrastado.toFixed(2));
					meuDinheiro -= parseFloat(dinArrastado.toFixed(2));

					$("#dinPago").html("R$ "+mascaraValor(faltandoP.toFixed(2)));
					$(".boxMeuDinheiro span+span").html(mascaraValor(meuDinheiro.toFixed(2)));

					verificaCarteira();

					if (parseFloat(faltandoP.toFixed(2)) <= 0.00) {//Math.floor(faltandoP)
						$("#dinPago").html("R$ 0,00");
						meuTroco = Number(faltandoP.toFixed(2))*-1
						//$(".boxMeuDinheiro span+span").html(mascaraValor(meuDinheiro.toFixed(2)));

						console.log("TudoPago");
						ChamaModalFinal();
					}

				});
		
				return;
		}else{
			
		}	
	
	$(elementoCarregado).animate({left:posORiginLeft, top:posOriginTop},function(){
		objEmMovimento = false;
	});	
	elementoCarregado = null;/**/
	
}

function setEvent (elem) {
   elem.addEventListener('touchstart', function(e){
       	pegaObj(elem);
       	
       e.preventDefault();
   }, false);        
}

var falhouObj = true;
var fezUmaVez = false;

//var pontos = 0;
function checkObjetivo () {
	
	if (fases[nDaFase].produtosC.length != 0) {
		//produto determinado
		/*for (var i = 0; i < fases[nDaFase].produtosC.length; i++) {
			for (var j = 0; j < carArray.length; j++) {
				if(fases[nDaFase].produtosC[i].nome == carArray[j].nome && fases[nDaFase].produtosC[i].qtdP == carArray[j].qtd){
					falhouObj = false;*/
					/*$("#cate4").fadeIn();

					if (!fezUmaVez) {
						fezUmaVez = true;
						var tempPontos = localStorage.getItem('pontos');
						tempPontos = 200+Number(tempPontos);
						localStorage.setItem("pontos", tempPontos);

						chamaBoxA(200);
					}*/

				/*}else{
					falhouObj = true;
					//$("#cate4").fadeOut();
				}
			}
		}*/
		var contCriterio = 0;
		for (var i = 0; i < fases[nDaFase].produtosC.length; i++) {
			for (var j = 0; j < carArray.length; j++) {
				if(fases[nDaFase].produtosC[i].nome == carArray[j].nome && fases[nDaFase].produtosC[i].qtdP == carArray[j].qtd){
					contCriterio++;

				}else{
					
				}
			}
		}
		/*var tempCarNome = new Array();
		var tempCarQtd = new Array();

		for (var j = 0; j < carArray.length; j++) {
			tempCarNome += carArray[j].nome;
			tempCarQtd += carArray[j].qtd;
		}

		var contCriterio = 0;
		for (var i = 0; i < fases[nDaFase].produtosC.length; i++) {
			
			if(tempCarNome.indexOf(fases[nDaFase].produtosC[i].nome)>=0 && tempCarQtd.indexOf(fases[nDaFase].produtosC[i].qtdP)>=0){
				
				contCriterio++;
			}else{
				
			}
			
		}*/

		if (contCriterio == fases[nDaFase].produtosC.length) {
			falhouObj = false;
			/*$("#cate4").fadeIn();

			if (!fezUmaVez) {
				fezUmaVez = true;
				var tempPontos = localStorage.getItem('pontos');
				tempPontos = 200+Number(tempPontos);
				localStorage.setItem("pontos", tempPontos);

				chamaBoxA(200);
			}*/

		}else{
			falhouObj = true;
		}

	}else{
		//por categoria		
		
		for (var i = 0; i < fases[nDaFase].qualSessao.length; i++) {
			for (var j = 0; j < carArray.length; j++) {

				if (carArray[j].sessao.indexOf(fases[nDaFase].qualSessao[i])<0){
					falhouObj = true;
					//$("#cate4").fadeOut();
				}else{
					falhouObj = false;
					/*$("#cate4").fadeIn();

					if (!fezUmaVez) {
						fezUmaVez = true;
						var tempPontos = localStorage.getItem('pontos');
						tempPontos = 200+Number(tempPontos);
						localStorage.setItem("pontos", tempPontos);

						chamaBoxA(200);
					}*/
				}
			}
		}			
		
	}

	if (carArray.length <= 0) {
		falhouObj = true;
		$("#cate4").fadeOut();
	}

	if (falhouObj) {
		$("#cate4").fadeOut();
	}else{
		$("#cate4").fadeIn();

		if (!fezUmaVez) {
			fezUmaVez = true;
			tempPontos = localStorage.getItem('pontos');
			tempPontos = 200+Number(tempPontos);
			//localStorage.setItem("pontos", tempPontos);

			chamaBoxA(200);
		}

		$("#BoxMsgCaixa").fadeIn(function(){
			setTimeout(function(){
				$("#BoxMsgCaixa").fadeOut();
			},4000);
		});
	}	

	console.log("Falhou o bjetivo? "+falhouObj);
}

function ChamaModalFinal () {
	//tempPontos = localStorage.getItem('pontos');
	tempPontos = 300+Number(tempPontos);
	localStorage.setItem("pontos", tempPontos);

	chamaBoxA(300);

	$("#pPageInicial").html(localStorage.getItem('pontos'));

	$("#txtFinal").html("Você completou a Fase "+(Number(nDaFase)+1)+"<br/><span id='ptFinal'>e ganhou 300 pontos!</span>");
	$("#txtTroco").html("Seu troco é de: R$ "+meuTroco.toFixed(2));
	$("#modalFinal").fadeIn(function(){
		abreCarteira();		
	});
	
}

function chamaBoxA(nMostrado) {

	$(".boxAviso span+span").html(nMostrado+" Pontos!");
	$(".boxAviso").css("top", "15px");
	setTimeout(function(){
		$(".boxAviso").css("top", "-70px");
	},4000);
}

function chamaFinal () {
	if (nDaFase != 10) {
		$("#modalAvisoProxF").fadeIn();
	}else{
		$("#telaGame").fadeIn();
		$("#telaCaixa").fadeOut();		
	}
		
	limpandoTudo();
	
}
//abrirModalFases();
function limpandoTudo() {
	meuTroco = 0;
	faltandoP = 0;
	meuDinheiro = 0;
	precoTotal = 0;
	precoTotalCar = 0;
	falhouObj = true;
	fezUmaVez = false;
	$("#cate4").fadeOut();
	carArray = new Array();
	$(".tabCarrinho table").html('');
}

function aniInicial(){

	$("#linhaTitu").css("width", "100%");
	setTimeout(function(){
		$("#tituSuper").css("opacity", "1");
		setTimeout(function(){
			$("#tituGame").css("opacity", "1");
			setTimeout(function(){
				//$("#tituSuper").css("filter", "blur(0px)");
				setTimeout(function(){
					$("#tituGame").css("filter", "blur(0px)");
					setTimeout(function(){
						$("#btI0").css("-ms-transform", "scale(1)");
						$("#btI0").css("-webkit-transform", "scale(1)");
						$("#btI0").css("transform", "scale(1)");						
						setTimeout(function(){
							$("#btI1").css("-ms-transform", "scale(1)");
							$("#btI1").css("-webkit-transform", "scale(1)");
							$("#btI1").css("transform", "scale(1)");						
							setTimeout(function(){
								$("#btI2").css("-ms-transform", "scale(1)");
								$("#btI2").css("-webkit-transform", "scale(1)");
								$("#btI2").css("transform", "scale(1)");						
								$("#boxPontos").css("right", "-80px");
							},250);
						},250);
					},250);
				},250);
			},250);
		},250);		
	},500);
}

function chamarCredito(){
	$("#modalcreditos").fadeIn();
}

function chamarTutorial() {
	$("#modalTutorial").fadeIn();
}


/****************** novo ***********************/

var checkTuto = false;
var tocouSom = false;
var somLock = false;
function playSom () {
	if(somLock || lockClick)return;	
	playSound(question.audio);
	somLock = true;
	tocouSom = true;
	lockClick = true;
	tempoAparecerSetaSom = -1;
	hideSeta();

	$("#defultBt").css("display","none");	
	$("#imgSomC").css("display","block");	
}

function  selectOpc(n) {
	if(lockClick || selectedOpc == n)return; 	

	if(!tocouSom){
		tempoAparecerSetaSom = 1;
		return;
	}

	lockClick = true;
	playSound("select1.mp3");
	if(selectedOpc >= 0){
		$("#item"+selectedOpc+" #imgSele").css("display","none");
	}else{
		//$("#btCheck").css("background-image","url(img/btn_corrigir2.png)");
		$("#btCheck").css("transition","0.5s");
		$("#btCheck").css("transform","scale(1)");
	}

	selectedOpc = n;
	$("#item"+selectedOpc+" #imgSele").css("display","block");

	setTimeout( function () {
		lockClick = false;
	}, 200 );
}

function check () {
	if( selectedOpc<0 || lockClick || somLock)return;
	
	lockClick = true;
	tempoAparecerSetaSom = -1;
	hideSeta();
	var correto = ( question.opcs[selectedOpc] == question.correct );
	if(correto){
		acertos++;
		playSound("FXResposta Certa.mp3");
		$("#star_"+numQuestion).css("display","block");
	}else{
		playSound("TryAgain.mp3");
	}

	$("#item"+selectedOpc+" #imgSele").css("display","none");
	question.opcs[selectedOpc] == question.correct?$("#item"+selectedOpc+" #imgC").css("display","block"):$("#item"+selectedOpc+" #imgE").css("display","block");

	$("#btCheck").css("transition","0.2s");
	$("#btCheck").css("background","url(img/btn_"+(( question.opcs[selectedOpc] == question.correct )?"v2":"x2")+".png)");
	
	$("#item0").css("transition","0.3s linear");
	$("#item1").css("transition","0.3s linear");
	$("#item2").css("transition","0.3s linear");
	setTimeout( function () {
		$("#somDiv").animate({"top":-510},500);
		$("#item0").css({"top":375});
		$("#item1").css({"top":375});
		$("#item2").css({"top":375});
		setTimeout( function () {
			setTimeout( function () {
				nextQuestion (correto);
			}, 300 );
		}, 300 );
		$("#btCheck").css("transform","scale(0)");
	}, 2500 );
}

function  Replay () {	
	if( lockClick )return;
	lockClick = true;
	podeRefresh = false;
	setTimeout(function(){
		podeRefresh = true;
	},10000);
	$("#estrelas").css("display","none");
	$("#replay").css({"transform":"scale(0)"});
	Inicio();
}

function  showSeta () {
	changeTransform($("#atencaoSom"),"scale(1)");
	$("#btDefult").css("display","none");
	$("#atencaoSom").css("display","block");	
}

function  hideSeta () {	
	$("#atencaoSom").css("display","none");
	$("#btDefult").css("display","block");	
}

function changeTransform(ele,css){
	$(ele).css({"transform":css});
	$(ele).css({"-ms-transform":css});
}

function registraAudio (nomeA,vol,loop,game) {
	var callback = null;
	if(game){
		callback = function(e){ 
			somLock = false;
			lockClick = false;
			$("#defultBt").css("display","block");	
			$("#imgSomC").css("display","none");
		};
	}
	AudioEffect.registerAudio(nomeA,vol,loop,callback);
}

function playSound (nome) {
	AudioEffect.playSound(nome);
}
function pauseSound (nome) {
	AudioEffect.stopSound(nome);
}

function fecharTela (elePFechar) {
	$("#"+elePFechar).fadeOut();
}

var images = new Array();
function preload(list) {
	for (i = 0; i < list.length; i++) {
		images[i] = new Image();
		images[i].src = "img/"+list[i];
	}
}

var listN = new Array();

preload( listN );

window.onresize = function(){ rescale(); };

function rescale() {
	prop = ($(window).width()/$(window).height()>(1000/600))?($(window).height()/700): ($(window).width()/1000) ;/*Math.min(1,($(window).width()/$(window).height()>(1000/600))?($(window).height()/600): ($(window).width()/1000) );
	prop -= 0.01;*/
	$("#all").css("transform", "scale("+prop+")");
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}