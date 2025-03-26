const expand = document.querySelector('.expand');
const sideMenu = document.querySelector('.sideMenu');

expand.addEventListener('click', () => {
    sideMenu.classList.toggle('collapsed');
});

const controls = document.querySelector('.controls')
const Pause = document.querySelector('.Pause')
const btnBefore = document.querySelector('.btnBefore');
const btnForward = document.querySelector('.btnForward');
const playIcon = document.querySelector('.play-icon')
const pauseIcon = document.querySelector('.pause-icon')

function showPlayIcon() { // untuk menampilkan ikon play
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

function showPauseIcon() { // untuk menampilkan ikon pause
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

playIcon.addEventListener('click', function(){
    if (songList.length <= 0) {
        audioVisualizer();
        discMain.classList.add('turn');

        console.log("Audio diputar.");
    } else {
        controls.classList.toggle('Pause');
        if (controls.classList.contains("Pause")) {
            audio1.pause();
            discMain.classList.remove('turn');
            console.log("Audio dijeda.");
        } else {
            audio1.play();
            discMain.classList.add('turn');
            console.log("Audio diputar.");
        }
    }
    console.log(controls)
    showPauseIcon()
})

pauseIcon.addEventListener('click', function(){
    if (songList.length <= 0) {
        audioVisualizer();
        discMain.classList.add('turn');

        console.log("Audio diputar.");
    } else {
        controls.classList.toggle('Pause');
        if (controls.classList.contains("Pause")) {
            audio1.pause();
            discMain.classList.remove('turn');
            console.log("Audio dijeda.");
        } else {
            audio1.play();
            discMain.classList.add('turn');
            console.log("Audio diputar.");
        }
    }
    console.log(controls)
    showPlayIcon()
})

btnForward.addEventListener('click', () => {
    console.log(btnForward);
    audioVisualizer();
    console.log("Daftar lagu yang sudah diputar:", songList);

})

btnBefore.addEventListener('click', () => {
    console.log(btnBefore);
    if (songList.length > 1) {
        songIndex = songList[songList.length - 2];
        audioVisualizer(songIndex);
        songList.pop();
    }
    console.log(songIndex)
    console.log("Daftar lagu yang sudah diputar:", songList);
})

const header = document.getElementById('header');
const audioName = document.getElementById('audioName')
const discMain = document.querySelector('.discMain');
const discStyle = window.getComputedStyle(discMain)

let randoming;
let songIndex;
let songList = [];
const audio1 = document.getElementById('audio1');
const canvas = document.getElementById('canvas1');
const audioVsl = document.getElementById('audioVisualizer');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const container = document.getElementById('container')
const audioData = [
    { src: 'song/aespaDrama.mp3', artist: 'AESPA', title: 'Drama' },
    { src: 'song/exoMama.mp3', artist: 'EXO', title: 'MAMA' },
    { src: 'song/iconType.mp3', artist: 'iKON', title: 'Type' },
    { src: 'song/NJOMG.mp3', artist: 'NEW JEANS', title: 'OMG' },
    { src: 'song/itzyBorn.mp3', artist: 'ITZY', title: 'Born To Be' },
    { src: 'song/itzyFive.mp3', artist: 'ITZY', title: 'Five Star' },
    { src: 'song/leehihskt.mp3', artist: 'Lee Hi', title: 'HSKT' },
    { src: 'song/story.mp3', artist: 'Unknown Artist', title: 'Story' },
    { src: 'song/itzyCake.mp3', artist: 'ITZY', title: 'Cake' },
    { src: 'song/twiceWhatislove.mp3', artist: 'TWICE', title: 'What is Love?' },
    { src: 'song/yoasobiYume.mp3', artist: 'YOASOBI', title: 'Yume' },
    { src: 'song/yunkaiBlue.mp3', artist: 'Yunkai', title: 'Blue' }
];

let audioSource;
let analyser;

let shuffledIndices; // Variabel untuk menyimpan indeks yang sudah diacak


audio1.addEventListener('ended', () => {
    audioVisualizer();
})

function audioVisualizer(songIndex = null) {
    if (songList.length === audioData.length) {
        songList = [];
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (songIndex != null) {
        audio1.src = songIndex.src;
        audioName.classList.add('hidden');
        header.classList.add('hidden');
        setTimeout(() => {
            header.textContent = songIndex.artist;
            header.classList.remove('hidden')
        }, 300);
        setTimeout(() => {
            audioName.textContent = songIndex.title;
            audioName.classList.remove('hidden')
        }, 300);
        console.log("Memutar lagu:", songIndex);
    } else {
        let randoming;
        do {
            randoming = audioData[Math.floor(Math.random() * audioData.length)];
        } while (songList.includes(randoming));

        audio1.src = randoming.src;
        audioName.classList.add('hidden');
        header.classList.add('hidden');
        setTimeout(() => {
            header.textContent = randoming.artist;
            header.classList.remove('hidden')
        }, 300);
        setTimeout(() => {
            audioName.textContent = randoming.title;
            audioName.classList.remove('hidden')
        }, 300);
        songList.push(randoming);
    }


    // Tunggu hingga audio siap diputar
    audio1.play().then(() => {
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
    }).catch(error => console.log("Gagal memutar audio:", error));
}


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

const skillNavbar = document.querySelector('.skill-navbar');

skillNavbar.addEventListener('click', function() {
    // Directly call handleSectionToggle for skills
    handleSectionToggle(navigationItems.skill);

    // Remove active class from all navigation items
    Object.values(navigationItems).forEach(nav => {
        nav.navElement.classList.remove('active');
    });

    // Add active class to skill navigation item
    navigationItems.skill.navElement.classList.add('active');

    // Trigger skill animations
    web.style.animation = 'progressingWeb 1s ease forwards';
    mob.style.animation = 'progressingMob 1s ease forwards';
    video.style.animation = 'progressingVid 1s ease forwards';
    render.style.animation = 'progressing3D 1s ease forwards';
});



const items = document.querySelectorAll('.li-item'); // Ambil semua elemen <li>

items.forEach(item => {
    item.addEventListener('click', function() {
        // Hapus class 'active' dari semua item
        items.forEach(i => i.classList.remove('active'));

        // Tambahkan class 'active' ke item yang diklik
        this.classList.add('active');
    });
});

// Select all navigation items and containers
const navigationItems = {
    about: {
        navElement: document.querySelector('.about'),
        container: document.querySelector('.about-container')
    },
    education: {
        navElement: document.querySelector('.education'),
        container: document.querySelector('.status-container')
    },
    skill: {
        navElement: document.querySelector('.skill'),
        container: document.querySelector('.skills-container')
    },
    tools: {
        navElement: document.querySelector('.tools'),
        container: document.querySelector('.tools-container')
    }
};

const web = document.querySelector('.web');
const mob = document.querySelector('.mob');
const video = document.querySelector('.video');
const render = document.querySelector('.render');

const webTools = document.querySelector('.web-tools');
const mobTools = document.querySelector('.mob-tools');
const vidTools = document.querySelector('.vid-tools');
const renderTools = document.querySelector('.render-tools');


const imgAbout = document.getElementById('img-about');
const img = document.getElementById('img-about');

const src1 = 'assets/LITBANG_2_Brillian Maulana Syah.png';
const src2 = 'assets/erasebg-transformed (1).png';

// Function to hide all containers
function hideAllContainers() {
    Object.values(navigationItems).forEach(item => {
        item.container.classList.remove('visible');
        item.container.classList.add('hidden');
    });
}

// Function to reset skill animations
function resetSkillAnimations() {
    web.style.animation = '';
    mob.style.animation = '';
    video.style.animation = '';
    render.style.animation = '';
}

function resetToolsAnimations() {
    webTools.style.animation = '';
    mobTools.style.animation = '';
    vidTools.style.animation = '';
    renderTools.style.animation = '';
}

// Function to handle section toggle
function handleSectionToggle(section) {
    // Reset any previous skill animations
    resetSkillAnimations();
    resetToolsAnimations();

    // Hide all containers first
    hideAllContainers();

    // Show the selected container
    section.container.classList.remove('hidden');
    section.container.classList.add('visible');

    // Handle image changes
    if (section === navigationItems.about || section === navigationItems.education) {
        imgAbout.src = src1;
        img.classList.remove('img-transform');
        img.classList.add('img-default');
    } else if (section === navigationItems.skill) {
        // Specific handling for skill section
        imgAbout.src = src2;
        img.classList.remove('img-default');
        img.classList.add('img-transform');

        // Trigger skill animations
        web.style.animation = 'progressingWeb 1s ease forwards';
        mob.style.animation = 'progressingMob 1s ease forwards';
        video.style.animation = 'progressingVid 1s ease forwards';
        render.style.animation = 'progressing3D 1s ease forwards';
    } else if (section === navigationItems.tools) {
        imgAbout.src = src2;
        img.classList.remove('img-default');
        img.classList.add('img-transform');

        webTools.style.animation = 'toRight 1s cubic-bezier(0.34, 1.56, 0.64, 1) 1';
        mobTools.style.animation = 'toRight 1s cubic-bezier(0.34, 1.56, 0.64, 1) 200ms 1 forwards';
        vidTools.style.animation = 'toRight 1s cubic-bezier(0.34, 1.56, 0.64, 1) 1';
        renderTools.style.animation = 'toRight 1s cubic-bezier(0.34, 1.56, 0.64, 1) 200ms 1 forwards';
    }
     else {
        imgAbout.src = src2;
        img.classList.remove('img-default');
        img.classList.add('img-transform');
    }
}

// Add click event listeners to all navigation items
Object.values(navigationItems).forEach(section => {
    section.navElement.addEventListener('click', () => handleSectionToggle(section));
});


const otherName = document.querySelector('.otherName');

otherName.addEventListener('click', function() {
    otherName.classList.add('hidden')
    if (otherName.classList.contains('korean')){
        setTimeout(() => {
            otherName.textContent = '(백리안)'
            otherName.classList.remove('korean')
            otherName.classList.remove('hidden')
        }, 500)
    } else {
        setTimeout(() => {
            otherName.textContent = '(マウラナ・シャー・ブリリアン)'
            otherName.classList.add('korean')
            otherName.classList.remove('hidden')
        }, 500)
    }
})