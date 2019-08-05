
function App(opt){


	//获取展示数据的 ul
	this.content_ul = document.getElementById(opt.content_ul);

	//获取项目类型
	this.item_type = document.getElementById(opt.item_type);

	//获取项目期限
	this.item_time = document.getElementById(opt.item_time);

	//获取排序
	this.comp = document.getElementById(opt.comp);

	this.dataArray = null;

	//表示当前页面展示的数据
	this.indexData = null;

	this.init();
}

App.prototype = {
	constructor : App,

	//初始化方法
	init : function(){
		//请求数据
		var _this = this;
		$ajax({
			url : "list.json",
			success : function(obj){
				console.log(obj.data);
				_this.dataArray = obj.data;
				//渲染页面
				_this.fillData(obj.data);
			}
		});
		this.bindEvent();
	},
	//渲染数据
	fillData : function (arr){
		//给你啥,你就渲染啥
		if(arr.length == 0){
			this.content_ul.innerHTML = "无产品";
			return;
		}
		var html = "";
		arr.forEach( function(element) {
			html += `<div>
						<ul class="top">
							<li style="margin-right:200px "><span class="item_name">${element.name}|${element.short_name}</span></li>
							<li><span class="item_rate_first">${element.expected_earning_rate}%</span><span class="item_rate_second">+ ${element.activity_rate}%</span></li>
							<li><span class="money">${element.total_amount}元</span></li>
							<li><span class="date">${element.period_day}天</span></li>
							<li><span class="start_money">${element.investment_amount}元</span></li>
							<li>${element.ordered_percent}%</li>
							<li><button class = "btn">${element.display_status}</button></li>
						</ul>
						<br>
						<ul class="bottom">
							<li></li>
							<li><span class="explain">约定年利率</span></li>
							<li><span class="explain">剩余可投金额</span></li>
							<li><span class="explain">期限</span></li>
							<li><span class="explain">起投金额</span></li>
							<li><span class="explain">募集进度${element.ordered_percent}%</span></li>
							<li></li>
						</ul>
					</div>`
		});
		this.content_ul.innerHTML = html;
	},

	//添加事件方法
	bindEvent : function(){

		var _this = this;
		var name = null,time = null;


		var flag = false;

		//给项目类型 li 添加点击事件
		this.item_type.onclick = function(){
			var title = event.target.innerHTML;
			name = title;

			for(var i = 0;i < _this.item_type.children.length;i++){
				_this.item_type.children[i].classList.remove("item_active");
			}

			event.target.classList.add("item_active");

			if(title == "全部"){
				name = undefined;
				var arr = _this.filterData(undefined,time);
			}else{
				//过滤数据
				var arr = _this.filterData(title,time);
			}
			_this.indexData = arr;
			//填充数据
			_this.fillData(arr);
		}
		//给项目期限 li 添加点击事件
		this.item_time.onclick = function (){
			var title = event.target.innerHTML;

			for(var i = 0;i < _this.item_time.children.length;i++){
				_this.item_time.children[i].classList.remove("item_active");
			}
			
			event.target.classList.add("item_active");

			if(title == "全部"){
				time = undefined;
			}
			if(title == "1个月以内"){
				time = {start:0,end:30};
				// 0  - 030
			}else if(title == "1-3个月"){
				time = {start:30,end:90}
				// 30 - 90
			}else if(title == "3-6个月"){
				// 90 - 180
				time = {start:90,end:180};
			}else if(title == "6个月以上"){
				// 180 - 99999
				time = {start:180,end:999}
			}
			var arr = _this.filterData(name,time);
			_this.indexData = arr;
			//填充数据
			_this.fillData(arr);
		}

		//给排序添加事件
		this.comp.onclick = function(){

			var title = event.target.innerHTML;

			if(title == "年化利率"){
				var arr = _this.indexData.sort(com("expected_earning_rate"));
				_this.fillData(arr);
			}else{
				var arr = _this.indexData.sort(com("period_day"));
				_this.fillData(arr);
			}
			
			function com(pro){
				return function(a,b){
					if(flag){
						flag = false;
						return a[pro] < b[pro]
					}else{
						flag = true;
						return a[pro] > b[pro]
					}
					
				}
			}
		}
	},

	//过滤数据  name 表示的是类型 time 表示的是时间
	filterData : function(name,time){

		if(name == undefined && time == undefined){
			return this.dataArray;
		}

		if(name != undefined){
			if(time != undefined){
				return this.dataArray.filter(function(obj){
					return obj.name == name && obj.period_day*1 > time.start && obj.period_day*1 <= time.end;
				});
			}else{
				return this.dataArray.filter(function(obj){
					return obj.name == name;
				});
			}
		}else{
			if(time != undefined){
				return this.dataArray.filter(function(obj){
					return obj.period_day*1 > time.start && obj.period_day*1 <= time.end;
				});
			}
		}
	},
}

function $ajax(opt){
	var xhr = new XMLHttpRequest();
	xhr.open("get", opt.url, true);
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			opt.success(JSON.parse(xhr.responseText));
			// 把字符串换行成 js 对象
			// 1 eval
			// 2 JSON.parse  注意 JSON.parse 只能转换对象.不能转换数组
		}
	}		
}
