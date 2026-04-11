document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Mouse Glow Effect for Hero/Body
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // --- Memory Game Logic ---
    const icons = ['♥️', '✨', '🌱', '🤝', '🏢', '⏱️', '👥', '💼'];
    let cardsArray = [...icons, ...icons];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;

    const gameBoard = document.getElementById('game-board');
    const msgElement = document.getElementById('game-msg');
    const restartBtn = document.getElementById('restart-game');

    function createBoard() {
        if (!gameBoard) return;
        gameBoard.innerHTML = '';
        if (msgElement) msgElement.textContent = '';
        matchedPairs = 0;
        
        cardsArray.sort(() => 0.5 - Math.random());

        cardsArray.forEach((icon) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.icon = icon;

            cardElement.innerHTML = `
                <div class="card-face card-front">${icon}</div>
                <div class="card-face card-back">♥️</div>
            `;
            
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        
        if(matchedPairs === icons.length) {
            setTimeout(() => {
                if (msgElement) msgElement.textContent = 'クリア！おめでとうございます🎉';
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', createBoard);
    }

    createBoard();
});
