
(function (doc, win) {
	// 当设备横竖屏切换时，变更html的字体大小
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = 20 * (clientWidth / 750) + 'px';
	};

	if (!doc.addEventListener) return;
	recalc();
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);