var Orkidea = (function(){

var palette = ['#001f3f','#0074D9','#7FDBFF','#39CCCC','#3D9970','#2ECC40',
'#01FF70','#FFDC00','#FF851B','#FF4136','#85144b','#F012BE','#B10DC9'];
var contYAxis = 0;
var allPad = 1;
var majorLabelWidth = 0;
var lenX, lenY;
var jumph = 1;
var configs = {};

function Schedule(domId, data, config){
	var self = this;
	this.indexColor = 0;
	self.listDates = [];
	self.listYLabels = [];
	self.listXLabels = [];
	configs = config;
	var pures = [];
	data.map(function(item) {
		var initDate = item.inittime.split(' ')[0];
		var finalDate = item.finaltime.split(' ')[0];
		if(initDate != finalDate) {
			var iniArr = initDate.split('/');
			var endArr = finalDate.split('/');
			var sDate = new Date(iniArr[2],iniArr[1]-1,iniArr[0]);
			var eDate = new Date(endArr[2],endArr[1]-1,endArr[0]);
			var diffTime = eDate - sDate;
			var daysDiff = diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			for(var i = 0; i <= daysDiff; i++) {
				var iDate = new Date(sDate.getTime());
				iDate.setDate(iDate.getDate() + i);
				var strDate = iDate.toLocaleDateString("pt-BR");
				if(i == 0) {
					iniFrag = strDate + ' ' + item.inittime.split(' ')[1];
					endFrag = strDate + ' 23:59:59';
				} else if(i == daysDiff) {
					iniFrag = strDate + ' 00:00:00';
					endFrag = strDate + ' ' + item.finaltime.split(' ')[1];
				} else {
					iniFrag = strDate + ' 00:00:00';
					endFrag = strDate + ' 23:59:59';
				}
				obj = {
					finaltime: endFrag,
					inittime: iniFrag,
					text: item.text,
					yAxis: item.yAxis
				};
				pures.push(obj);
			}
		} else pures.push(item);
	});

	pures.map(function(item){
		var initDate = item.inittime.split(' ')[0];
		var finalDate = item.finaltime.split(' ')[0];
		if(initDate != finalDate)
			console.warn('This component does not support interval major than one day!');
		if(self.listDates[initDate] == undefined){
			self.listDates[initDate] = [];
			self.listDates[initDate].push(item);
		} else self.listDates[initDate].push(item);
	});

	var root = document.getElementById(domId);
	root.innerHTML = '';

	for(date in self.listDates){

		var wrap = document.createElement("div");
		root.appendChild(wrap);
		wrap.classList.add("orkidea-schedule-wrap");

		var panel = document.createElement("div");
		wrap.appendChild(panel);
		panel.classList.add("orkidea-schedule-panel");
		panel.innerHTML = '';
		self.listYLabels = [];
		self.listXLabels = [];
		contYAxis = 0;
		majorLabelWidth = 0;
		self.createYLabel(panel, date);

		self.listDates[date].map(function(item){
			if(self.listYLabels[item.yAxis] == undefined)
				self.createYLabel(panel, item.yAxis);

		});

		for(label in self.listYLabels){
			self.listYLabels[label].style.width = majorLabelWidth + 'px';
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
			self.createXLabel(panel, i+'h', majorLabelWidth + i*hourDist);
		}

		self.listDates[date].map(function(item){
			var time = item.inittime.split(' ')[1];
			var tk = time.split(':');
			var secondInit = (+tk[0]) * 60 * 60 + (+tk[1]) * 60 + (+tk[2]);
			time = item.finaltime.split(' ')[1];
			tk = time.split(':');
			var secondFinal = (+tk[0]) * 60 * 60 + (+tk[1]) * 60 + (+tk[2]);
			var _y = self.listYLabels[item.yAxis].offsetTop;
			var _x = majorLabelWidth + widthPanel*(secondInit/86399); //linear interpolation
			var _w = majorLabelWidth + widthPanel*(secondFinal/86399);
			_w = _w - _x;
			self.createItem(item.text+"\nStart: "+item.inittime+"\nEnd: "+item.finaltime,_x, _y, _w, item.color, panel);
		});
	}
}
$Schedule = Schedule.prototype;
//Properties
$Schedule.indexColor = 0;
$Schedule.listDates = [];
$Schedule.listYLabels = [];
$Schedule.listXLabels = [];
//Methods
$Schedule.createItem = function(value, x, y, w, bgColor, parent){
	var node = document.createElement("div"	);
	node.style.left = x+'px';
	node.style.top = y+allPad+'px';
	node.style.width = w+'px';
	node.style.height = lenY+'px';
	if(configs.uniqueColor == undefined){
		node.style.background = palette[this.indexColor];
		this.indexColor = this.indexColor < 12 ? this.indexColor+1 : 0;
	} 
	else if(configs.uniqueColor == 'indata'){
		if(bgColor == undefined){
			//console.log(this.indexColor);
			node.style.background = palette[this.indexColor];
			this.indexColor = this.indexColor < 12 ? this.indexColor+1 : 0;
		} else node.style.background = bgColor;
	} else node.style.background = configs.uniqueColor;
	node.style.overflow = 'hidden';
	node.setAttribute('title',value);
	node.innerHTML = value.split("\n")[0];
	console.log();
	
	node.classList.add("orkidea-schedule-item");
	parent.appendChild(node);
	node.onclick = function(){
		alert(this.getAttribute('title'));
	};
}
$Schedule.createXLabel = function(parent, value, left){
	var node = document.createElement("div"	);	
	node.innerHTML = value.length === 2 ? '0' + value : value;
	node.style.left = left+'px';
	node.style.width = hourDist + 'px';
	parent.appendChild(node);
	node.style.top = '0';
	this.listXLabels.push(node);
}
$Schedule.createYLabel = function(parent, value){
	var node = document.createElement("div");
	node.innerHTML = value;
	parent.appendChild(node);
	node.style.top = (contYAxis*(node.clientHeight+2*allPad))+'px';
	contYAxis++;
	if(majorLabelWidth < node.clientWidth+allPad){
		majorLabelWidth = node.clientWidth+allPad;
	}
	this.listYLabels[value] = node;
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