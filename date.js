//jshint esversion:8
function getDate() {
	const today = new Date();
	const currentDay = today.getDay();

	const options = {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	};

	return today.toLocaleDateString('en-us', options);
}

module.exports = getDate;
