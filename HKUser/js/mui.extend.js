(function(b,a){b.fn.scrollX=function(c,e){var d=[];this.each(function(){var g=this.getAttribute("data-scroll");!g&&e.call(this);var f=b(this).scroll(b.extend({},c,{scrollY:false,scrollX:true,indicators:false}));d.push(f)});return d.length===1?d[0]:d}})(mui,window);(function(b,d,c){var a=b.Class.extend({init:function(f,e){this.wrapper=f.parentNode;this.lazyNodes=[],this.scroller=f;this.options=b.extend({selector:"img[data-lazy]",placeholder:""},e);this._set(),this._init(),this._scroll()},_init:function(f){var e=f?"removeEventListener":"addEventListener";this.scroller[e]("webkitTransitionEnd",this);this.wrapper[e]("scroll",this)},_set:function(){var e=this.options.selector,g=this.options.placeholder,f=this;var h=this.wrapper.querySelectorAll(e)||[];b.each(h,function(l,k){var i=k.getAttribute("data-lazy"),m={},j=k.getAttribute("lazy-index")||0;m.node=k,m.src=i,m.finish=false;k.src=(g instanceof Array)?(g[j]||g[0]):g;k.removeAttribute("data-lazy"),k.removeAttribute("lazy-index");f.lazyNodes.push(m)})},handleEvent:function(f){switch(f.type){case"webkitTransitionEnd":case"scroll":this._scroll();break}},_scroll:function(){var e=this;b.each(this.lazyNodes,function(h,j){if(j.finish==true){return}var i=j.node,f=e.wrapper.offsetHeight,k=i.getBoundingClientRect().top;if(k-f>80){return}var g=new Image();e.lazyNodes[h].finish=true;g.onload=function(){i.classList.add("fade-in"),i.src=j.src};g.onerror=function(){e.lazyNodes[h].finish=false};g.src=j.src})},appendNode:function(){var e=this.options.selector,h=this.options.placeholder,f=this;var g=this.wrapper.querySelectorAll(e)||[];b.each(g,function(l,k){var j=k.getAttribute("data-lazy"),m={};m.node=k,m.src=j,m.finish=false;imgs.src=h,k.removeAttribute("data-lazy");f.lazyNodes.push(m)})}});b.fn.lazyImg=function(e){var f=[];this.each(function(){var g=this,h=null;g=(g===c||g===d)?c.body:g;var i=g.getAttribute("data-lazyImg");if(!i){i=++b.uuid;b.data[i]=h=new a(g,e);g.setAttribute("data-lazyImg",i)}else{h=b.data[i]}f.push(h)});return f.length===1?f[0]:f}})(mui,window,document);