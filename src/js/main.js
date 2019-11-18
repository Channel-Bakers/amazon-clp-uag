'use strict';

import '../scss/main.scss';
import env from '../../env';
import routes from './routes/routes';
import {
	isAmazon,
	isAmazonAdvertising,
	getCurrentAmazonTab,
} from './util/helpers/amazon';

const init = () => {
	if (isAmazon()) {
		routes['common'].init();

		const PRIMARY_ROUTE = env.primaryTab;
		const CURRENT_ROUTE =
			(window.CB && window.CB.tab) || getCurrentAmazonTab();

		if (CURRENT_ROUTE) {
			routes[CURRENT_ROUTE].init();
			routes[CURRENT_ROUTE].finalize();
		} else {
			routes[PRIMARY_ROUTE].init();
			routes[PRIMARY_ROUTE].finalize();
		}

		routes['common'].finalize();
	} else {
		Object.keys(routes).forEach((route) => {
			routes[route].init();
		});
	}
};

const watchForNewNodes = (mutations, observer) => {
	mutations.forEach((mutation) => {
		if (!mutation.addedNodes) return;

		for (var i = 0; i < mutation.addedNodes.length; i++) {
			const NODE = mutation.addedNodes[i];

			if (
				NODE instanceof Node &&
				NODE.hasAttribute('id') &&
				NODE.getAttribute('id') === 'ad-landing-page-wrap'
			) {
				init();
				observer.disconnect();
			}
		}
	});
};

const TARGET_NODE = document.body;
const TABS = document.querySelectorAll('.lp-Tabs-Tab:not(.is-selected)');
const CONFIG = {childList: true, subtree: true};
const OBSERVER = new MutationObserver(watchForNewNodes);

(() => {
	TABS.forEach(tab => {
		tab.addEventListener('click', () => {
			TARGET_NODE.classList.remove(`${env.clientPrefix}-loaded`);
			TARGET_NODE.classList.remove(`${env.clientPrefix}-err`);
		});
	});

	if (isAmazon()) {
		if (!document.getElementById('ad-landing-page-wrap')) {
			OBSERVER.observe(TARGET_NODE, CONFIG);
		} else {
			init();
		}
	} else {
		if (!isAmazonAdvertising()) {
			init();
		}
	}
})();
