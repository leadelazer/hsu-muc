document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.querySelector(".cards-container");
    const cards = document.querySelectorAll(".card");
    const visualCards = document.querySelectorAll(".card.visual"); // Select only visual cards
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const cardCount = document.querySelector(".card-count");

    let currentIndex = 0;
    let isSwiping = false;

    // **🔀 Function to Randomly Assign Images Without Repeats**
    function assignRandomImages() {
        const imgFolder = "img/";
        const totalImages = 17; // Adjust this based on the number of kawaii images available
        let availableImages = Array.from({ length: totalImages }, (_, i) => `${imgFolder}kawaii-${i + 1}.png`);

        // Shuffle images and assign one per visual card
        availableImages = availableImages.sort(() => Math.random() - 0.5).slice(0, visualCards.length);

        visualCards.forEach((card, index) => {
            card.querySelector(".card-inner").style.backgroundImage = `url(${availableImages[index]})`;
        });
    }

    function updateUI() {
        cardsContainer.style.transition = "transform 0.3s ease-out";
        cardsContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        cardCount.textContent = `${currentIndex + 1}/${cards.length}`;
    }

    function handleSwipe(direction) {
        if (direction === "left" && currentIndex < cards.length - 1) {
            currentIndex++;
        } else if (direction === "right" && currentIndex > 0) {
            currentIndex--;
        }
        updateUI();
    }

    // **✨ Hammer.js for Swiping**
    const hammer = new Hammer(cardsContainer);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on("panstart", () => {
        isSwiping = true;
        document.body.style.overflow = "hidden";
    });

    hammer.on("panend", (event) => {
        isSwiping = false;
        document.body.style.overflow = "";

        if (event.deltaX < -50) {
            handleSwipe("left");
        } else if (event.deltaX > 50) {
            handleSwipe("right");
        }
    });

    // **🎮 Button & Keyboard Navigation**
    prevBtn.addEventListener("click", () => handleSwipe("right"));
    nextBtn.addEventListener("click", () => handleSwipe("left"));

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") handleSwipe("right");
        if (event.key === "ArrowRight") handleSwipe("left");
    });

    // **🔥 Assign Images & Initialize**
    assignRandomImages();
    updateUI();
});
