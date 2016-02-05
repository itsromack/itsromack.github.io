/**
 * Tagatukoy ng Sinalita
 *
 * @sumulat Romack L. Natividad <romacknatividad@gmail.com>
 * @petsa Ika-anim ng Pebrero, taong 2016
 */
function Tagatukoy(language, transcriptionId, startId, stopId, clearId) {
	this.speechLanguage = language;
	this.transcriptionHTMLID = transcriptionId;
	this.startButtonHTMLID = startId;
	this.stopButtonHTMLID = stopId;
	this.clearButtonHTMLID = clearId;

	this.transcriptionText = document.getElementById(this.transcriptionHTMLID);
	this.startButton = document.getElementById(this.startButtonHTMLID);
	this.stopButton = document.getElementById(this.stopButtonHTMLID);
	this.clearButton = document.getElementById(this.clearButtonHTMLID);

	self = this;
	this.initialize = function() {
		window.SpeechRecognizer = window.SpeechRecognition ||
								window.webkitSpeechRecognition ||
								null;

		if (window.SpeechRecognizer === null) {
			self.transcriptionText.setAttribute('disabled', 'disabled');
			self.startButton.setAttribute('disabled', 'disabled');
			self.stopButton.setAttribute('disabled', 'disabled');
			self.clearButton.setAttribute('disabled', 'disabled');
		} else {
			self.recognizer = new window.SpeechRecognizer();
			self.recognizer.continuous = true;
			self.recognizer.interimResults = true;

			self.startButton.addEventListener('click', self.startSpeechRecognition);
			self.stopButton.addEventListener('click', self.stopSpeechRecognition);
			self.clearButton.addEventListener('click', self.clearTranscriptionText);

			self.recognizer.onstart = function() {
				console.log('started speech recognition');
			};

			self.recognizer.onresult = function(event) {
				self.transcriptionText.innerHTML = '';
				document.getElementById('pansamantala').value = '';
				for (var i = event.resultIndex; i < event.results.length; i++) {
					if (event.results[i].isFinal) {
						self.insertTranscription(event.results[i][0].transcript);
						console.log('Confidence: ' + event.results[i][0].confidence);
					} else {
						document.getElementById('pansamantala').value += event.results[i][0].transcript;
					}
				}
			};

			self.recognizer.onerror = function(error) {
				console.log('an error occured');
				console.log(error);
			};

			self.onend = function() {
				console.log('speech recognition ends');
			};
		}
	};

	this.startSpeechRecognition = function () {
		self.recognizer.start();
	};

	this.stopSpeechRecognition = function () {
		self.recognizer.stop();
	};

	this.clearTranscriptionText = function () {
		self.transcriptionText.innerHTML = '';
	};

	this.insertTranscription = function(transcription) {
		var start = self.transcriptionText.selectionStart;
		var end = self.transcriptionText.selectionEnd;
		var text = self.transcriptionText.value;
		var before = text.substring(0, start);
		var after  = text.substring(end, text.length);
		self.transcriptionText.value = (before + transcription + after);
		self.transcriptionText.selectionStart = self.transcriptionText.selectionEnd = start + transcription.length;
		self.transcriptionText.focus();
	};

}
