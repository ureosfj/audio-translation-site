// let serverURL = 'http://localhost:3000/'
// let serverURL = 'https://audiobridge.work.gd:3000/'
let serverURL = 'http://localhost:3001/'
var fileToUpload = null;
const languagesAvailable = [
    "Bulgarian",
    "Czech",
    "Danish",
    "German",
    "Greek",
    "English (UK)",
    "English (USA)",
    "Spanish",
    "Estonian",
    "Finnish",
    "French",
    "Hungarian",
    "Indonesian",
    "Italian",
    "Japanese",
    "Korean",
    "Lithuanian",
    "Latvian",
    "Norwegian",
    "Dutch",
    "Polish",
    "Portuguese (Brazilian)",
    "Portuguese",
    "Romanian",
    "Russian",
    "Slovak",
    "Slovenian",
    "Swedish",
    "Turkish",
    "Ukrainian",
    "Chinese (simplified)"
];
document.getElementById('fileUpload').addEventListener('change', handleAudioUpload);
document.getElementById('uploadBtn').addEventListener('click', function () {
    uploadAudioFile(fileToUpload);
});






//FILEUPLOADING

function handleAudioUpload(event) {
    const audioFile = event.target.files[0];
    if (!audioFile) {
        alert('No file selected!');
        return;
    }
    fileToUpload = audioFile;
}
function uploadAudioFile(file) {
    if (!file) {
        alert('No file to upload');
        return;
    }
    toggleShowResult(false)
    showLoadingSpinner()
    setTimeout(() => {
        hideLoadingSpinner()
    }, 30*1000);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('langSource', document.getElementById('langSourceSel').value);
    formData.append('langDest', document.getElementById('langDestSel').value);
    fetch(serverURL + 'upload', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.blob())
        .then(blob => {
            const audioUrl = URL.createObjectURL(blob);
            document.getElementById('resultAudioPlayer').src = audioUrl;
            const downloadLink = document.getElementById('downloadLink')
            downloadLink.href = audioUrl;
            downloadLink.download = 'VoiceBridge-' + Date.now() + '.mp3';

            toggleShowResult(true)
            hideLoadingSpinner()
        })
        .catch(error => 
            {
                console.error('Error fetching audio:', error)
                hideLoadingSpinner()
                alert('Error. Try later')
            
            }
        );
}
function populateLanguageSelects() {
    var langSourceSelect = document.getElementById('langSourceSel');
    var langDestSelect = document.getElementById('langDestSel');

    languagesAvailable.forEach(function (language) {
        var optionSource = document.createElement('option');
        optionSource.value = language;
        optionSource.textContent = language;
        langSourceSelect.appendChild(optionSource);

        var optionDest = document.createElement('option');
        optionDest.value = language;
        optionDest.textContent = language;
        langDestSelect.appendChild(optionDest);
    });
    langSourceSelect.value = 'Italian';
    langDestSelect.value = ''
}

// 
populateLanguageSelects();
$(document).ready(function () {
    $('#langDestSel').select2();
});
$(document).ready(function () {
    $('#langSourceSel').select2();
});

function toggleShowResult(show) {
    var x = document.getElementById('translatedAudio');
    if (show) {
        x.style.display = 'block'; // or 'inline', 'inline-block', etc., depending on what you need
    } else {
        x.style.display = 'none';
    }
}


// AUDIORECORDING
let mediaRecorder;
let audioChunks = []; // Ensure this is declared in the global scope

document.getElementById("recordButton").addEventListener("click", function (event) {
    event.preventDefault();
    startRecording();
});

document.getElementById("stopButton").addEventListener("click", function (event) {
    event.preventDefault();
    stopRecording();
});

let mediaStream
function startRecording() {
    console.log("Attempting to record...");
    audioChunks = []; // Reset the array each time recording starts

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaStream = stream
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
                console.log("Audio chunk received");
            };
            mediaRecorder.start();

            console.log("Recording started");
            document.getElementById("recordButton").disabled = true;
            document.getElementById("stopButton").disabled = false;
        })
        .catch(error => {
            console.error("Error accessing the microphone", error);
        });
}

function stopRecording() {
    mediaRecorder.stop();
    stopMediaStream(mediaStream)
    console.log("Recording stopped");
    document.getElementById("recordButton").disabled = false;
    document.getElementById("stopButton").disabled = true;
    mediaRecorder.onstop = () => {
        fileToUpload = new Blob(audioChunks, { type: 'audio/wav' });


    };
}

// Assuming 'mediaStream' is your stream variable
function stopMediaStream(mediaStream) {
    mediaStream.getTracks().forEach(track => {
        track.stop();
    });
}



// SHOW / HIDE SPINNER
// Function to show the loading spinner
function showLoadingSpinner() {
    const spinnerContainer = document.getElementById('loading-spinner-container');
    spinnerContainer.style.display = 'block';
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
    const spinnerContainer = document.getElementById('loading-spinner-container');
    spinnerContainer.style.display = 'none';
}


function showSubmitButton() {
    document.getElementById('uploadSection').style.display = 'block'
}