$(document).ready(
	
	function(){
	
		var cal = $("#calendar");
		var calHtml = "";
		var date = new Date();
		var y = date.getFullYear();

		var m = getMonths()[date.getMonth()];
		
		calHtml = "<div id='calTopBar'> 								\
						<canvas id='calPrevMonth' width='10' height='10' />	\
						<span id='calMonthAndYear'></span>      			\
						<canvas id='calNextMonth' width='10' height='10' />	\
					</div>													\
					<div id='dayLetters'></div>								\
					<div id='days'></div>";	
		
		cal.append(calHtml);

		$("#calMonthAndYear").text(m.name + " " + y);

		$.each(["M","T","W","Th","F","S","Su"],function(){
			var c = "dayLetter";
			if(this == "Su") c = "dayLetterLast";
			$("#dayLetters").append("<span class='"+c+"'>"+this+"</span>");
		});
						
		drawLeftButton(document.getElementById("calPrevMonth"));
		drawRightButton(document.getElementById("calNextMonth"));
		
		updateDays(cal, y, m.name);

		$("#calPrevMonth").click(
			function(){
				//get current month and year
				var monthName = $("#calMonthAndYear").text().split(" ")[0];
				var y = $("#calMonthAndYear").text().split(" ")[1];
				var res = getPrevMonthYear(monthName,y);
				$("#calMonthAndYear").text(res.monthName + " " + res.year);
				updateDays(cal, res.year, res.monthName);
			}
		);
		
		$("#calNextMonth").click(
			function(){
				var monthName = $("#calMonthAndYear").text().split(" ")[0];
				var y = $("#calMonthAndYear").text().split(" ")[1];
				var res = getNextMonthYear(monthName,y);
				$("#calMonthAndYear").text(res.monthName + " " + res.year);
				updateDays(cal, res.year, res.monthName);
			}
		);

	}
);

function updateDays(calendar, year, monthName){
	
	var month = getMonth(monthName);
	var start = 0;
	var tailPrevMonth = 0;
	var headNextMonth = 0;
	var d = new Date();
	
	d.setFullYear(parseInt(year),getMonth(monthName).id,1);
	if(d.getDay() == 0) {start = 7} else{ start = d.getDay()};
	
	tailPrevMonth = start - 1;
	headNextMonth = 42 -  month.days - tailPrevMonth;
	
	$("#days").html("");
	
	//Put in empty day boxes
	for(var i=0;i<=41;i++){
		if(i%6==0) $("#days").append(
			"<span id='wkRow"+(~~(i/6))+"' class='wkRow'></span>");
		var c = "day";
		if((i+1)%7 ==0) c = "dayEndRow";
		$("<span id='dayBox"+(i+1)+"' class='"+c+"'></span>").appendTo(
			"#wkRow"+(~~(i/7)));
	}
	
	/* Put in days of selected month */
	for(var i=start, j=1;i<start+month.days;i++,j++){
		if(j<=month.days){
			$("#dayBox"+i).append(j);
			$("#dayBox"+i).attr("title",j + " " + month.name + " " + year );
		 }
	}
	
	/* Put in days of previous month */
	for(var i=tailPrevMonth, j=0;i>0;i--,j++){
		$("#dayBox"+i).append(getPrevMonth(month.id).days - j);
		$("#dayBox"+i).addClass("prevMonthDay");
	}
	
	/* Put in days of next month */
	for(var i=1;i<=headNextMonth;i++){
		$("#dayBox"+(start + month.days - 1 + i)).append(i);
		$("#dayBox"+(start + month.days - 1 + i)).addClass("nextMonthDay");
	}
	
}

function getMonth(monthName){
	
	var result = {};
	var months = getMonths();
	for(var i=0;i<months.length;i++){
		if(months[i].name == monthName){
			result = months[i];
		}
	}
	return result;
}

function getMonths(){
	
	var date = new Date();
	var y = date.getFullYear();
	
	var months = new Array();	
	months[0] = {id:0, name:"January", days:31};
	months[1] = {id:1, name:"February", days:28};
	months[2] = {id:2, name:"March", days:31};
	months[3] = {id:3, name:"April", days:30};
	months[4] = {id:4, name:"May", days:31};
	months[5] = {id:5, name:"June", days:30};
	months[6] = {id:6, name:"July", days:31};
	months[7] = {id:7, name:"August", days:31};
	months[8] = {id:8, name:"September", days:30};
	months[9] = {id:9, name:"October", days:31};
	months[10] = {id:10, name:"November", days:30};
	months[11] = {id:11, name:"December", days:31};
	
	if(y%100==0 && y%400==0 || y%100!=0 && y%4==0){
		months[1].days = 29;//Leap year February
	}
	
	return  months;
}

function getWeekday(id){
	
	var weekdays = new Array();		
	weekdays[0]={id:0,name:"Sunday"};
	weekdays[1]={id:1,name:"Monday"};
	weekdays[2]={id:2,name:"Tuesday"};
	weekdays[3]={id:3,name:"Wednesday"};
	weekdays[4]={id:4,name:"Thursday"};
	weekdays[5]={id:5,name:"Friday"};
	weekdays[6]={id:6,name:"Saturday"};
	return weekdays[id];
}

function getPrevMonthYear(monthName, year){
	
	var result = {monthName:"",year:""}; 
	var month = getMonth(monthName);
	var prevMonth = getPrevMonth(month.id);
	
	year = parseInt(year);
	result.monthName = prevMonth.name;
	
	if(prevMonth.id > month.id) {
		result.year = year-1;
	}else{
		result.year = year;
	}
	
	return result;
}

function getNextMonthYear(monthName, year){
	
	var result = {monthName:"",year:""}; 
	var month = getMonth(monthName);
	var nextMonth = getNextMonth(month.id);
	
	year = parseInt(year);
	result.monthName = nextMonth.name;
	
	if(nextMonth.id < month.id) {
		result.year = year+1;
	}else{
		result.year = year;
	}
	
	return result;
}

function getPrevMonth(monthId){
	return getMonths()[mod(11,monthId,-1)];
}

function getNextMonth(monthId){
	return getMonths()[mod(11,monthId,1)];
}

function mod(base, val, step){
	var result = "";
	var a = val + step;
	if(a < 0){ result = base + a + 1;}
	else if(a > base){ result = a - base - 1;}
	else{ result = a; }
	return result;
}

/*Change this code with ref to image files in html */
function drawLeftButton(canvas){
	context = canvas.getContext("2d");
	context.translate(0, canvas.height);
	context.scale(1,-1);
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = "black";
	context.moveTo(0, 5);        
	context.lineTo(10,10); 
	context.lineTo(10,0); 
	context.fillStyle = 'green';
	context.fill();
	context.stroke();
	context.closePath();
}

function drawRightButton(canvas){
	context = canvas.getContext("2d");
	context.translate(0, canvas.height);
	context.scale(1,-1);
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = "black";
	context.moveTo(0, 10);        
	context.lineTo(10,5); 
	context.lineTo(0,0); 
	context.fillStyle = 'green';
	context.fill();
	context.stroke();
	context.closePath();
}
