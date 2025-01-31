import { displaySeenMovies, displayWishedMovies } from "./dom.js";

// Hämta alla flikknappar och innehåll

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

export function clickTabEvents() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Ta bort active-klassen från alla flikar
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Lägg till active-klassen på den valda fliken
            button.classList.add('active');
            const tabName = button.getAttribute('data-tab');
            document.getElementById(tabName).classList.add('active');
            
            console.log(`Klickade på fliken: ${tabName}`);
            if (tabName === "popular") {
                const tabContenthide = document.getElementsByClassName('tab-content')[2];
                tabContenthide.classList.remove('active');
                window.history.pushState({}, '', `index.html#${tabName}`);
                window.location.reload();
                const tabContent = document.getElementById('seentab');
                console.log(tabContent);
                tabContent.classList.add('active');
            }
            if (tabName === "wishlist") {
                window.history.pushState({}, '', `index.html#${tabName}`);
                const tabContenshow = document.getElementsByClassName('tab-content')[1];
                tabContenshow.classList.add('active');
              
                console.log(`tabcontent: ${tabContents}`);
                const activeTab = document.getElementById("wishlist"); // Eller annan specifik tab
                console.log(activeTab)
                if (activeTab) {
                    activeTab.classList.add("active");
                }
                displayWishedMovies();
            }
            if (tabName === "seentab") {
                const tabContent = document.getElementsByClassName('tab-content')[2];
                tabContent.classList.add('active');
                window.history.pushState({}, '', `index.html#${tabName}`);
                displaySeenMovies();
            }
        });
    });
}
clickTabEvents();

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes('movieDetail.html')) {
        disableTabButtons();
    }
});

export function disableTabButtons() {
    const buttonsToDisable = document.querySelectorAll('#popular, #wishlist, #seentab');
    console.log('Hittade tab-knappar:', tabButtons);
    buttonsToDisable.forEach(button => {
        button.classList.add('disabled');
    });
}

