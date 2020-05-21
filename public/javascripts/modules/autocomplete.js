function autocomplete(input, latInput, lngInput) {
	if (!input) return;

	let dropdown = new google.maps.places.Autocomplete(input);

	dropdown.addListener('place_changed', function () {
		const place = dropdown.getPlace();
		latInput.value = place.geometry.location.lat();
		lngInput.value = place.geometry.location.lng();
	});

	input.on('keydown', (e) => {
		if (e.keycode === 13) {
			console.log('WOAH!!!');
		}
	});
}

export default autocomplete;
