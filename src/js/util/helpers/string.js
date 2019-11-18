'use strict';

const capitalize = (s) => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

const strToNumber = (val) => Number(0 + ('' + val).replace(/[^\d\.]/g, ''));

export {capitalize, strToNumber};
