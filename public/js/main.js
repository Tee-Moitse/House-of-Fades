/* =========================================
   MOBILE NAVIGATION*/

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");

        menuToggle.textContent =
            navLinks.classList.contains("mobile-open") ? "×" : "☰";
    });

}


// BOOKING SYSTEM

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const serviceSelect = document.getElementById("service");
    const barberSelect = document.getElementById("barber");
    const dateInput = document.getElementById("bookingDate");
    const timeSelect = document.getElementById("bookingTime");
    const scheduleMessage = document.getElementById("scheduleMessage");

    const summaryService = document.getElementById("summaryService");
    const summaryDetails = document.getElementById("summaryDetails");
    const summaryPrice = document.getElementById("summaryPrice");

    const modal = document.getElementById("confirmationModal");
    const closeModal = document.getElementById("closeModal");
    const modalDone = document.getElementById("modalDone");

    const googleCalendar = document.getElementById("googleCalendar");
    const appleCalendar = document.getElementById("appleCalendar");

}



