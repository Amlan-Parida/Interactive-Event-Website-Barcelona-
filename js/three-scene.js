function initThreeScene(texts) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 0;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); 
    document.body.appendChild(renderer.domElement);

    const starGeo = new THREE.SphereGeometry(0.12, 4, 4); 
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const stars = [];
    for (let i = 0; i < 800; i++) {
        const s = new THREE.Mesh(starGeo, starMat);
        s.position.set((Math.random()-0.5)*150, (Math.random()-0.5)*150, -Math.random()*2000);
        stars.push(s);
        scene.add(s);
    }

    const overlay = document.getElementById("overlay");
    let ti = 0; let textFinished = false; let textEndTime = 0;

    function startTextSequence() {
        function showText() {
            if (ti >= texts.length) {
                overlay.innerHTML = ""; textFinished = true; textEndTime = performance.now(); return;
            }
            overlay.innerHTML = texts[ti++]; setTimeout(showText, 5000);
        }
        showText();
    }

    function createGoldGlow() {
        const size = 128; 
        const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        g.addColorStop(0, "rgba(237, 187, 0, 1)");
        g.addColorStop(0.3, "rgba(237, 187, 0, 0.6)"); 
        g.addColorStop(1, "rgba(237, 187, 0, 0)");      
        ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(canvas);
    }

    const starSpriteMat = new THREE.SpriteMaterial({ map: createGoldGlow(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const star = new THREE.Sprite(starSpriteMat); star.visible = false; scene.add(star);
    const hitSphere = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({ visible: false })); scene.add(hitSphere);

    const appearDuration = 15000; const startZ = -1000; const endZ = -200;      
    let clicked = false; let warpStartTime = 0; const warpDuration = 3000; 

    const flashDiv = document.getElementById("white-flash");
    const transitionText = document.getElementById("transition-text-container");
    const hintDiv = document.getElementById("hint");
    const galleryView = document.getElementById("gallery-view");
    const nextBtn = document.getElementById("next-btn");

    const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();

    window.addEventListener("pointerdown", (e) => {
        const startScreen = document.getElementById('start-screen');
        if (startScreen.style.display !== 'none' || !textFinished || clicked) return;
        
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1; 
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        if (raycaster.intersectObject(hitSphere).length > 0) { 
            clicked = true; 
            warpStartTime = performance.now(); 
            hintDiv.style.opacity = 0; 
        }
    });

    function animate(time) {
        if (renderer.domElement.style.display === 'none') return;
        requestAnimationFrame(animate);
        if (!clicked) {
            camera.position.z -= 0.2; 
            if (textFinished) {
                star.visible = true; hitSphere.visible = true;
                const elapsed = time - textEndTime; const progress = Math.min(elapsed / appearDuration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3); 
                const currentRelZ = startZ + (endZ - startZ) * easeOut;
                const currentScale = 0.1 + (7.0 - 0.1) * easeOut;
                
                star.position.set(Math.sin(time*0.001)*2, Math.cos(time*0.0008)*1.5, camera.position.z + currentRelZ);
                star.scale.set(currentScale, currentScale, 1);
                hitSphere.position.copy(star.position);
                if (elapsed > appearDuration + 1000) hintDiv.style.opacity = 1;
            }
        } else {
            const warpElapsed = time - warpStartTime; const p = Math.min(warpElapsed / warpDuration, 1);
            const ease = p * p * p; 
            camera.position.z -= (0.5 + (150 * ease)); 
            star.position.set(0, 0, camera.position.z + (-200 + (210 * ease)));
            star.scale.set(7.0 + (400 * ease), 7.0 + (400 * ease), 1);
            if (p > 0.85) flashDiv.style.opacity = (p - 0.85) * 6.6; 
            if (p >= 1) {
                flashDiv.style.opacity = 1; renderer.domElement.style.display = 'none'; 
                setTimeout(() => { flashDiv.style.opacity = 0; }, 100);
                setTimeout(() => { transitionText.style.opacity = 1; }, 2000);
                setTimeout(() => {
                    galleryView.style.opacity = 1; galleryView.style.pointerEvents = 'auto';
                    setTimeout(() => { 
                        nextBtn.style.opacity = 1; 
                        nextBtn.style.pointerEvents = 'auto'; 
                    }, 5000); 
                }, 7000);
                setTimeout(() => { transitionText.style.opacity = 0; }, 9000);
            }
        }
        stars.forEach(s => {
            s.position.z += clicked ? (0.5 + (25 * Math.pow(Math.min((time - warpStartTime) / warpDuration, 1), 3))) : 0.5;
            if (s.position.z > camera.position.z + 10) s.position.z -= 2000;
        });
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { startTextSequence };
}
