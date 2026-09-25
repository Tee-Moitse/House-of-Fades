/* 
   HOUSE OF FADES - MAIN JAVASCRIPT*/


/* 
   MOBILE NAVIGATION
*/

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("mobile-open");

        menuToggle.textContent =
            navLinks.classList.contains("mobile-open")
                ? "×"
                : "☰";

    });

}


/* 
   BOOKING SYSTEM
 */

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

    const modal =
        document.getElementById("confirmationModal");

    const closeModal =
        document.getElementById("closeModal");

    const modalDone =
        document.getElementById("modalDone");

    const googleCalendar =
        document.getElementById("googleCalendar");

    const appleCalendar =
        document.getElementById("appleCalendar");


    /* =========================================
       DATE
    ========================================= */

    const today = new Date();

    const localToday =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

    dateInput.min = localToday;


    /* =========================================
       SHOP HOURS
    ========================================= */

    const shopHours = {

        weekday: {
            open: "09:00",
            close: "18:00"
        },

        saturday: {
            open: "08:00",
            close: "16:00"
        }

    };


    /* =========================================
       GET SHOP HOURS
    ========================================= */

    function getShopHours(dateString) {

        const date =
            new Date(dateString + "T12:00:00");

        const day =
            date.getDay();

        // Sunday
        if (day === 0) {
            return null;
        }

        // Saturday
        if (day === 6) {
            return shopHours.saturday;
        }

        // Monday-Friday
        return shopHours.weekday;
    }


    /* =========================================
       FORMAT TIME
    ========================================= */

    function formatTime(time) {

        const [hour, minute] =
            time.split(":").map(Number);

        const suffix =
            hour >= 12 ? "PM" : "AM";

        let displayHour =
            hour % 12;

        if (displayHour === 0) {
            displayHour = 12;
        }

        return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
    }


    /* =========================================
       FORMAT DATE
    ========================================= */

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(dateString + "T12:00:00");

        return date.toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }


    /* =========================================
       GENERATE TIMES
    ========================================= */

    function updateTimeOptions() {

        const selectedDate =
            dateInput.value;

        const selectedService =
            serviceSelect.value;

        timeSelect.innerHTML = "";

        if (!selectedService && !selectedDate) {

            timeSelect.innerHTML =
                '<option value="">Select a service and date</option>';

            scheduleMessage.textContent = "";

            return;
        }

        if (!selectedService) {

            timeSelect.innerHTML =
                '<option value="">Select a service first</option>';

            scheduleMessage.textContent = "";

            return;
        }

        if (!selectedDate) {

            timeSelect.innerHTML =
                '<option value="">Select a date first</option>';

            scheduleMessage.textContent = "";

            return;
        }


        const selectedOption =
            serviceSelect.options[
                serviceSelect.selectedIndex
            ];

        const duration =
            parseInt(
                selectedOption.dataset.duration,
                10
            );


        const hours =
            getShopHours(selectedDate);


        if (!hours) {

            timeSelect.innerHTML =
                '<option value="">Shop is closed</option>';

            scheduleMessage.textContent =
                "We're closed on Sundays. Please choose another date.";

            return;
        }


        const [openHour, openMinute] =
            hours.open.split(":").map(Number);

        const [closeHour, closeMinute] =
            hours.close.split(":").map(Number);


        const openingMinutes =
            openHour * 60 + openMinute;

        const closingMinutes =
            closeHour * 60 + closeMinute;


        let timesAdded = 0;


        for (
            let minutes = openingMinutes;
            minutes + duration <= closingMinutes;
            minutes += 30
        ) {

            const hour =
                Math.floor(minutes / 60);

            const minute =
                minutes % 60;

            const time =
                String(hour).padStart(2, "0") +
                ":" +
                String(minute).padStart(2, "0");


            const option =
                document.createElement("option");

            option.value = time;

            option.textContent =
                formatTime(time);

            timeSelect.appendChild(option);

            timesAdded++;
        }


        if (timesAdded > 0) {

            scheduleMessage.textContent =
                `Available times: ${formatTime(hours.open)} – ${formatTime(hours.close)}.`;

        } else {

            timeSelect.innerHTML =
                '<option value="">No times available</option>';

            scheduleMessage.textContent =
                "No appointment times are available.";
        }

        updateSummary();
    }


    /* =========================================
       UPDATE SUMMARY
    ========================================= */

    function updateSummary() {

        const service =
            serviceSelect.value;

        const barber =
            barberSelect.value;

        const date =
            dateInput.value;

        const time =
            timeSelect.value;


        const selectedOption =
            serviceSelect.options[
                serviceSelect.selectedIndex
            ];


        const price =
            selectedOption?.dataset.price || 0;


        if (service) {

            summaryService.textContent =
                service;

            summaryPrice.textContent =
                `R${price}`;

        } else {

            summaryService.textContent =
                "Select a service";

            summaryPrice.textContent =
                "R0";
        }


        const details = [];


        if (barber) {
            details.push(barber);
        }

        if (date) {
            details.push(formatDate(date));
        }

        if (time) {
            details.push(formatTime(time));
        }


        summaryDetails.textContent =
            details.length
                ? details.join(" • ")
                : "Your appointment details will appear here.";
    }


    /* =========================================
       FORM EVENTS
    ========================================= */

    serviceSelect.addEventListener(
        "change",
        () => {
            updateTimeOptions();
            updateSummary();
        }
    );


    barberSelect.addEventListener(
        "change",
        updateSummary
    );


    dateInput.addEventListener(
        "change",
        () => {
            updateTimeOptions();
            updateSummary();
        }
    );


    timeSelect.addEventListener(
        "change",
        updateSummary
    );


    /* =========================================
       GOOGLE CALENDAR
    ========================================= */

    function createGoogleCalendarLink(booking) {

        const startDate =
            new Date(
                `${booking.date}T${booking.time}:00+02:00`
            );


        const endDate =
            new Date(
                startDate.getTime() +
                booking.duration * 60 * 1000
            );


        const googleDate =
            date =>
                date.toISOString()
                    .replace(/[-:]/g, "")
                    .replace(/\.\d{3}/, "");


        const start =
            googleDate(startDate);

        const end =
            googleDate(endDate);


        const title =
            `House of Fades — ${booking.service}`;


        const details =
            `Barber: ${booking.barber}\n` +
            `Customer: ${booking.name}\n` +
            `Phone: ${booking.phone}\n` +
            `Email: ${booking.email}`;


        const location =
            "24 Long Street, City Centre, South Africa";


        return (
            "https://calendar.google.com/calendar/render" +
            "?action=TEMPLATE" +
            `&text=${encodeURIComponent(title)}` +
            `&dates=${start}/${end}` +
            `&details=${encodeURIComponent(details)}` +
            `&location=${encodeURIComponent(location)}`
        );
    }


    /* =========================================
       APPLE / OTHER CALENDAR
    ========================================= */

    function createICSFile(booking) {

        const startDate =
            new Date(
                `${booking.date}T${booking.time}:00+02:00`
            );


        const endDate =
            new Date(
                startDate.getTime() +
                booking.duration * 60 * 1000
            );


        const formatICSDate =
            date =>
                date.toISOString()
                    .replace(/[-:]/g, "")
                    .replace(/\.\d{3}/, "");


        const start =
            formatICSDate(startDate);

        const end =
            formatICSDate(endDate);

        const now =
            formatICSDate(new Date());


        const uid =
            `house-of-fades-${Date.now()}@houseoffades.co.za`;


        const location =
            "24 Long Street, City Centre, South Africa";


        const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//House of Fades//Booking//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:House of Fades — ${booking.service}
DESCRIPTION:Barber: ${booking.barber}\\nCustomer: ${booking.name}\\nPhone: ${booking.phone}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;


        const blob =
            new Blob(
                [ics],
                {
                    type: "text/calendar;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "house-of-fades-appointment.ics";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }


    /* =========================================
       SUBMIT BOOKING
    ========================================= */

    bookingForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const selectedOption =
                serviceSelect.options[
                    serviceSelect.selectedIndex
                ];


            const booking = {

                service:
                    serviceSelect.value,

                barber:
                    barberSelect.value,

                date:
                    dateInput.value,

                time:
                    timeSelect.value,

                name:
                    document
                        .getElementById("customerName")
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById("customerPhone")
                        .value
                        .trim(),

                email:
                    document
                        .getElementById("customerEmail")
                        .value
                        .trim(),

                notes:
                    document
                        .getElementById("notes")
                        .value
                        .trim(),

                duration:
                    parseInt(
                        selectedOption.dataset.duration,
                        10
                    ),

                price:
                    selectedOption.dataset.price
            };


            /* Save booking locally */

            localStorage.setItem(
                "houseOfFadesBooking",
                JSON.stringify(booking)
            );


            /* Confirmation details */

            document.getElementById(
                "confirmService"
            ).textContent =
                booking.service;


            document.getElementById(
                "confirmBarber"
            ).textContent =
                booking.barber;


            document.getElementById(
                "confirmDateTime"
            ).textContent =
                `${formatDate(booking.date)} at ${formatTime(booking.time)}`;


            document.getElementById(
                "confirmPrice"
            ).textContent =
                `R${booking.price}`;


            /* Calendar buttons */

            googleCalendar.href =
                createGoogleCalendarLink(booking);


            appleCalendar.onclick =
                () => createICSFile(booking);


            /* Show confirmation */

            modal.classList.add("show");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

        }
    );


    /* =========================================
       CLOSE MODAL
    ========================================= */

    function hideModal() {

        modal.classList.remove("show");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    closeModal.addEventListener(
        "click",
        hideModal
    );


    modalDone.addEventListener(
        "click",
        hideModal
    );


    document
        .querySelector(".modal-overlay")
        .addEventListener(
            "click",
            hideModal
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {
                hideModal();
            }

        }
    );

}