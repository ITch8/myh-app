var ASKURL = "https://api.hk-dr.com/",token = '85FBCA0D01D6EB76A3888C5F8E4118D5',SRC = "https://api.hk-dr.com/verify/get_code?";
var nodataHtmlInfo = "<div class='noContent'><div class='mui-icon iconfont icon-comiiszanwushuju'></div><div>暂无数据</div></div>";
(function(w, _, u,owner) {
	w.openView = function(url,extras) {
		var web=null,id = url.split('?')[0].replace(/(.*)\//g, '').split('.')[0];
		extras = extras?extras:{};
		web = plus.webview.getWebviewById(id);
		if (w.plus) {
			if(web){
				if("tabbar" == id){
					w.toIndex(0);
				}else{
					_.fire(web,"event",extras)
					web.show('slide-in-right',300);
				}
			}else{
				_.openWindow({
					id: id,	url: url,extras:extras,styles: {popGesture: "colse"},show: {duration: 300},waiting: {autoShow: false}
				});
			}
		} else {
			location.href = url;
		}
	};
	w.doubleTapExit = function(){//连续点击返回键退出应用
		var backButtonPress = 0;
		_.back = function() {
			++backButtonPress > 1 ? u.exitApp(): _.toast('再按一次退出应用');
			setTimeout(function() {backButtonPress = 0;}, 1000);
		};
	};
	w.setItem = function(key, value) {
		w.plus ? plus.storage.setItem(key, value) : localStorage.setItem(key, value);
	};
	w.getItem = function(key) {
		return w.plus ? plus.storage.getItem(key) : localStorage.getItem(key);
	};
	w.clearItem = function() {
		w.plus ? plus.storage.clear() : localStorage.clearItem();
	};
	w.removeItem = function(key) {
		w.plus ? plus.storage.removeItem(key) : localStorage.removeItem(key);
	};
	w.getUser = function(){
		return w.getItem("privateToken");
	};
	w.setUser = function(privateToken){
		w.setItem("privateToken",privateToken);
	};
	
	/**@des 辅助工具--请求数据
	 * @param key  测试环境约定key值111111
	 * @param postUrl  请求接口
	 * @param pdata  请求参数
	 * @param success 请求成功回调函数
	 * @param error 请求失败回调函数
	 * */
	u.mypost = function(postUrl,pdata,show,success, error) {
		if(show){
			plus.nativeUI.showWaiting("努力加载中...");
		}
		_.extend(true, pdata, {	'token': token});
		setTimeout(function(){
			_.ajax({
				url: ASKURL+postUrl,type: 'post',data: pdata,timeout:60000,
				success: function(data) {
					_.later(function(){plus.nativeUI.closeWaiting();},100)
					data = JSON.parse(data);
					_.isFunction(success) ? success(data) : '';
				},
				error: function(xhr) {
					_.later(function(){plus.nativeUI.closeWaiting();},100)
					_.isFunction(error) ? error() : _.toast('网络连接超时');
				}
			});
		},50);
	};
	u.goLogin = function(){
		mui.toast("登录身份过期，请重新登录");
		mui.later(function(){
			w.openView("../userLogin.html");
		},500)
	};
	u.close = function(wid){
		var thisweb = null;
		if(w.plus){
			//指定页面关闭
			if(wid){
				thisweb = plus.webview.getWebviewById(wid);
				if(thisweb){
					thisweb.close("slide-out-right",300);
				}
			}else{
				//当前页面关闭
				plus.webview.currentWebview().close("slide-out-right",300); 
			}
		}
	};
	var wait =60;
	u.time = function(o){//倒计时获取验证码
		if (wait == 0) {
			o.removeAttribute("disabled");
			o.textContent = "获取验证码";
			o.value = "获取验证码";
			wait = 60;
		} else {
			o.setAttribute("disabled", "disabled");
			o.textContent = "倒计时(" + wait + "s)";
			o.value = "倒计时(" + wait + "s)";
			wait--;
			setTimeout(function() {
				u.time(o);
			}, 1000)
		}
	};
	u.upImg = function(self){// 拍照-选择照片添加文件	
		plus.nativeUI.actionSheet({cancel:"取消",buttons:[{title:"拍照上传"},{title:"相册选择"}]}, function(e){
			if(e.index == 0) return;
			if(e.index == 1){
				plus.camera.getCamera(1).captureImage(function(p){
					self.src = plus.io.convertLocalFileSystemURL(p);
				});
			}else if(e.index == 2){
				plus.gallery.pick(function(p){
					self.src = p;
				},{
					filter:"image",multiple:false
				})
			}
		});
	};
	u.exitApp = function(){
		if(plus.os.name=="Android"){
			plus.runtime.quit();
		}
	};
	w.toIndex = function(i,ex) {
		/**
		* 跳转到首页
		* 参数默认为0(首页tab bar 的第一个子页面)
		* */
		var i = i || 0;//设置默认值为0 
		var idArr=["gohome","goClinic","goInfo","goMycenter"];
		var main = plus.webview.getWebviewById("tabbar");
		mui.fire(main,'goIndex',{id:idArr[i]});	
		main.show();
		if(i == 1){//医生列表
			var hid = ex && ex.hid;
			var web = plus.webview.getWebviewById("doctor/doctor_list.html");
			if(web){
				web.evalJS("getDocByHid('"+hid+"')");
			}
		}
	};
	u.emptyHtml = function(list,flag){
		if(list && !flag){
			list.innerHTML = "";
		}
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	};
	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};
	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};
	u.checkPhone = function(phone){
		var pReg =  /^1[0-9]{10}$/;
		var pReg_HK =  /^([5|6|9|8])\d{7}$/;
		return pReg.test(phone) || pReg_HK.test(phone);
	};
	u.checkAge = function(age){
		var pReg =  /^([0-9]|[0-9]{2}|100)$/;
		return pReg.test(age);
	};
	u.checkCardId = function(cardId){
		var pReg =  /^(\d{16}|\d{19})$/;
		return pReg.test(cardId);
	};
	u.checkIdCard = function(idCard){
		var pReg =  /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		return pReg.test(idCard);
	};
	u.checkMoney = function(num){
		var pReg =  /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		return pReg.test(num);
	};
	u.isNull = function (value) {
    	value =  value.replace(/(^\s*)|(\s*$)/g, "");
      return (value === "null" || value === null || value === "" || value === "undefined") ? true : false;
  };
})(window, mui, window.util = {},window.app = {});

	/**
	 * 原始js封装方法
	 * **/
	function hasClass(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	
	function addClass(obj, cls) {
		if(!this.hasClass(obj, cls)) obj.className += " " + cls;
	}
	
	function removeClass(obj, cls) {
		if(hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, ' ');
		}
	}
	
	function toggleClass(obj, cls) {
		if(hasClass(obj, cls)){
			removeClass(obj, cls);
		}else{
			addClass(obj, cls);
		}
	}
	
	/**
	 * post - error
	 * **/
	function myerror(){
		mui.toast("访问失败，请重试");
	}
	//过滤表情字符
	function filteremoji(emojireg){
	    var ranges = [
	        '\ud83c[\udf00-\udfff]', 
	        '\ud83d[\udc00-\ude4f]', 
	        '\ud83d[\ude80-\udeff]'
	    ];
	    emojireg = emojireg .replace(new RegExp(ranges.join('|'), 'g'), '');
	    return emojireg;
	}
	
	/**
	 * 判断是否是表情
	 * */
	function isEmojiCharacter(substring) { 
	    for ( var i = 0; i < substring.length; i++) {  
	        var hs = substring.charCodeAt(i);  
	        if (0xd800 <= hs && hs <= 0xdbff) {  
	            if (substring.length > 1) {  
	                var ls = substring.charCodeAt(i + 1);  
	                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
	                if (0x1d000 <= uc && uc <= 0x1f77f) {  
	                    return true;  
	                }  
	            }  
	        } else if (substring.length > 1) {  
	            var ls = substring.charCodeAt(i + 1);  
	            if (ls == 0x20e3) {  
	                return true;  
	            }  
	        } else {  
	            if (0x2100 <= hs && hs <= 0x27ff) {  
	                return true;  
	            } else if (0x2B05 <= hs && hs <= 0x2b07) {  
	                return true;  
	            } else if (0x2934 <= hs && hs <= 0x2935) {  
	                return true;  
	            } else if (0x3297 <= hs && hs <= 0x3299) {  
	                return true;  
	            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
	                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
	                    || hs == 0x2b50) {  
	                return true;  
	            }  
	        }  
	    }  
	}  