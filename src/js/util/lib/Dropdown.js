'use strict';

import env from '../../../../env';
import {
	isObjectEmpty,
	uniqueObjectValues,
	serializeObject,
} from '../helpers/object';
import {numToCurrency} from '../helpers/number';
import {capitalize} from '../helpers/string';
import {getCookie} from '../helpers/cookies';

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
