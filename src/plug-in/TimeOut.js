function time(te){
    // console.log(te)
	if(te == ''){
		return '';
	}else if(te.length == 10){
		var time = new Date(te * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var y = time.getFullYear();
		var m = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
		var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
		var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
		var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
		var s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
		var timedate = y + '-' + m + '-' + d ;
		return timedate;
	}else{
		var time = new Date(te);
		var y = time.getFullYear();
		var m = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
		var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
		var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
		var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
		var s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
		var timedate = y + '-' + m + '-' + d ;
		return timedate;
	}
}
export default time
