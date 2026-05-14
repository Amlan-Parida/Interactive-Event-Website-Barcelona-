function initInteractions() {
    const nextBtn = document.getElementById('next-btn');
    const paperContainer = document.getElementById('paper-container');
    const paper = document.getElementById('paper');
    const wishBtn = document.getElementById('wish-btn');
    const ultimateBlackScreen = document.getElementById('ultimate-black-screen');
    const finalHbd = document.getElementById('final-hbd');
    const finalLove = document.getElementById('final-love');
    const finalWishScreen = document.getElementById('final-wish-screen');
    const finalText = document.getElementById('final-text');
    const closureText = document.getElementById('closure-text');
    const holdBtn = document.getElementById('hold-btn');

    nextBtn.addEventListener('click', () => {
        document.getElementById('gallery-view').style.opacity = 0;
        nextBtn.style.opacity = 0;
        nextBtn.style.pointerEvents = 'none';
        paperContainer.style.display = 'flex';
        setTimeout(() => {
            paper.classList.add('visible');
            setTimeout(() => { paper.classList.add('open'); }, 800);
        }, 100);
    });

    let promiseShown = false;
    paper.addEventListener('click', (e) => {
        if (e.target.id === 'wish-btn') return;
        paper.classList.add('open');
        if (!promiseShown) {
            promiseShown = true;
            setTimeout(() => {
                const promise = document.querySelector('.promise-line');
                if (promise) promise.classList.add('show');
            }, 900); 
        }
    });

    wishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        paperContainer.style.transition = "opacity 1.5s ease";
        paperContainer.style.opacity = 0;
        finalWishScreen.style.display = 'flex';
        
        setTimeout(() => {
            paperContainer.style.display = 'none';
            finalWishScreen.style.opacity = 1;
            setTimeout(() => {
                finalText.style.opacity = 1;
            }, 500);
        }, 1500);

        setTimeout(() => {
            finalText.style.opacity = 0;
            setTimeout(() => {
                finalText.innerHTML = "A LEGACY WRITTEN IN<br><span style='color:#edbb00'>BLAUGRANA GOLD.</span> 🏆";
                finalText.style.opacity = 1;
                setTimeout(() => {
                    closureText.style.opacity = 1;
                    holdBtn.style.opacity = 1;
                    holdBtn.style.pointerEvents = 'auto';
                }, 3500);
            }, 2000); 
        }, 6000); 
    });

    holdBtn.addEventListener('click', () => {
        ultimateBlackScreen.style.display = 'flex';
        requestAnimationFrame(() => {
            ultimateBlackScreen.style.opacity = 1;
            ultimateBlackScreen.style.pointerEvents = 'auto';
        });
        setTimeout(() => {
            finalHbd.style.opacity = 1;
            finalLove.style.opacity = 1;
            const logo = document.getElementById('fcb-logo');
            logo.style.opacity = 1;
            logo.style.transform = 'scale(1)';
        }, 2000);
    });

    let lastRippleTime = 0;
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-glow';
        ripple.style.left = x + 'px'; ripple.style.top = y + 'px';
        ultimateBlackScreen.appendChild(ripple);
        setTimeout(() => ripple.remove(), 2000);
    }

    document.addEventListener('mousemove', (e) => {
        if (ultimateBlackScreen.style.opacity === '1') {
            const now = Date.now();
            if (now - lastRippleTime > 40) { createRipple(e.clientX, e.clientY); lastRippleTime = now; }
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (ultimateBlackScreen.style.opacity === '1') {
            const touch = e.touches[0];
            const now = Date.now();
            if (now - lastRippleTime > 40) { createRipple(touch.clientX, touch.clientY); lastRippleTime = now; }
        }
    }, { passive: true });
}
