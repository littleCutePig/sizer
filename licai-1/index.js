
function Item(opt){

	this.item_type = document.getElementById(opt.item_type);
	this.item_time = document.getElementById(opt.item_time);

	this.content_ul = document.getElementById(opt.content_ul);

	this.isType = undefined;
	this.isTime = undefined;

	this.data = null;

	this.indexData = null;

	//this.init();
}

Item.prototype = {
	constructor : Item,

	init : function(){
		$ajax({
			url : "list.json",
		}).then((obj)=>{
			this.data = obj.data;
			this.indexData = obj.data;
			console.log(this.data);
			this.fillData(this.data);
		});
		this.bindEvent();
	},
	//渲染页面
	fillData : function(dataArr){
		if(dataArr.length == 0){
			this.content_ul.innerHTML = "无产品";
			return;
		}
		var html = "";
		dataArr.forEach( function(element) {
			html += `<div>
						<ul class="top">
							<li style="margin-right:200px "><span class="item_name">${element.name}|${element.short_name}</span></li>
							<li><span class="item_rate_first">${element.expected_earning_rate}%</span><span class="item_rate_second">+ ${element.activity_rate}%</span></li>
							<li><span class="money">${element.total_amount}元</span></li>
							<li><span class="date">${element.period_day}天</span></li>
							<li><span class="start_money">${element.investment_amount}元</span></li>
							<li>${element.ordered_percent}</li>
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

	//绑定事件
	bindEvent : function (){
		
		this.item_type.onclick = () => {
			var ele = event.target;
			var title = ele.innerHTML;
			var lis = Array.from(this.item_type.children);
			for(var i in lis){
				lis[i].classList.remove("item_active")
			}
			ele.classList.add("item_active");

			if(title == "全部"){
				this.fillData(this.data);
				this.indexData = this.data;
			}else{
				//过滤数据
				var arr = this.filterDataForName(this.indexData,title);
				this.fillData(arr);
			}
		}
		this.item_time.onclick = () => {
			var ele = event.target;
			var title = ele.innerHTML;
			var lis = Array.from(this.item_type.children);
			// for(var i in lis){
			// 	lis[i].classList.remove("item_active")
			// }
			ele.classList.add("item_active");

			if(title == "全部"){
				this.fillData(this.indexData);	
			}else{
				var time = this.formatStr(title);
				var arr = this.filterDataForTime(this.indexData,time);
				this.fillData(arr);
			}
		}
	},

	formatStr : function(str){
		var reg = /[^0-9]*/;
		var arr = str.split(reg);
		arr = arr.filter((n)=>{
			return n != "";
		});
		var opt = {};
		if(arr.length == 1){
			if(arr[0]*1 == 1){
				opt.s = 0;
				opt.e = arr[0]*30;
			}else{
				opt.s = arr[0]*30;
			}
		}else{
			opt.s = arr[0]*30;;
			opt.e = arr[1]*30;
		}
		return opt;
	},

	filterDataForTime : function(data,time){
		if(time == undefined) return;
		return data.filter( function(element) {
			return element.period_day*1 >= time.s && element.period_day*1 <= time.e;
		});
	},
	filterDataForName : function (data,type){
		if(type  == undefined){
			return;
		}
		return data.filter((obj)=>{
			return obj.name == type;
		});
	}
}

function $ajax(opt){

	return new Promise((resolve,reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('get', opt.url, true);
		xhr.send(null);
		xhr.onreadystatechange = function(){
			if(xhr.readyState !=  4){
				return;
			}
			if(xhr.status == 200){
				resolve(eval("("+ xhr.responseText+")"));
			}else{
				reject(new Error("错误"));
			}
		}
	});
}