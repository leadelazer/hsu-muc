document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards-container');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cardCount = document.querySelector('.card-count');

    let currentIndex = 0;
    let startX = null;
    let startY = null;
    let currentX = null;
    let currentY = null;
    let isMoving = false;
    let initialTransform = 0;

    function updateUI(animate = true) {
        cardsContainer.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
        cardsContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Counter aktualisieren
        cardCount.textContent = `${currentIndex + 1}/${cards.length}`;
        
        // Buttons aktivieren/deaktivieren
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cards.length - 1;
    }

    function handleGesture() {
        if (!startX || !currentX) return;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // Wenn vertikales Scrollen dominanter ist, ignorieren wir die horizontale Bewegung
        if (Math.abs(diffY) > Math.abs(diffX)) return;

        const swipeThreshold = window.innerWidth * 0.2; // 20% der Bildschirmbreite

        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diffX < 0 && currentIndex < cards.length - 1) {
                currentIndex++;
            }
        }

        updateUI();
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        currentX = startX;
        currentY = startY;
        isMoving = true;
        initialTransform = -currentIndex * 100;
        cardsContainer.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!isMoving) return;
        
        const touch = e.touches[0];
        currentX = touch.clientX;
        currentY = touch.clientY;
        
        const diffX = currentX - startX;
        const percentMove = (diffX / window.innerWidth) * 100;
        const newTransform = initialTransform + percentMove;

        // Begrenzen der Bewegung mit etwas Widerstand
        if (newTransform > 0 || newTransform < -((cards.length - 1) * 100)) {
            const resistance = 0.3;
            cardsContainer.style.transform = `translateX(${newTransform * resistance}%)`;
        } else {
            cardsContainer.style.transform = `translateX(${newTransform}%)`;
        }
    }

    function handleTouchEnd(e) {
        if (!isMoving) return;
        
        isMoving = false;
        handleGesture();
        
        // Reset der Touch-Variablen
        startX = null;
        startY = null;
        currentX = null;
        currentY = null;
    }

    // Event Listeners für Touch-Events
    cardsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    cardsContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    cardsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    cardsContainer.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Button Event Listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateUI();
        }
    });

    // Tastatur-Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateUI();
        } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
            currentIndex++;
            updateUI();
        }
    });

    // Initialisierung
    updateUI(false);
});
