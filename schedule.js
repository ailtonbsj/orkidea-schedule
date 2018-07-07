var Orkidea = (function(){

var palette = ['#001f3f','#0074D9','#7FDBFF','#39CCCC','#3D9970','#2ECC40',
'#01FF70','#FFDC00','#FF851B','#FF4136','#85144b','#F012BE','#B10DC9'];
var inxdexColor = 0;
var listDates = [];
var listYLabels = [];
var listXLabels = [];
var contYAxis = 0;
var allPad = 1;
var majorLabelWidth = 0;
var lenX, lenY;
var jumph = 1;
var configs = {};

function Schedule(domId, data, config){
	configs = config;
	data.map(function(item){
		var initDate = item.inittime.split(' ')[0];
		var finalDate = item.finaltime.split(' ')[0];
		if(initDate != finalDate)
			console.warn('This component does not suport interval major than one day!');
		if(listDates[initDate] == undefined){
			listDates[initDate] = [];
			listDates[initDate].push(item);
		} else listDates[initDate].push(item);
	});

	var root = document.getElementById(domId);
	root.innerHTML = '';

	for(date in listDates){

		var wrap = document.createElement("div");
		root.appendChild(wrap);
		wrap.classList.add("orkidea-schedule-wrap");

		var panel = document.createElement("div");
		wrap.appendChild(panel);
		panel.classList.add("orkidea-schedule-panel");
		panel.innerHTML = '';
		listYLabels = [];
		listXLabels = [];
		contYAxis = 0;
		majorLabelWidth = 0;
		createYLabel(panel, date);

		listDates[date].map(function(item){
			if(listYLabels[item.yAxis] == undefined)
				createYLabel(panel, item.yAxis);

		});

		for(label in listYLabels){
			listYLabels[label].style.width = majorLabelWidth + 'px';
		}

		widthPanel = panel.clientWidth - majorLabelWidth;
		hourDist = widthPanel/24;

		var node = document.createElement("div");
		node.innerHTML = '00h';
		node.style.background = 'green';
		panel.appendChild(node);
		lenX = node.clientWidth;
		lenY = node.clientHeight;
		panel.removeChild(node);

		jumph = 1;
		while( lenX > (jumph*hourDist) ){
			jumph++;
		}

		for(var i=0; i<24; i+=jumph){
			createXLabel(panel, i+'h', majorLabelWidth + i*hourDist);
		}

		listDates[date].map(function(item){
			var time = item.inittime.split(' ')[1];
			var tk = time.split(':');
			var secondInit = (+tk[0]) * 60 * 60 + (+tk[1]) * 60 + (+tk[2]);
			time = item.finaltime.split(' ')[1];
			tk = time.split(':');
			var secondFinal = (+tk[0]) * 60 * 60 + (+tk[1]) * 60 + (+tk[2]);
			var _y = listYLabels[item.yAxis].offsetTop;
			var _x = majorLabelWidth + widthPanel*(secondInit/86399); //linear interpolation
			var _w = majorLabelWidth + widthPanel*(secondFinal/86399);
			_w = _w - _x;
			createItem(item.text+"\nStart: "+item.inittime+"\nEnd: "+item.finaltime,_x, _y, _w, item.color, panel);
		});
	}
}

function createItem(value, x, y, w, bgColor, parent){
	var node = document.createElement("div"	);
	node.style.left = x+'px';
	node.style.top = y+allPad+'px';
	node.style.width = w+'px';
	node.style.height = lenY+'px';
	if(configs.uniqueColor == undefined){
		node.style.background = palette[inxdexColor];
		inxdexColor = inxdexColor < 12 ? inxdexColor+1 : 0;
	} 
	else if(configs.uniqueColor == 'indata'){
		if(bgColor == undefined){
			node.style.background = palette[inxdexColor];
			inxdexColor = inxdexColor < 12 ? inxdexColor+1 : 0;
		} else node.style.background = bgColor;
	} else node.style.background = configs.uniqueColor;
	node.style.overflow = 'hidden';
	node.setAttribute('title',value);
	node.classList.add("orkidea-schedule-item");
	parent.appendChild(node);
	node.onclick = function(){
		alert(this.getAttribute('title'));
	};
}

function createXLabel(parent, value, left){
	var node = document.createElement("div"	);
	node.innerHTML = value;
	node.style.left = left+'px';
	node.style.width = hourDist + 'px';
	parent.appendChild(node);
	node.style.top = '0';
	listXLabels.push(node);
}

function createYLabel(parent, value){
	var node = document.createElement("div");
	node.innerHTML = value;
	parent.appendChild(node);
	node.style.top = (contYAxis*(node.clientHeight+2*allPad))+'px';
	contYAxis++;
	if(majorLabelWidth < node.clientWidth+allPad){
		majorLabelWidth = node.clientWidth+allPad;
	}
	listYLabels[value] = node;
	node.classList.add("orkidea-schedule-labelY");
	var white = document.createElement("DIV");
	white.innerHTML = "&nbsp";
	white.style.position = 'static';
	parent.appendChild(white);
	white.classList.add("orkidea-schedule-gridY");
}

return {
	Schedule: Schedule
};

})();