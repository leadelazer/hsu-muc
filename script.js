document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemente
    const cardsContainer = document.querySelector('.cards-container');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cardCount = document.querySelector('.card-count');

    // Variablen für die Navigation
    let currentIndex = 0;
    const totalCards = cards.length;

    // Touch-Variablen
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;

    // Update Anzeige
    function updateUI() {
        // Button Status
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalCards - 1;
        
        // Karten-Zähler
        cardCount.textContent = `${currentIndex + 1}/${totalCards}`;
        
        // Position der Karten
        cardsContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Event Listener für Buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateUI();
        }
    });

    // Touch Events
    cardsContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        startPos = currentIndex * -100;
        
        cardsContainer.style.transition = 'none';
    }, { passive: true });

    cardsContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const diff = (currentX - touchStartX) / cardsContainer.offsetWidth * 100;
        currentTranslate = startPos + diff;

        // Begrenzen der Bewegung
        if (currentTranslate > 0) {
            currentTranslate = 0;
        } else if (currentTranslate < -((totalCards - 1) * 100)) {
            currentTranslate = -((totalCards - 1) * 100);
        }

        cardsContainer.style.transform = `translateX(${currentTranslate}%)`;
    }, { passive: true });

    cardsContainer.addEventListener('touchend', (e) => {
        isDragging = false;
        cardsContainer.style.transition = 'transform 0.3s ease-out';

        // Minimale Swipe-Distanz (in Prozent der Bildschirmbreite)
        const minSwipeDistance = 20;
        const diff = currentTranslate - startPos;

        if (Math.abs(diff) >= minSwipeDistance) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < totalCards - 1) {
                currentIndex++;
            }
        }

        updateUI();
    });

    // Tastatur-Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateUI();
        } else if (e.key === 'ArrowRight' && currentIndex < totalCards - 1) {
            currentIndex++;
            updateUI();
        }
    });

    // Initialisierung
    updateUI();
});
