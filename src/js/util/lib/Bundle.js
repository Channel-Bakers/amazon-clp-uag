'use strict';

import Dropdown from './Dropdown';
import env from '../../../../env';
import {getCookie} from '../helpers/cookies';
import {strToNumber} from '../helpers/string';
import { numToCurrency } from '../helpers/number';

export default class Builder {
	constructor(params) {
		const defaultParams = {
			target: 'atcBuilder', // The data-builder-target attribute of the wrapper element
			title: '',
			caption: '',
			colors: [],
			dropdowns: [],
		};

		this.params = {...defaultParams, ...params};
		this.dropdowns = [];
		this.elements = {};
		this.state = {};

		return (async () => {
			return await this._init();
		})();
	}

	// getActiveSeries() {
	// 	return this.params.colors.reduce((color) => color.active && color);
	// }

	// getActiveModel() {
	// 	return this.params.colors.reduce((color) => color.active && color);
	// }

	_attachATCEvents() {
		const ATC = this.elements.atc;

		ATC.addEventListener('click', (event) => {
			event.preventDefault();

			window.open(event.target.href, '_blank');
		});
	}

	_buildATCLink() {
		let atcUrl = new URL('https://www.amazon.com/gp/item-dispatch/');
		atcUrl.searchParams.set('submit.addToCart', 'addToCart');

		this.dropdowns.forEach((dropdown, index) => {
			atcUrl.searchParams.set(
				`offeringID.${++index}`,
				dropdown.activeOption.offeringID
			);
		});

		const SESSION_ID =
			(window.CB && window.CB.sessionID) || getCookie('session-id');

		if (SESSION_ID) atcUrl.searchParams.set('session-id', SESSION_ID);

		this.elements.atc.href = atcUrl.href;

		return this;
	}

	_renderATCLink() {
		const CTA_CONTAINER = document.createElement('div');
		const CTA_WRAPPER = document.createElement('div');
		const PRICE_WRAPPER = document.createElement('div');
		const PRICE = document.createElement('h6');
		const CTA = document.createElement('a');

		CTA_CONTAINER.classList.add(`${env.clientPrefix}-cta-container`);
		CTA_WRAPPER.classList.add(`${env.clientPrefix}-cta-wrapper`);
		CTA.classList.add(`${env.clientPrefix}-cta`);
		CTA.href = '#';
		CTA.innerText = 'Add to Cart';

		PRICE_WRAPPER.classList.add(`${env.clientPrefix}-price-wrapper`)
		PRICE.classList.add(`${env.clientPrefix}-price`);
		PRICE.innerHTML = 'Total: '
		PRICE.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
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

		this.elements.atc = CTA;
		this.elements.price = PRICE;

		this._attachATCEvents();

		CTA_WRAPPER.appendChild(CTA);

		CTA_CONTAINER.appendChild(PRICE);
		CTA_CONTAINER.appendChild(CTA_WRAPPER);

		return CTA_CONTAINER;
	}

	_renderPrice() {
		let regularPrice = 0;
		let discountPrice = 0;

		this.dropdowns.forEach((dropdown, index) => {
			let price = strToNumber(dropdown.activeOption.price);
			regularPrice += price;

			if (index + 1 === this.params.dropdowns.length) {
				price = this.params.discount.symbol === '$'
					? (price - this.params.discount.amount)
					: (price * (this.params.discount.amount / 100))
			}

			discountPrice += price;
		});

		this.elements.price.innerHTML = `<span>Total:</span> <span class="regular">${numToCurrency(regularPrice)}</span> ${numToCurrency(discountPrice)}`;
	}

	_rebuildATCLink() {
		let atcUrl = new URL(this.elements.atc.href);
		atcUrl.searchParams.delete('offeringID.1');
		atcUrl.searchParams.delete('offeringID.2');

		this.dropdowns.forEach((dropdown, index) => {
			atcUrl.searchParams.set(
				`offeringID.${++index}`,
				dropdown.activeOption.offeringID
			);
		});

		if (!atcUrl.searchParams.has('session-id')) {
			const SESSION_ID =
				(window.CB && window.CB.sessionID) || getCookie('session-id');

			if (SESSION_ID) atcUrl.searchParams.set('session-id', SESSION_ID);
		}

		this.elements.atc.href = atcUrl.href;

		return this;
	}

	async _renderDropdowns() {
		this.params.dropdowns.forEach(async (dropdown, index) => {
			const DROPDOWN = await new Dropdown({
				...dropdown,
				builder: this,
			});

			this.dropdowns.push(DROPDOWN);

			try {
				this.elements.wrapper.appendChild(DROPDOWN.html);

				if (index + 1 === this.params.dropdowns.length - 1) {
					const PLUS = document.createElement('div');
					const PLUS_ICON = document.createElement('img');

					PLUS.classList.add(`${env.clientPrefix}-bundle-plus`);
					PLUS_ICON.src = `https://cdn.jsdelivr.net/gh/rdimascio/uag@${env.release}/assets/img/plus.png`;

					PLUS.appendChild(PLUS_ICON);
					this.elements.wrapper.appendChild(PLUS);
				}

				if (index + 1 === this.params.dropdowns.length) {
					const CTA = this._renderATCLink();
					this.elements.container.appendChild(CTA);
					this._buildATCLink();
					this._renderPrice();
				}
			} catch (error) {
				console.log(error);
			}
		});

		return this;
	}

	// _getImageSrc() {
	// 	let imageSrc;

	// 	if (this.params.dropdowns && this.params.dropdowns.length < 2) {
	// 		return null;
	// 	} else {
	// 		const COLORS = this.params.colors && this.params.colors.length > 0;

	// 		if (COLORS) {
	// 			const ACTIVE_COLOR = COLORS
	// 				? this.getActiveColor()
	// 				: this.params.image;

	// 			imageSrc =
	// 				typeof ACTIVE_COLOR !== 'object'
	// 					? ACTIVE_COLOR
	// 					: ACTIVE_COLOR.image;
	// 		} else {
	// 			imageSrc = this.params.image.src ? this.params.image.src : null;
	// 		}
	// 	}

	// 	return imageSrc;
	// }

	// _renderImage(src = false) {
	// 	const MOBILE = document.querySelector('.shipable-page')
	// 		? document
	// 				.querySelector('.shipable-page')
	// 				.classList.contains('platform-phone')
	// 		: false;
	// 	const IMAGE_SRC = src ? src : this._getImageSrc();

	// 	// The image element already exists, we don't need to create
	// 	// another one, let's just update the style of the existing node.
	// 	if (this.elements.image || !this.elements.image instanceof Node) {
	// 		this.elements.image.style.backgroundImage = `url('${IMAGE_SRC}')`;
	// 		return this;
	// 	}

	// 	const IMAGE_POSITION = this.params.image.position;
	// 	const IMAGE_WRAPPER = document.createElement('div');
	// 	const IMAGE = document.createElement('div');
	// 	const TARGET = MOBILE
	// 		? document.querySelector(
	// 				`[data-builder-target="${this.params.target}"] .${env.clientPrefix}-builder-details`
	// 		  )
	// 		: document.querySelector(
	// 				`[data-builder-target="${this.params.target}"]`
	// 		  );
	// 	const ATTACH_METHOD =
	// 		MOBILE || (IMAGE_POSITION && IMAGE_POSITION === 'right')
	// 			? 'appendChild'
	// 			: 'prepend';

	// 	if (IMAGE_POSITION)
	// 		this.elements.wrapper.classList.add(
	// 			IMAGE_POSITION === 'right' ? 'left' : 'right'
	// 		);

	// 	IMAGE_WRAPPER.classList.add(`${env.clientPrefix}-image-container`);
	// 	IMAGE.classList.add(`${env.clientPrefix}-image`);

	// 	if (IMAGE_SRC) {
	// 		IMAGE.style.backgroundImage = `url('${IMAGE_SRC}')`;

	// 		IMAGE_WRAPPER.appendChild(IMAGE);

	// 		this.elements.image = IMAGE;

	// 		TARGET[ATTACH_METHOD](IMAGE_WRAPPER);
	// 	}

	// 	return this;
	// }

	async _events() {
		const TARGET = this.elements.wrapper;

		TARGET.addEventListener('dropdown.color.change', (event) => {
			this._rebuildATCLink();
			this._renderPrice();
		});

		// TARGET.addEventListener('dropdown.option.change', (event) => {
		// 	if (!this._isThisABundle()) {
		// 		this._renderImage(event.detail.image);
		// 	}

		// 	this.elements.wrapper.querySelector(
		// 		`.${env.clientPrefix}-builder-price`
		// 	).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
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
		// });

		// this.elements.atc.addEventListener('click', async (event) => {
		// 		event.preventDefault();

		// 		if (event.target.classList.contains('disabled')) {
		// 			return false;
		// 		}

		// 		const SESSION_ID =
		// 			(window.CB && window.CB.sessionID) || getCookie('session-id');

		// 		if (SESSION_ID) {
		// 			try {
		// 				const LOADING_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
		// 					<defs>
		// 						<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
		// 							<stop stop-color="#7B827B" stop-opacity="0" offset="0%"/>
		// 							<stop stop-color="#7B827B" stop-opacity=".631" offset="63.146%"/>
		// 							<stop stop-color="#7B827B" offset="100%"/>
		// 						</linearGradient>
		// 					</defs>
		// 					<g fill="none" fill-rule="evenodd">
		// 						<g transform="translate(1 1)">
		// 							<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3" transform="rotate(293.261 18 18)">
		// 								<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
		// 							</path>
		// 							<circle fill="#7B827B" cx="36" cy="18" r="1" transform="rotate(293.261 18 18)">
		// 								<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
		// 							</circle>
		// 						</g>
		// 					</g>
		// 				</svg>`;

		// 				const LOADED_ICON = `<svg width="19px" height="14px" viewBox="0 0 19 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		// 						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
		// 							<polyline id="Line" stroke="#007600" stroke-width="2" points="2 7.33333333 7 12 17.6452904 1.61165461"></polyline>
		// 						</g>
		// 					</svg>`;

		// 				const ATC_DATA = {
		// 					verificationSessionID: SESSION_ID,
		// 					offerListingID: this.activeOption.offeringID,
		// 					quantity: '1',
		// 					ASIN: this.activeOption.asin,
		// 				};

		// 				const ATC_REQUEST = await fetch(
		// 					'https://www.amazon.com/gp/add-to-cart/json',
		// 					{
		// 						method: 'POST',
		// 						headers: {
		// 							'Content-Type':
		// 								'application/x-www-form-urlencoded',
		// 						},
		// 						body: serializeObject(ATC_DATA),
		// 					}
		// 				);

		// 				const LOADER_WRAPPER = document.createElement('div');
		// 				const LOADER_CONTENT = document.createElement('div');
		// 				const LOADER = document.createElement('div');

		// 				LOADER_WRAPPER.classList.add('loading-wrapper');
		// 				LOADER_WRAPPER.classList.add('is-loading');
		// 				LOADER_CONTENT.classList.add('loading-content');
		// 				LOADER.classList.add('loading');
		// 				LOADER.innerHTML = LOADING_ICON;

		// 				LOADER_CONTENT.appendChild(LOADER);
		// 				LOADER_WRAPPER.appendChild(LOADER_CONTENT);
		// 				document.body.appendChild(LOADER_WRAPPER);

		// 				const ATC_RESPONSE = await ATC_REQUEST.json();

		// 				if (ATC_RESPONSE.isOK && ATC_RESPONSE.cartQuantity) {
		// 					const CART = document.getElementById('nav-cart-count');

		// 					if (CART) CART.innerHTML = ATC_RESPONSE.cartQuantity;

		// 					LOADER_WRAPPER.classList.remove('is-loading');
		// 					LOADER_WRAPPER.classList.add('is-loaded');

		// 					LOADER.innerHTML = LOADED_ICON;
		// 					LOADER.innerHTML += '<h4>Added to Cart</h4>';

		// 					setTimeout(() => {
		// 						LOADER_WRAPPER.outerHTML = '';
		// 					}, 1000);
		// 				}
		// 			} catch (error) {
		// 				window.open(event.target.href, '_blank');
		// 			}
		// 		} else {
		// 			window.open(event.target.href, '_blank');
		// 		}
		// 	});
	}

	async _render() {
		const WRAPPER = document.querySelector(
			`[data-bundle-target="${this.params.target}"]`
		);

		const PARENT_WRAPPER = WRAPPER.closest('.bundle-wrapper');
		PARENT_WRAPPER.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/rdimascio/uag@${env.release}/assets/img/bundle-bg.jpg')`;

		if (PARENT_WRAPPER.querySelector('.bundle-wrapper-top')) {
			PARENT_WRAPPER.querySelector(
				'.bundle-wrapper-top'
			).style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/rdimascio/uag@${env.release}/assets/img/bundle-top-bg.jpg')`;
		}

		if (!WRAPPER || WRAPPER.innerHTML !== '') return;

		WRAPPER.classList.add(`${env.clientPrefix}-container`);
		WRAPPER.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/rdimascio/uag@${env.release}/assets/img/bundle-card-bg.jpg')`;

		// if (this.params.background) {
		// 	WRAPPER.style.backgroundImage = this.params.background;
		// } else {
		// 	WRAPPER.style.background = '#FFFFFF';
		// }

		const HEADER = document.createElement('div');
		HEADER.classList.add(`${env.clientPrefix}-bundle-header`);

		const HEADER_IMAGE = document.createElement('div');
		HEADER_IMAGE.classList.add(`${env.clientPrefix}-bundle-header-image`);
		HEADER_IMAGE.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/rdimascio/uag@${env.release}/assets/img/headers/${this.params.target}.png')`;

		const HEADER_TITLE = document.createElement('div');
		HEADER_TITLE.classList.add(`${env.clientPrefix}-bundle-header-title`);
		HEADER_TITLE.innerHTML = `
			<h2>${
				this.params.discount.symbol === '$'
					? `<span class="symbol">$</span>${this.params.discount.amount} <span>off</span>`
					: `${this.params.discount.amount}<span class="symbol">%</span> <span>off</span>`
			}</h2>
			<h6>${this.params.discount.product}</h6>
		`;

		HEADER.appendChild(HEADER_IMAGE);
		HEADER.appendChild(HEADER_TITLE);
		WRAPPER.appendChild(HEADER);

		const TARGET = document.createElement('div');

		if (!TARGET.classList.contains(`${env.clientPrefix}-bundle-container`))
			TARGET.classList.add(`${env.clientPrefix}-bundle-container`);

		WRAPPER.appendChild(TARGET);
		this.elements.container = WRAPPER;
		this.elements.wrapper = TARGET;

		await this._renderDropdowns();
		await this._events();

		return this;
	}

	async _init() {
		try {
			await this._render();
			document.body.classList.add(`${env.clientPrefix}-loaded`);
		} catch (error) {
			document.body.classList.add(`${env.clientPrefix}-err`);
		}

		return this;
	}
}
