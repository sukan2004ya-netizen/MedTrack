document.addEventListener("DOMContentLoaded", function () {

    // ===== ELEMENT REFERENCES =====
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const loginPage = document.getElementById("loginPage");
    const navbar = document.getElementById("navbar");
    const logoutBtn = document.getElementById("logoutBtn");
    const userText = document.getElementById("userText");

    const feedbackText = document.getElementById("feedbackText");
    const feedbackList = document.getElementById("feedbackList");

    const popupMessage = document.getElementById("popupMessage");
    const reminderPopup = document.getElementById("reminderPopup");
    const alertSound = document.getElementById("alertSound");

    // ===== LOGIN SYSTEM =====
    window.login = function () {
        let user = username.value;
        let pass = password.value;

        if (!user || !pass) {
            alert("Please fill all fields");
            return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", user);
        loadApp();
    }

    function loadApp() {
        loginPage.style.display = "none";
        navbar.style.display = "block";
        logoutBtn.style.display = "block";
        showPage("homePage");
        userText.innerText = "Hello, " + localStorage.getItem("username") + " 👋";
    }

    window.logout = function () {
        localStorage.clear();
        location.reload();
    }

    window.showPage = function (id) {
        document.querySelectorAll("section").forEach(s => s.style.display = "none");
        document.getElementById(id).style.display = "block";

        if (id === "servicesPage") loadMedicines();
        if (id === "feedbackPage") loadFeedback();
    }

    // ===== FEEDBACK SYSTEM =====
    window.addFeedback = function () {

        if (!feedbackText.value) {
            alert("Write feedback first");
            return;
        }

        let fb = JSON.parse(localStorage.getItem("feedback")) || [];
        fb.push(feedbackText.value);

        localStorage.setItem("feedback", JSON.stringify(fb));
        feedbackText.value = "";
        loadFeedback();
    }

    function loadFeedback() {
        feedbackList.innerHTML = "";
        let fb = JSON.parse(localStorage.getItem("feedback")) || [];

        fb.forEach(f => {
            feedbackList.innerHTML += `<p>⭐ ${f}</p><hr>`;
        });
    }

    // ===== MEDICINE SYSTEM =====
    window.saveMedicine = function () {

        let name = document.getElementById("medName").value;
        let dose = document.getElementById("medDose").value;
        let time = document.getElementById("medTime").value;

        if (!name || !dose || !time) {
            alert("Please fill all fields");
            return;
        }

        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
        medicines.push({ name, dose, time });

        localStorage.setItem("medicines", JSON.stringify(medicines));
        loadMedicines();
        alert("Medicine added successfully!");
    }

    function loadMedicines() {
        let list = document.getElementById("medicineList");
        if (!list) return;

        list.innerHTML = "";
        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

        medicines.forEach((m, i) => {
            list.innerHTML += `
                <div class="medItem">
                    <p><b>${m.name}</b> – ${m.dose} at ${m.time}</p>
                    <button onclick="deleteMedicine(${i})">Delete</button>
                </div>
            `;
        });
    }

    window.deleteMedicine = function (index) {
        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
        medicines.splice(index, 1);
        localStorage.setItem("medicines", JSON.stringify(medicines));
        loadMedicines();
    }

    // ===== REMINDER SYSTEM =====
    setInterval(() => {

        let now = new Date().toTimeString().slice(0, 5);
        let meds = JSON.parse(localStorage.getItem("medicines")) || [];

        meds.forEach(m => {

            if (m.time === now) {

                let message = "Time to take " + m.name + " tablet";

                popupMessage.innerText = message;
                reminderPopup.style.display = "flex";

                alertSound.currentTime = 0;
                alertSound.play().catch(() => {});

                if ("speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    let speech = new SpeechSynthesisUtterance(message);
                    speech.lang = "en-US";
                    speech.rate = 0.9;
                    window.speechSynthesis.speak(speech);
                }
            }
        });

    }, 60000);

    // ===== CLOSE POPUP (OK BUTTON) =====
    window.closePopup = function () {
        reminderPopup.style.display = "none";
        alertSound.pause();
        alertSound.currentTime = 0;
        window.speechSynthesis.cancel();
    }

    // ===== AUTO LOGIN =====
    if (localStorage.getItem("loggedIn") === "true") {
        loadApp();
    } else {
        loginPage.style.display = "block";
    }

});s