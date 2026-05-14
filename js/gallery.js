function buildGallery(images) {
    const columns = [
        document.getElementById('col-1'), 
        document.getElementById('col-2'), 
        document.getElementById('col-3'), 
        document.getElementById('col-4'), 
        document.getElementById('col-5')
    ];
    
    const chunks = [[], [], [], [], []];
    images.forEach((img, index) => chunks[index % 5].push(img));

    function buildTrack(imgArray, colElement, speedClass, dirClass) {
        const track = document.createElement('div');
        track.className = `col-track ${speedClass} ${dirClass}`;
        const fullArray = [...imgArray, ...imgArray]; 
        fullArray.forEach(src => {
            const img = document.createElement('img');
            img.src = src; img.className = 'photo-item';
            track.appendChild(img);
        });
        colElement.appendChild(track);
    }

    columns.forEach(col => col.innerHTML = ''); 
    buildTrack(chunks[0], columns[0], 'speed-1', 'dir-up');      
    buildTrack(chunks[1], columns[1], 'speed-2', 'dir-down'); 
    buildTrack(chunks[2], columns[2], 'speed-3', 'dir-up');      
    buildTrack(chunks[3], columns[3], 'speed-4', 'dir-down'); 
    buildTrack(chunks[4], columns[4], 'speed-5', 'dir-up');
}
