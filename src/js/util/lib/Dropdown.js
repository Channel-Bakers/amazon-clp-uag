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

	_parsePrice(html) {
		const MOBILE = document.querySelector('.shipable-page')
			? document
					.querySelector('.shipable-page')
					.classList.contains('platform-phone')
			: false;

		const PRICE = {};
		let price;

		try {
			const ASIN = html.getElementById('ASIN');
			const OUT_OF_STOCK = ASIN.value !== this.activeOption.asin;

			if (OUT_OF_STOCK) {
				PRICE.price = null;
				PRICE.available = false;
				return PRICE;
			}

			let prices = [];

			if (MOBILE && /Android/.test(window.navigator.userAgent)) {
				const MOBILE_PRICE_TABLE = html.querySelector(
					'#newPitchPriceWrapper_feature_div'
				);

				if (MOBILE_PRICE_TABLE) {
					const SALE_PRICE_DOLLARS = MOBILE_PRICE_TABLE.querySelector(
						'.price-large'
					);

					let priceCents = MOBILE_PRICE_TABLE.querySelector(
						'.price-info-superscript'
					);
					priceCents = priceCents ? priceCents.innerText : '00';

					if (SALE_PRICE_DOLLARS) {
						let price = `${SALE_PRICE_DOLLARS.innerText}.${priceCents}`;
						price = parseFloat(price);

						if (!isNaN(price)) {
							prices.push(price);
						}
					}
				}

				// CHECK TO SEE IF UAG IS WINNING THE BUY BOX
				// IF NOT, WE HAVE TO
				const MERCHANT_ID = html.querySelector('#ftSelectMerchant')
					.value;

				if (MERCHANT_ID !== env.merchantID) {
					// UAG is not winning the Buy Box
					// so we can either return not available
					// or scrape the other sellers html and look
					// for their merchant ID and offerListing ID
					// this._scrapeOtherSellers();

					// This is the return not available method
					PRICE.price = null;
					PRICE.available = false;
					return PRICE;
				}
			} else {
				const PRICE_TABLE = html.querySelector('#price');

				if (PRICE_TABLE) {
					PRICE_TABLE.querySelectorAll(
						'tr:not(#regularprice_savings):not(.aok-hidden) td > span:not(#listPriceLegalMessage):not(#ourprice_shippingmessage)'
					).forEach(function(element) {
						if (element.innerText.includes('$')) {
							if (
								'primeExclusivePricingMessage' ===
								element.getAttribute('id')
							) {
								let primePrice = element
									.querySelector('a:not(span)')
									.innerText.trim()
									.split('$')[1]
									.split(' ')[0]
									.split(',')
									.join('');
								primePrice = parseFloat(primePrice);
								if (!isNaN(primePrice) && prices.length) {
									prices.push(prices[0] - primePrice);
								}
							} else {
								let thisElement = element.innerText
									.trim()
									.split('$')[1]
									.split(',')
									.join('');
								thisElement = parseFloat(thisElement);
								if (!isNaN(thisElement)) {
									prices.push(thisElement);
								}
							}
						}
					});
				}

				// CHECK TO SEE IF UAG IS WINNING THE BUY BOX
				// IF NOT, WE HAVE TO
				const MERCHANT_ID = html.querySelector('#merchantID').value;

				if (MERCHANT_ID !== env.merchantID) {
					// UAG is not winning the Buy Box
					// so we can either return not available
					// or scrape the other sellers html and look
					// for their merchant ID and offerListing ID
					// this._scrapeOtherSellers();

					// This is the return not available method
					console.log('merchantID does not match');
					console.log(MERCHANT_ID);
					console.log(env.merchantID);

					PRICE.price = null;
					PRICE.available = false;
					return PRICE;
				}
			}

			switch (prices.length) {
				case 0:
					price = null;
					break;
				case 1:
					price = prices[0];
					break;
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					price = Math.min(...prices);
					break;
			}

			if (price) PRICE.price = price;

			if (isObjectEmpty(PRICE)) {
				PRICE.price = this.activeOption.price;
			}

			PRICE.available = true;

			return PRICE;
		} catch (error) {
			console.log(error);
		}
	}

	async _scrapePrice() {
		const ASIN = this.activeOption.asin;
		const PROXY = window.location.host.includes('amazon')
			? ''
			: 'https://cors-anywhere.herokuapp.com/';

		const HEADERS = new Headers({
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
		});

		try {
			const ASIN_REQUEST = await fetch(
				`${PROXY}https://www.amazon.com/dp/${ASIN}?smid=${env.merchantID}&th=1&psc=1`,
				{
					method: 'GET',
					headers: HEADERS,
				}
			);

			const ASIN_RESPONSE = await ASIN_REQUEST.text();

			const PARSER = new DOMParser();
			const HTML = PARSER.parseFromString(ASIN_RESPONSE, 'text/html');

			const PRICE = this._parsePrice(HTML);

			return PRICE && typeof PRICE === 'object' && !isObjectEmpty(PRICE)
				? PRICE
				: this.activeOption.price;
		} catch {
			return this.activeOption.price;
		}
	}

	// async _renderPrice() {
	// 	const PRICE_WRAPPER = this.elements.wrapper.querySelector(
	// 		`.${env.clientPrefix}-dropdown-price`
	// 	);

	// 	PRICE_WRAPPER.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
	// 			<defs>
	// 				<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
	// 					<stop stop-color="#7B827B" stop-opacity="0" offset="0%"/>
	// 					<stop stop-color="#7B827B" stop-opacity=".631" offset="63.146%"/>
	// 					<stop stop-color="#7B827B" offset="100%"/>
	// 				</linearGradient>
	// 			</defs>
	// 			<g fill="none" fill-rule="evenodd">
	// 				<g transform="translate(1 1)">
	// 					<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3" transform="rotate(293.261 18 18)">
	// 						<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
	// 					</path>
	// 					<circle fill="#7B827B" cx="36" cy="18" r="1" transform="rotate(293.261 18 18)">
	// 						<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
	// 					</circle>
	// 				</g>
	// 			</g>
	// 		</svg>`;

	// 	const PRICES = await this._scrapePrice();

	// 	PRICE_WRAPPER.innerHTML = '';

	// 	if (typeof PRICES === 'object' && !isObjectEmpty(PRICES)) {
	// 		if (PRICES.available) {
	// 			Object.entries(PRICES).forEach(([key, value]) => {
	// 				if (key !== 'available') {
	// 					const PRICE_EL = document.createElement('span');
	// 					PRICE_EL.classList.add(key);
	// 					PRICE_EL.innerText = numToCurrency(value);

	// 					const ATTACH_METHOD =
	// 						key === 'salePrice' ? 'appendChild' : 'prepend';

	// 					PRICE_WRAPPER[ATTACH_METHOD](PRICE_EL);

	// 					if (this.elements.atc.classList.contains('disabled')) {
	// 						this.elements.atc.classList.remove('disabled');
	// 					}
	// 				}
	// 			});
	// 		} else {
	// 			const PRICE_EL = document.createElement('span');
	// 			PRICE_EL.classList.add('outOfStock');
	// 			PRICE_EL.innerText = 'Out of Stock';

	// 			PRICE_WRAPPER.appendChild(PRICE_EL);

	// 			if (!this.elements.atc.classList.contains('disabled')) {
	// 				this.elements.atc.classList.add('disabled');
	// 			}
	// 		}
	// 	} else {
	// 		const PRICE_EL = document.createElement('span');
	// 		PRICE_EL.classList.add('salePrice');
	// 		PRICE_EL.innerText = numToCurrency(PRICES);

	// 		PRICE_WRAPPER.appendChild(PRICE_EL);

	// 		if (this.elements.atc.classList.contains('disabled')) {
	// 			this.elements.atc.classList.remove('disabled');
	// 		}
	// 	}

	// 	const PRICE_CHANGE = new CustomEvent('dropdown.price.update', {
	// 		detail: PRICES,
	// 	});

	// 	this.params.builder.elements.wrapper.dispatchEvent(PRICE_CHANGE);

	// 	return this;
	// }

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

	_updateActiveOption() {
		this.activeOption = this._getActiveColor();
	}

	_updateImage(available = true) {
		this.elements.image.style.backgroundImage = `url('${
			available ? this.activeOption.image : this.activeOption.image
		}')`;
	}

	async _updatePrice() {
		if (this.params.bundle.elements.price)
			this.params.bundle.elements.price.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
				<defs>
					<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
						<stop stop-color="#7B827B" stop-opacity="0" offset="0%"/>
						<stop stop-color="#7B827B" stop-opacity=".631" offset="63.146%"/>
						<stop stop-color="#7B827B" offset="100%"/>
					</linearGradient>
				</defs>
				<g fill="none" fill-rule="evenodd">
					<g transform="translate(1 1)">
						<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3" transform="rotate(293.261 18 18)">
							<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
						</path>
						<circle fill="#7B827B" cx="36" cy="18" r="1" transform="rotate(293.261 18 18)">
							<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
						</circle>
					</g>
				</g>
			</svg>`;

		const NEW_PRICE = await this._scrapePrice();

		this.activeOption.price = NEW_PRICE.price;
		this.activeOption.available = NEW_PRICE.available;

		// Dispatch an event to the bundle
		const OPTION_CHANGE = new CustomEvent('dropdown.color.change', {
			detail: this.activeOption,
		});

		this.params.bundle.elements.wrapper.dispatchEvent(OPTION_CHANGE);
	}

	// _rebuildATCLink() {
	// 	const OPTION_CHANGE = new CustomEvent('dropdown.color.change', {
	// 		detail: this.activeOption,
	// 	});

	// 	this.params.builder.elements.wrapper.dispatchEvent(OPTION_CHANGE);
	// }

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
					promoID: option.promoID,
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

		IMAGE_WRAPPER.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/rdimascio/uag@${env.release}/assets/img/bundle-image-bg.png')`;
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

		this._updateActiveOption();

		this._renderImage();

		// Scrape the ASIN page
		this._updatePrice();

		await this._events();

		this.html = DROPDOWN_WRAPPER;
		// this.params.builder.dropdowns.push(this);
	}

	async _handleColorChange() {
		// Update the active option
		this._updateActiveOption();

		// Update the image
		this._updateImage();

		// Scrape the ASIN page
		this._updatePrice();
	}

	async _events() {
		const SERIES = this.elements.series;
		const COLOR = this.elements.color;

		SERIES.addEventListener('change', () => {
			this._rebuildColorOptions();
			this._handleColorChange();
		});

		COLOR.addEventListener('change', () => {
			this._handleColorChange();
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
