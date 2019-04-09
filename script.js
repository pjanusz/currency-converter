(function () {
	var key = '', //fixer.io API key
		request = new XMLHttpRequest(),
		response,
		mainInput = document.getElementById('cc-main-input'),
		selectFrom = document.getElementById('cc-select-from'),
		result = document.getElementById('cc-result'),
		selectTo = document.getElementById('cc-select-to'),
		one = document.getElementById('cc-one'),
		base = document.getElementById('cc-base'),
		loaded = document.getElementById('cc-loaded'),
		regex = /^\d{1,7}([,.]\d{0,2})?$/gm;

	request.open(
		'GET',
		`http://data.fixer.io/api/latest?access_key=${key}&symbols=GBP,USD,PLN,EUR`
	);
	request.send(null);

	request.onreadystatechange = function () {
		var done = 4;
		var ok = 200;
		if (request.readyState === done && request.status === ok) {
			response = JSON.parse(request.responseText);
			base.innerText = `Base currency: ${response.base}`;
			loaded.innerText =
				'Rates collected: \n' +
				new Date(response.timestamp * 1000).toLocaleString();
			for (var [key, value] of Object.entries(response.rates)) {
				var option = document.createElement('option');
				option.value = value;
				option.innerText = key;
				selectFrom.appendChild(option);
				var clone = option.cloneNode(true);
				selectTo.appendChild(clone);
			}
		} else if (request.status !== ok) {
			alert('Error: ' + request.status);
		}
	};

	function convert() {
		var rate = selectFrom.value;
		var target = selectTo.value;
		var resultText;
		one.innerText =
			'1 ' +
			selectFrom.options[selectFrom.selectedIndex].text +
			' = ' +
			(target / rate).toFixed(2) +
			' ' +
			selectTo.options[selectTo.selectedIndex].text;
		resultText = (mainInput.value * (target / rate)).toFixed(2);
		resultText.toString();
		result.innerText = resultText.replace('.', ',');
	}

	mainInput.addEventListener('keydown', function (e) {
		var key = e.keyCode || e.which;
		if (
			key == 109 ||
			key == 107 ||
			key == 187 ||
			key == 189 ||
			key == 69 ||
			key == 190 ||
			(this.value.split('.').length != 1 && (key == 188 || key == 108)) ||
			(this.value === '' && (key == 188 || key == 108))
		)
			e.preventDefault();
	});
	mainInput.addEventListener('input', function () {
		var input = mainInput.value.match(regex);
		mainInput.value = input;
		convert();
	});

	mainInput.addEventListener('paste', function (e) {
		e.preventDefault();
	});
	selectFrom.addEventListener('input', convert);
	selectTo.addEventListener('input', convert);
})();