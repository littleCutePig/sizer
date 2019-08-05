
//创建一个对象
function Item(opt){


	//获取产品的 ul
	this.content_ul = document.getElementById(opt.content_ul);

	//获取项目类型
	this.item_type = document.getElementById(opt.item_type);

	//获取项目期限
	this.item_time = document.getElementById(opt.item_time);

	//保存一下当前页面展示的数据
	this.indexData = null;

	//请求回来的数据
	this.data = null;
	this.init();
}

Item.prototype = {
	constructor : Item,

	//初始化方法
	init : function(){
		var _this = this;
		//请求数据
		$ajax({
			url : "list.json",
			success : function(obj){
				_this.data = obj.data;
				//渲染数据,把所有的数据都显示
				_this.fillData(_this.data);
			}
		});
		//绑定事件
		this.bindEvent();
	},
	//填充数据
	fillData : function(dataArr){

		if(dataArr.length == 0){
			this.content_ul.innerHTML = "无产品";
			return;
		}

		var html = "";
		//遍历数组
		dataArr.forEach((obj)=>{
			html += `<div>
						<ul class="top">
							<li style="margin-right:200px "><span class="item_name">${obj.name}|${obj.short_name}</span></li>
							<li><span class="item_rate_first">${obj.expected_earning_rate}%</span><span class="item_rate_second">+ ${obj.activity_rate}%</span></li>
							<li><span class="money">${obj.total_amount}元</span></li>
							<li><span class="date">${obj.period_day}天</span></li>
							<li><span class="start_money">${obj.investment_amount}元</span></li>
							<li>${obj.ordered_percent}%</li>
							<li><button class = "btn">${obj.display_status}</button></li>
						</ul>
						<br>
						<ul class="bottom">
							<li></li>
							<li><span class="explain">约定年利率</span></li>
							<li><span class="explain">剩余可投金额</span></li>
							<li><span class="explain">期限</span></li>
							<li><span class="explain">起投金额</span></li>
							<li><span class="explain">募集进度${obj.ordered_percent}%</span></li>
							<li></li>
						</ul>
					</div>`;
		});
		//给this.content_ul 进行复制
		this.content_ul.innerHTML = html;
	},	

	//添加事件方法
	bindEvent : function(){

		var _this = this;
		//给项目类型添加点击事件
		this.item_type.onclick = function(){
			var ele = event.target;
			var title = ele.innerHTML;

			//把所有的li 取消样式
			var lis = _this.item_type.children;

			for(var i = 0;i<lis.length;i++){
				lis[i].classList.remove("item_active");
			}
			
			ele.classList.add("item_active");


			if(title == "全部"){
				//不需要过滤数据
				_this.fillData(_this.data);
			}else{
				//进行过滤数据
				var arr =  _this.filterDataForType(title);
				//进行初始化
				_this.indexData = arr;
				_this.fillData(arr);
			}
		}
		//给项目期限添加点击方法
		this.item_time.onclick = function (){
			var ele = event.target;
			var title = ele.innerHTML;
			var lis = _this.item_time.children;
			for(var i = 0;i < lis.length;i++){
				lis[i].classList.remove("item_active");
			}
			ele.classList.add("item_active");
			if(title == "全部"){
				_this.fillData(_this.indexData);
			}else{
				//过滤数据
				if(title == "1个月以内"){
					//遍历数据 进行判断 时间是在 0  - 30 以内的

					var arr = _this.filterDataForTime(0,30);

				}else if(title == "1-3个月"){
					//遍历数据 进行判断 时间是在 30  - 90 以内的
					var arr = _this.filterDataForTime(30,90);
				}else if(title == "3-6个月"){
					var arr = _this.filterDataForTime(90,180);

				}else if(title == "6个月以上"){
					var arr = _this.filterDataForTime(180,999);
				}
				//进行渲染页面
				_this.fillData(arr);
			}
		}
	},

	//过滤数据 根据项目类型
	filterDataForType : function(name){

		if(name == undefined) {
			return;
		}
		//根据所有的数据进行过滤
		return this.data.filter(function(obj){
			return obj.name == name;
		});
	},
	//过滤数据 根据项目期限
	filterDataForTime : function (start,end){
		//假设对象有开始时间 和结束时间	
		//遍历什么数据 ?
		
		return this.indexData.filter(function(obj){
			return obj.period_day*1 >= start && obj.period_day*1 <= end;
		});
	}
}

function $ajax(opt){
	var xhr = new XMLHttpRequest();
	xhr.open("get", opt.url, true);
	xhr.send(null);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			opt.success(eval("("+xhr.responseText+")"));
		}
	}
}


