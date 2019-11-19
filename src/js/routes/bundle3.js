'use strict';

import Bundle from '../util/lib/Bundle';
import * as note10 from '../../../data/bundles/bundle-3/galaxyNote10.json';
import * as note10Plus from '../../../data/bundles/bundle-3/galaxyNote10Plus.json';
import * as s10 from '../../../data/bundles/bundle-3/galaxyS10.json';
import * as s10Plus from '../../../data/bundles/bundle-3/galaxyS10Plus.json';
import * as s10e from '../../../data/bundles/bundle-3/galaxyS10e.json';
import * as s105G from '../../../data/bundles/bundle-3/galaxyS105G.json';
import * as straps from '../../../data/bundles/bundle-3/galaxyWatchStrap.json';

export default {
	init() {
		const WATCH_STRAPS = straps.default;

		const GALAXY_NOTE_10 = note10.default;
		const GALAXY_NOTE_10_OPTIONS = {
			target: 'bundle3-note10',
			dropdowns: [
				{
					id: 'note10',
					data: GALAXY_NOTE_10,
				},
				{
					id: 'watchStraps',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_NOTE_10_BUILDER = new Bundle({
			...GALAXY_NOTE_10_OPTIONS,
		});


		const GALAXY_NOTE_10_PLUS = note10Plus.default;
		const GALAXY_NOTE_10_PLUS_OPTIONS = {
			target: 'bundle3-note10_plus',
			dropdowns: [
				{
					id: 'note10Plus',
					data: GALAXY_NOTE_10_PLUS,
				},
				{
					id: 'watchStraps',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_NOTE_10_PLUS_BUILDER = new Bundle({
			...GALAXY_NOTE_10_PLUS_OPTIONS,
		});


		const GALAXY_S_10 = s10.default;
		const GALAXY_S_10_OPTIONS = {
			target: 'bundle3-s10',
			dropdowns: [
				{
					id: 's10',
					data: GALAXY_S_10,
				},
				{
					id: 'watchStraps',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_S_10_BUILDER = new Bundle({
			...GALAXY_S_10_OPTIONS,
		});


		const GALAXY_S_10_PLUS = s10Plus.default;
		const GALAXY_S_10_PLUS_OPTIONS = {
			target: 'bundle3-s10_plus',
			dropdowns: [
				{
					id: 's10Plus',
					data: GALAXY_S_10_PLUS,
				},
				{
					id: 'watchStraps',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_S_10_PLUS_BUILDER = new Bundle({
			...GALAXY_S_10_PLUS_OPTIONS,
		});


		const GALAXY_S_10_E = s10e.default;
		const GALAXY_S_10_E_OPTIONS = {
			target: 'bundle3-s10_e',
			dropdowns: [
				{
					id: 's10E',
					data: GALAXY_S_10_E,
				},
				{
					id: 'watchStraps',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_S_10_E_BUILDER = new Bundle({
			...GALAXY_S_10_E_OPTIONS,
		});


		const GALAXY_S_10_5G = s105G.default;
		const GALAXY_S_10_5G_OPTIONS = {
			target: 'bundle3-s10_5g',
			dropdowns: [
				{
					id: 's105G',
					data: GALAXY_S_10_5G,
				},
				{
					id: 'watchStraps',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_S_10_5G_BUILDER = new Bundle({
			...GALAXY_S_10_5G_OPTIONS,
		});
	},

	finalize() {},
};
