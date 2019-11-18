'use strict';

import {getCookie} from '../util/helpers/cookies';
import {getCurrentAmazonTab, removeAmazonNodes} from '../util/helpers/amazon';

export default {
	init() {
		let CB = {};
		window.CB = CB;
		CB.sessionID = getCookie('session-id');
		CB.tab = getCurrentAmazonTab();

		const FALLBACK_NODES = ['.carousel-wrap'];

		FALLBACK_NODES.forEach((selector) => {
			const NODES = document.querySelectorAll(selector);
			NODES && removeAmazonNodes(NODES);
		});
	},
};
