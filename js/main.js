const startScreen = document.getElementById('start-screen');
const audio = document.getElementById('bg-music');

const { startTextSequence } = initThreeScene(data.texts);

buildGallery(data.images);
initInteractions();

startScreen.addEventListener('click', () => {
    audio.volume = 0.5; 
    audio.play().catch(error => console.log(error));
    startScreen.style.opacity = 0;
    setTimeout(() => { startScreen.style.display = 'none'; }, 1000);
    setTimeout(startTextSequence, 3400); 
});
