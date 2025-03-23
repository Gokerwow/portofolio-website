const expand = document.querySelector('.expand');
const sideMenu = document.querySelector('.sideMenu');

expand.addEventListener('click', () => {
    sideMenu.classList.toggle('collapsed');
});

const canvas = document.getElementById('canvas1');
const audioVsl = document.getElementById('audioVisualizer');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const container = document.getElementById('container')
const audioData = ['song/aespaDrama.mp3', 'song/exoMama.mp3', 'song/iconType.mp3', 'song/itsyWannabe.mp3', 'song/itzyBorn.mp3', 'song/itzyFive.mp3', 'song/leehihskt.mp3', 'song/story.mp3', 'song/itzyCake.mp3', 'song/twiceWhatislove.mp3', 'song/yoasobiYume.mp3', 'song/yunkaiBlue.mp3']
let audioSource;
let analyser;

let shuffledIndices; // Variabel untuk menyimpan indeks yang sudah diacak

container.addEventListener('click', function () {
    const audio1 = document.getElementById('audio1');
    audio1.src = audioData[Math.floor(Math.random() * audioData.length)];
    const audioContext = new AudioContext();
    audio1.play();

    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Mengacak indeks sekali di awal
    shuffledIndices = shuffleArray([...Array(bufferLength).keys()]);

    const barWidth = (canvas.width / 2) / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
});

// Menggambar visualizer dengan posisi bar yang sudah diacak
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        const index = shuffledIndices[i]; // Menggunakan indeks yang sudah diacak
        barHeight = dataArray[index] * 2;
        ctx.fillStyle = '#04121F';
        ctx.fillRect(canvas.width / 2.13 - x, canvas.height - barHeight / 1.3, barWidth * 2, barHeight);
        x += barWidth;
    }

    for (let i = 0; i < bufferLength; i++) {
        const index = shuffledIndices[i]; // Menggunakan indeks yang sudah diacak
        barHeight = dataArray[index] * 2;
        ctx.fillStyle = '#04121F';
        ctx.fillRect(x, canvas.height - barHeight / 1.3, barWidth * 2, barHeight);
        x += barWidth;
    }
}

// Fungsi untuk mengacak array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}