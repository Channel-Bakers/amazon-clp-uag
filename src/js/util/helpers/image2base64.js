'use strict';

export default (url, callback) => {
	const proxyUrl = window.location.host.includes('amazon.com')
		? ''
		: 'https://cors-anywhere.herokuapp.com/';

	const image = new Image();
	image.crossOrigin = 'Anonymous';
	image.onload = function() {
		const canvas = document.createElement('canvas');
		canvas.width = this.naturalWidth;
		canvas.height = this.naturalHeight;

		const ctx = 

		canvas.getContext('2d').drawImage(this, 0, 0);

		var imgd = canvas.getImageData(0, 0, this.naturalHeight, this.naturalWidth),
			pix = imgd.data,
			newColor = {r: 0, g: 0, b: 0, a: 0};

		for (var i = 0, n = pix.length; i < n; i += 4) {
			var r = pix[i],
				g = pix[i + 1],
				b = pix[i + 2];

			if (r >= 230 && g >= 230 && b >= 230) {
				// Change the white to the new color.
				pix[i] = newColor.r;
				pix[i + 1] = newColor.g;
				pix[i + 2] = newColor.b;
				pix[i + 3] = newColor.a;
			}
		}

		callback(canvas.toDataURL('image/jpg'));
	};

	image.src = proxyUrl + url;
};
