function File(opt){
	this.cont = document.querySelector(opt.cont);
	this.tit = document.querySelector(opt.tit);
	this.sta = document.querySelector(opt.sta);
	this.stb = document.querySelector(opt.stb);

	this.datas = null;
	this.init();
}

File.prototype = {
	constructor : File,
	init : function (){
		ajax("list.json").then((data) => {
			this.datas = data;
			this.filer();
			this.bindEvent();
			this.bindEvents();
		});
	},
	filer : function(add,num,num0){
		var str = "";
		this.datas.data.forEach((ele,index) => {
			if(typeof add != "undefined"){
				if(ele.name != add && add != "全部"){
					return;
				}else if(!(ele.period_day >= num) || !(ele.period_day <= num0)){
					return;
				}
			}
			var a = ele.activity_rate != 0 ? "+" + ele.activity_rate + "%" : "" ;
			var b = ele.period_day/30 > 1 ? Math.floor(ele.period_day/30) + "月" : ele.period_day + "天";
			str += `<tr>
						<td class="first"><span>${ele.name}</span>|<span>${ele.short_name}</span></td>
						<td>
							<p><span>${ele.expected_earning_rate}%</span><b>${a}</b></p>
							<i>约定年利率</i>
						</td>
						<td>
							<p>${ele.remain_amount}.00元</p>
							<i>剩余可投金额</i>
						</td>
						<td>
							<p>${b}</p>
							<i>期限</i>
						</td>
						<td>
							<p>${ele.investment_amount}元</p>
							<i>起投金额</i>
						</td>
						<td>
							<aside><p class="rate" style="width:${ele.ordered_percent}%"></p></aside>
							<i>募集进度<span>${ele.ordered_percent}</span>%</i>
						</td>
						<td>
							<div>立即出借</div>
						</td>
					</tr>`
		})
		this.cont.innerHTML = str ;
	},
	//第一行
	bindEvent : function(){
		var _this = this;
		this.sta.onclick = function(){
			if(event.target.tagName == "LI"){
				for(var i = 0;i < this.children.length; i++){
					this.children[i].className = "";
				}
				event.target.className = "active";
				_this.stb = document.querySelector(".stb");
				var active = "";
				for(var j = 0;j < _this.stb.children.length; j++){
					if(_this.stb.children[j].className == "active"){
						active = _this.stb.children[j].innerText;
					}
				}
				var ss = event.target.innerText;
				console.log(active);
				console.log(ss);
				switch(active){
					case "全部":
					_this.filer(ss,0,720);
					break;

					case "1个月以内":
					console.log(11);
					_this.filer(ss,0,30);
					break;

					case "1-3个月":
					_this.filer(ss,30,90);
					break;

					case "3-6个月":
					_this.filer(ss,90,180);
					break;

					case "6个月以上":
					_this.filer(ss,180,720);
					break;
				}
			}
			if(_this.cont.innerHTML == ""){
				_this.cont.innerHTML = `<h1>暂无项目</h1>`;
			}
		}
	},
	//第二行
	bindEvents : function(){
		var _this = this;
		this.stb.onclick = function(){

			if(event.target.tagName == "LI"){
				for(var i = 0;i < this.children.length; i++){
					this.children[i].className = "";
				}
				event.target.className = "active";
				_this.sta = document.querySelector(".sta");
				
				var ss = "";
				for(var j = 0;j < _this.sta.children.length; j++){
					if(_this.sta.children[j].className == "active"){
						ss = _this.sta.children[j].innerText;
					}
				}
				switch(event.target.innerText){
					case "全部":
					_this.filer(ss,0,720);
					break;

					case "1个月以内":
					console.log(11);
					_this.filer(ss,0,30);
					break;

					case "1-3个月":
					_this.filer(ss,30,90);
					break;

					case "3-6个月":
					_this.filer(ss,90,180);
					break;

					case "6个月以上":
					_this.filer(ss,180,720);
					break;
				}
			}
			if(_this.cont.innerHTML == ""){
				_this.cont.innerHTML = `<h1>暂无项目</h1>`;
			}
		}
	}
}