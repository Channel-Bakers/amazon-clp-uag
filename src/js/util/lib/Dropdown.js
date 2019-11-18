'use strict';

import env from '../../../../env';
import {isObjectEmpty} from '../helpers/object';
// import image2base64 from '../helpers/image2base64';

export default class Dropdown {
	constructor(params) {
		const defaultParams = {
			title: '',
			image: '',
			id: '',
			data: [],
		};

		this.params = {...defaultParams, ...params};
		this.activeOption = {};
		this.elements = {};

		return (async () => {
			return await this._init();
		})();
	}

	_getActiveSeries() {
		return this.elements.series.options[this.elements.series.selectedIndex]
			.value;
	}

	_getActiveColor() {
		return JSON.parse(
			this.elements.color.options[
				this.elements.color.selectedIndex
			].getAttribute('data-option-params')
		);
	}

	// _buildATCLink() {
	// 	let atcUrl = new URL('https://www.amazon.com/gp/item-dispatch/');
	// 	atcUrl.searchParams.set('submit.addToCart', 'addToCart');

	// 	this.params.builder.dropdowns.forEach((dropdown, index) => {
	// 		atcUrl.searchParams.set(
	// 			`offeringID.${++index}`,
	// 			dropdown.activeOption.offeringID
	// 		);
	// 	});

	// 	const SESSION_ID =
	// 		(window.CB && window.CB.sessionID) || getCookie('session-id');

	// 	if (SESSION_ID) atcUrl.searchParams.set('session-id', SESSION_ID);

	// 	this.params.builder.elements.atc.href = atcUrl.href;

	// 	return this;
	// }

	// _rebuildATCLink() {
	// 	this.activeOption = this._getActiveColor();

	// 	const OPTION_CHANGE = new CustomEvent('dropdown.color.change', {
	// 		detail: this.activeOption,
	// 	});

	// 	this.params.builder.elements.wrapper.dispatchEvent(OPTION_CHANGE);
	// }

	// _renderATCLink() {
	// 	const CTA = document.createElement('a');
	// 	CTA.classList.add(`${env.clientPrefix}-select-addToCart`);
	// 	CTA.setAttribute('data-select-id', this.params.id);
	// 	CTA.href = '#';
	// 	CTA.innerText = 'Add to Cart';

	// 	this.params.builder.elements.atc = CTA;

	// 	return CTA;
	// }

	_rebuildATCLink() {
		this.activeOption = this._getActiveColor();

		const OPTION_CHANGE = new CustomEvent('dropdown.color.change', {
			detail: this.activeOption,
		});

		this.params.builder.elements.wrapper.dispatchEvent(OPTION_CHANGE);
	}

	async _renderSeries() {
		const SERIES_WRAPPER = document.createElement('div');
		SERIES_WRAPPER.classList.add(`${env.clientPrefix}-dropdown-container`);

		SERIES_WRAPPER.setAttribute(
			'data-select-id',
			`${this.params.id}-series`
		);

		const SELECT_WRAPPER = this._renderSeriesSelect();
		this.elements.wrapper.appendChild(SELECT_WRAPPER);

		if (!isObjectEmpty(this.params.data)) {
			await this._renderSeriesOptions();
		}

		return this;
	}

	_renderSeriesSelect() {
		const SELECT_WRAPPER = document.createElement('div');
		SELECT_WRAPPER.classList.add(`${env.clientPrefix}-select-container`);

		const SELECT = document.createElement('select');
		SELECT.classList.add(`${env.clientPrefix}-select-dropdown`);
		SELECT.setAttribute('name', `${this.params.id}-series`);
		SELECT.setAttribute('id', `${this.params.id}-series`);

		this.elements.series = SELECT;

		SELECT_WRAPPER.appendChild(SELECT);

		return SELECT_WRAPPER;
	}

	async _renderSeriesOptions() {
		const OPTIONS = Object.keys(this.params.data);

		try {
			OPTIONS.forEach((option) => {
				const OPTION_ELEMENT = document.createElement('option');
				OPTION_ELEMENT.value = option;
				OPTION_ELEMENT.innerText = option;

				this.elements.series.appendChild(OPTION_ELEMENT);
			});
		} catch (error) {
			console.log(error);
		}

		return this;
	}

	async _renderColor() {
		const COLOR_WRAPPER = document.createElement('div');
		COLOR_WRAPPER.classList.add(`${env.clientPrefix}-dropdown-container`);

		COLOR_WRAPPER.setAttribute('data-select-id', `${this.params.id}-color`);

		const SELECT_WRAPPER = this._renderColorSelect();
		this.elements.wrapper.appendChild(SELECT_WRAPPER);

		if (!isObjectEmpty(this.params.data)) {
			await this._renderColorOptions();
		}

		return this;
	}

	_renderColorSelect() {
		const SELECT_WRAPPER = document.createElement('div');
		SELECT_WRAPPER.classList.add(`${env.clientPrefix}-select-container`);

		const SELECT = document.createElement('select');
		SELECT.classList.add(`${env.clientPrefix}-select-dropdown`);
		SELECT.setAttribute('name', `${this.params.id}-color`);
		SELECT.setAttribute('id', `${this.params.id}-color`);

		this.elements.color = SELECT;

		SELECT_WRAPPER.appendChild(SELECT);

		// if (this.params.atc) {
		// 	const CTA = this._renderATCLink();
		// 	SELECT_WRAPPER.appendChild(CTA);
		// }

		return SELECT_WRAPPER;
	}

	async _renderColorOptions() {
		const OPTIONS = this.params.data[this._getActiveSeries()];

		try {
			OPTIONS.forEach((option) => {
				const OPTION_ELEMENT = document.createElement('option');
				OPTION_ELEMENT.value = option.color;
				OPTION_ELEMENT.innerText = option.color;

				const OPTION_DATA = {
					asin: option.asin,
					price: option.price,
					image: option.image,
					offeringID: option.offeringID,
				};

				OPTION_ELEMENT.setAttribute(
					'data-option-params',
					JSON.stringify(OPTION_DATA)
				);

				this.elements.color.appendChild(OPTION_ELEMENT);
			});
		} catch (error) {
			console.log(error);
		}

		return this;
	}

	async _rebuildColorOptions() {
		this.elements.color.innerHTML = '';
		this._renderColorOptions();

		return this;
	}

	_renderImage() {
		const IMAGE_WRAPPER = document.createElement('div');
		IMAGE_WRAPPER.classList.add(`${env.clientPrefix}-image-container`);

		const IMAGE = document.createElement('div');
		IMAGE.classList.add(`${env.clientPrefix}-image`);

		// const SRC_URL = this.activeOption.image;

		// image2base64(SRC_URL, function(base64) {
		// 	IMAGE.style.backgroundImage = base64;
			// const image = new Image();
			// image.src = base64;

			// image.onload = function() {
			// 	const canvas = document.createElement('canvas');
			// 	canvas.width = this.naturalWidth;
			// 	canvas.height = this.naturalHeight;

			// 	canvas.getContext('2d').drawImage(this, 0, 0);

			// 	callback(canvas.toDataURL('image/jpg'));
			// 	console.log(image.naturalHeight, image.naturalWidth);
			// }

			// $('#original').on('load', function() {
			// 	var canvas = document.getElementById('modified'),
			// 		ctx = canvas.getContext('2d'),

			// 	canvas.height = image.height;
			// 	canvas.width = image.width;
			// 	ctx.drawImage(image, 0, 0);

			// 	var imgd = ctx.getImageData(0, 0, image.height, image.width),
			// 		pix = imgd.data,
			// 		newColor = {r: 0, g: 0, b: 0, a: 0};

			// 	for (var i = 0, n = pix.length; i < n; i += 4) {
			// 		var r = pix[i],
			// 			g = pix[i + 1],
			// 			b = pix[i + 2];

			// 		if (r >= 230 && g >= 230 && b >= 230) {
			// 			// Change the white to the new color.
			// 			pix[i] = newColor.r;
			// 			pix[i + 1] = newColor.g;
			// 			pix[i + 2] = newColor.b;
			// 			pix[i + 3] = newColor.a;
			// 		}
			// 	}

			// 	IMAGE.style.backgroundImage = canvas.toDataURL('image/jpg');
			// });
		// });

		IMAGE_WRAPPER.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/rdimascio/uag@0.1/assets/img/bundle-image-bg.jpg')`;
		IMAGE.style.backgroundImage = `url('${this.activeOption.image}')`;
		this.elements.image = IMAGE;

		IMAGE_WRAPPER.appendChild(IMAGE);
		this.elements.wrapper.prepend(IMAGE_WRAPPER);
	}

	async _render() {
		const DROPDOWN_WRAPPER = document.createElement('div');
		DROPDOWN_WRAPPER.classList.add(`${env.clientPrefix}-dropdown-wrapper`);

		this.elements.wrapper = DROPDOWN_WRAPPER;

		await this._renderSeries();
		await this._renderColor();

		this.activeOption = this._getActiveColor();

		this._renderImage();

		// if (this.params.atc) this._buildATCLink();

		await this._events();

		this.html = DROPDOWN_WRAPPER;
		// this.params.builder.dropdowns.push(this);
	}

	async _events() {
		const SERIES = this.elements.series;
		const COLOR = this.elements.color;

		SERIES.addEventListener('change', () => {
			this._rebuildColorOptions();
			this._rebuildATCLink();
			this.elements.image.style.backgroundImage = `url('${this.activeOption.image}')`;
		});

		COLOR.addEventListener('change', () => {
			this._rebuildATCLink();
			this.elements.image.style.backgroundImage = `url('${this.activeOption.image}')`;
		});

		return this;
	}

	async _init() {
		try {
			await this._render();
		} catch (error) {
			if (!document.body.classList.contains(`${env.clientPrefix}-err`)) {
				document.body.classList.add(`${env.clientPrefix}-err`);
			}

			console.log(error);
		}

		return this;
	}
}
