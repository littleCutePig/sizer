function ajax(url){

	return new Promise((revolse,reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open("get",url,true);
		xhr.send(null);
		xhr.onreadystatechange = function(){
			if(xhr.readyState != 4){
				return;
			}
			if(xhr.status == 200){
				revolse(eval("("+ xhr.responseText+")"));
			}else{
				reject(new Error("请求错误"));
			}
		}
	})
}