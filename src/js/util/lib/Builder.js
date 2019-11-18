'use strict';

import Dropdown from './Dropdown';
import {isObjectEmpty} from '../helpers/object';
import env from '../../../../env';
import {strToNumber, capitalize} from '../helpers/string';
import {numToCurrency} from '../helpers/number';

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

		return (async () => {
			return await this._init();
		})();
	}

	getActiveColor() {
		return this.params.colors.reduce((color) => color.active && color);
	}

	_isThisABundle() {
		return this.params.dropdowns && this.params.dropdowns.length > 1;
	}

	_renderColorPicker() {
		if (this.params.colors && this.params.colors.length > 0) {
			const COLOR_PICKER_WRAPPER = document.createElement('div');
			COLOR_PICKER_WRAPPER.classList.add(
				`${env.clientPrefix}-color-picker-container`
			);

			this.params.colors.forEach((color) => {
				const COLOR_WRAPPER = document.createElement('a');

				COLOR_WRAPPER.classList.add(
					`${env.clientPrefix}-color-container`
				);
				if (color.active) COLOR_WRAPPER.classList.add('active');

				COLOR_WRAPPER.href = '#';
				COLOR_WRAPPER.setAttribute('title', color.name);
				COLOR_WRAPPER.style.backgroundColor = color.hex;

				COLOR_PICKER_WRAPPER.appendChild(COLOR_WRAPPER);

				const COLOR_EVENT = new CustomEvent('builder.color.change', {
					detail: {color: {...color}},
				});

				COLOR_WRAPPER.addEventListener('click', (event) => {
					event.preventDefault();

					if (event.target.classList.contains('active')) return;

					const COLORS = this.elements.wrapper.querySelectorAll(
						`.${env.clientPrefix}-color-container`
					);

					COLORS.forEach((color) => {
						color.classList.remove('active');
					});

					event.target.classList.add('active');

					this.elements.wrapper.dispatchEvent(COLOR_EVENT);

					this.dropdowns.forEach((dropdown) => {
						dropdown.elements.select.dispatchEvent(COLOR_EVENT);
					});
				});
			});

			document
				.querySelector(
					`[data-builder-target="${this.params.target}"] .${env.clientPrefix}-builder-info`
				)
				.prepend(COLOR_PICKER_WRAPPER);
		}

		return this;
	}

	async _renderDropdowns() {
		this.params.dropdowns.forEach(async (dropdown) => {
			const DROPDOWN = await new Dropdown({
				...dropdown,
				builder: this,
			});
			this.dropdowns.push(DROPDOWN);

			try {
				this.elements.wrapper.appendChild(DROPDOWN.html);
			} catch (error) {
				console.log(error);
			}
		});

		return this;
	}

	_renderPrice(event) {
		const DROPDOWN_PRICES = [];

		this.dropdowns.forEach((dropdown) => {
			const PRICE_WRAPPER = dropdown.elements.wrapper.querySelector(
				`.${env.clientPrefix}-dropdown-price`
			);

			let dropdownPrice;

			const SALE_PRICE = PRICE_WRAPPER.querySelector('.salePrice');
			const OUT_OF_STOCK = PRICE_WRAPPER.querySelector('.outOfStock');

			if (SALE_PRICE) dropdownPrice = strToNumber(SALE_PRICE.innerText);
			if (OUT_OF_STOCK) dropdownPrice = 0;
			if (dropdownPrice !== undefined) DROPDOWN_PRICES.push(dropdownPrice);
		});

		if (DROPDOWN_PRICES.length !== this.dropdowns.length) return;

		let totalPrice = DROPDOWN_PRICES.reduce((a, b) => a + b, 0);

		this.elements.wrapper.querySelector(
			`.${env.clientPrefix}-builder-price`
		).innerHTML = totalPrice > 0
			? numToCurrency(totalPrice)
			: 'Out of Stock';

		return this;
	}

	_renderTitle(color = false) {
		const TITLE = document.createElement('h4');
		TITLE.classList.add(`${env.clientPrefix}-builder-title`);

		let titleText = this.params.title;

		if (this.params.colors && this.params.colors.length > 0) {
			const ACTIVE_COLOR = color ? color : this.getActiveColor();
			titleText = titleText.replace(
				'{{COLOR}}',
				capitalize(
					typeof ACTIVE_COLOR !== 'object'
						? ACTIVE_COLOR
						: ACTIVE_COLOR.name
				)
			);
		}

		TITLE.innerText = titleText;

		return TITLE;
	}

	_getImageSrc() {
		let imageSrc;

		if (this.params.dropdowns && this.params.dropdowns.length < 2) {
			return null;
		} else {
			const COLORS = this.params.colors && this.params.colors.length > 0;

			if (COLORS) {
				const ACTIVE_COLOR = COLORS
					? this.getActiveColor()
					: this.params.image;

				imageSrc =
					typeof ACTIVE_COLOR !== 'object'
						? ACTIVE_COLOR
						: ACTIVE_COLOR.image;
			} else {
				imageSrc = this.params.image.src ? this.params.image.src : null;
			}
		}

		return imageSrc;
	}

	_renderImage(src = false) {
		const MOBILE = document.querySelector('.shipable-page')
			? document
					.querySelector('.shipable-page')
					.classList.contains('platform-phone')
			: false;
		const IMAGE_SRC = src ? src : this._getImageSrc();

		// The image element already exists, we don't need to create
		// another one, let's just update the style of the existing node.
		if (this.elements.image || !this.elements.image instanceof Node) {
			this.elements.image.style.backgroundImage = `url('${IMAGE_SRC}')`;
			return this;
		}

		const IMAGE_POSITION = this.params.image.position;
		const IMAGE_WRAPPER = document.createElement('div');
		const IMAGE = document.createElement('div');
		const TARGET = MOBILE
			? document.querySelector(
					`[data-builder-target="${this.params.target}"] .${env.clientPrefix}-builder-details`
			  )
			: document.querySelector(
					`[data-builder-target="${this.params.target}"]`
			  );
		const ATTACH_METHOD =
			MOBILE || (IMAGE_POSITION && IMAGE_POSITION === 'right')
				? 'appendChild'
				: 'prepend';

		if (IMAGE_POSITION)
			this.elements.wrapper.classList.add(
				IMAGE_POSITION === 'right' ? 'left' : 'right'
			);

		IMAGE_WRAPPER.classList.add(`${env.clientPrefix}-image-container`);
		IMAGE.classList.add(`${env.clientPrefix}-image`);

		if (IMAGE_SRC) {
			IMAGE.style.backgroundImage = `url('${IMAGE_SRC}')`;

			IMAGE_WRAPPER.appendChild(IMAGE);

			this.elements.image = IMAGE;

			TARGET[ATTACH_METHOD](IMAGE_WRAPPER);
		}

		return this;
	}

	async _events() {
		const TARGET = this.elements.wrapper;

		TARGET.addEventListener('builder.color.change', (event) => {
			const ACTIVE_COLOR = TARGET.getAttribute('data-active-color');

			if (ACTIVE_COLOR !== event.detail.color.name) {
				TARGET.setAttribute(
					'data-active-color',
					event.detail.color.name
				);

				// update title
				this.elements.wrapper
					.querySelector(`.${env.clientPrefix}-builder-title`)
					.replaceWith(this._renderTitle(event.detail.color.name));

				// update image
				if (this._isThisABundle()) {
					this.elements.image.style.backgroundImage = `url('${event.detail.color.image}')`;
				}
			}
		});

		TARGET.addEventListener('dropdown.option.change', (event) => {
			if (!this._isThisABundle()) {
				this._renderImage(event.detail.image);
			}

			this.elements.wrapper.querySelector(
				`.${env.clientPrefix}-builder-price`
			).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
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
		});

		TARGET.addEventListener('dropdown.price.update', (event) => {
			this._renderPrice(event);
		});
	}

	async _render() {
		const WRAPPER = document.querySelector(
			`[data-builder-target="${this.params.target}"]`
		);

		if (!WRAPPER || WRAPPER.innerHTML !== '') return;

		WRAPPER.classList.add(`${env.clientPrefix}-container`);

		if (this.params.backgroundColor) {
			WRAPPER.style.background = this.params.backgroundColor;
		} else {
			WRAPPER.style.background = '#FFFFFF';
		}

		const TARGET = document.createElement('div');

		if (!TARGET.classList.contains(`${env.clientPrefix}-builder-container`))
			TARGET.classList.add(`${env.clientPrefix}-builder-container`);

		WRAPPER.appendChild(TARGET);
		this.elements.wrapper = TARGET;

		const DETAILS = document.createElement('div');
		DETAILS.classList.add(`${env.clientPrefix}-builder-details`);

		const INFO = document.createElement('div');
		INFO.classList.add(`${env.clientPrefix}-builder-info`);

		const BUILDER_TITLE = this._renderTitle();

		const BUILDER_PRICE = document.createElement('h6');
		BUILDER_PRICE.classList.add(`${env.clientPrefix}-builder-price`);

		const BUILDER_CAPTION = document.createElement('p');
		BUILDER_CAPTION.classList.add(`${env.clientPrefix}-builder-caption`);
		BUILDER_CAPTION.innerText = this.params.caption;

		INFO.appendChild(BUILDER_TITLE);
		INFO.appendChild(BUILDER_PRICE);

		DETAILS.appendChild(INFO);

		TARGET.appendChild(DETAILS);
		TARGET.appendChild(BUILDER_CAPTION);

		if (!isObjectEmpty(this.params.colors)) {
			this.params.colors.forEach((color) => {
				color.active &&
					TARGET.setAttribute('data-active-color', color.name);
			});

			this._renderColorPicker();
		}

		if (this.params.dropdowns.length) {
			await this._renderDropdowns();
		}

		if (this.params.image) {
			this._renderImage();
		}

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
