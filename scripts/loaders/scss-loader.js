const env = require('../../env');

module.exports = (source) => {
	const CLIENT_PREFIX = env.clientPrefix;
	const REPLACE_ME = 'CLIENT_PREFIX';
	const REPLACER = new RegExp(REPLACE_ME, 'g');

	return source.replace(REPLACER, `.${CLIENT_PREFIX}`);
};
