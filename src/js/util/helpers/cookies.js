const getCookie = (name) => {
	const match = document.cookie.match(
		new RegExp('(^| )' + name + '=([^;]+)')
	);

	if (match) {
		return match[2];
	} else {
		return undefined;
	}
};

export {getCookie};
