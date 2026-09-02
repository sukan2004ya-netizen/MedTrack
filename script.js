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

    // ===== COMMON MEDICINES DATA =====
    const commonMeds = [
        { name: "Paracetamol", dose: "500 mg", defaultTime: "08:00" },
        { name: "Ibuprofen", dose: "400 mg", defaultTime: "13:00" },
        { name: "Amoxicillin", dose: "250 mg", defaultTime: "18:00" },
        { name: "Cetirizine", dose: "10 mg", defaultTime: "21:00" },
        { name: "Vitamin D3", dose: "1000 IU", defaultTime: "09:00" }
    ];

    function loadCommonMedicines() {
        const commonList = document.getElementById("commonMedicineList");
        if (!commonList) return;

        commonList.innerHTML = "";
        commonMeds.forEach((med, index) => {
            const item = document.createElement("div");
            item.className = "commonMedItem";
            item.innerHTML = `
                <h3>${med.name}</h3>
                <p>Dosage: ${med.dose}</p>
                <input type="time" id="commonTime_${index}" value="${med.defaultTime}">
                <button onclick="addCommonMedicine('${med.name}', '${med.dose}', ${index})">Add Reminder</button>
            `;
            commonList.appendChild(item);
        });
    }

    window.addCommonMedicine = function (name, dose, index) {
        const timeInput = document.getElementById(`commonTime_${index}`);
        const time = timeInput ? timeInput.value : "08:00";
        if (!time) {
            alert("Please choose a time");
            return;
        }

        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
        medicines.push({ name, dose, time });
        localStorage.setItem("medicines", JSON.stringify(medicines));
        loadMedicines();
        alert(`${name} reminder added for ${time}!`);
    };

    // ===== LOGIN SYSTEM =====
    window.login = function () {
        let user = username.value.trim();
        let pass = password.value.trim();

        if (!user || !pass) {
            alert("Please fill all fields");
            return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", user);
        loadApp();
    };

    function loadApp() {
        loginPage.style.display = "none";
        navbar.style.display = "block";
        logoutBtn.style.display = "block";
        showPage("homePage");
        const currentName = localStorage.getItem("username") || "User";
        userText.innerText = "Hello, " + currentName + " 👋";
    }

    window.logout = function () {
        localStorage.clear();
        location.reload();
    };

    window.showPage = function (id) {
        document.querySelectorAll("section").forEach(s => s.style.display = "none");
        const target = document.getElementById(id);
        if (target) {
            target.style.display = "block";
        }

        if (id === "servicesPage") {
            loadCommonMedicines();
            loadMedicines();
        }
        if (id === "feedbackPage") {
            loadFeedback();
        }
    };

    // ===== FEEDBACK SYSTEM =====
    window.addFeedback = function () {
        if (!feedbackText.value.trim()) {
            alert("Write feedback first");
            return;
        }

        let fb = JSON.parse(localStorage.getItem("feedback")) || [];
        fb.push(feedbackText.value.trim());

        localStorage.setItem("feedback", JSON.stringify(fb));
        feedbackText.value = "";
        loadFeedback();
    };

    function loadFeedback() {
        if (!feedbackList) return;
        feedbackList.innerHTML = "";
        let fb = JSON.parse(localStorage.getItem("feedback")) || [];

        if (fb.length === 0) {
            feedbackList.innerHTML = "<p style='color: #94a3b8;'>No feedback submitted yet. Share your experience!</p>";
            return;
        }

        fb.forEach(f => {
            feedbackList.innerHTML += `<p>⭐ ${f}</p><hr>`;
        });
    }

    // ===== MEDICINE SYSTEM =====
    window.saveMedicine = function () {
        let name = document.getElementById("medName").value.trim();
        let dose = document.getElementById("medDose").value.trim();
        let time = document.getElementById("medTime").value;

        if (!name || !dose || !time) {
            alert("Please fill all fields");
            return;
        }

        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
        medicines.push({ name, dose, time });

        localStorage.setItem("medicines", JSON.stringify(medicines));
        document.getElementById("medName").value = "";
        document.getElementById("medDose").value = "";
        document.getElementById("medTime").value = "";
        loadMedicines();
        alert("Medicine added successfully!");
    };

    function loadMedicines() {
        let list = document.getElementById("medicineList");
        if (!list) return;

        list.innerHTML = "";
        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

        if (medicines.length === 0) {
            list.innerHTML = "<p style='color: #94a3b8;'>No medicines added yet.</p>";
            return;
        }

        medicines.forEach((m, i) => {
            list.innerHTML += `
                <div class="medItem" style="display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 12px; margin: 10px 0; border-radius: 10px;">
                    <p style="margin: 0; text-align: left;"><b>${m.name}</b> – ${m.dose} at <b>${m.time}</b></p>
                    <button style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;" onclick="deleteMedicine(${i})">Delete</button>
                </div>
            `;
        });
    }

    window.deleteMedicine = function (index) {
        let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
        medicines.splice(index, 1);
        localStorage.setItem("medicines", JSON.stringify(medicines));
        loadMedicines();
    };

    // Helper to synthesize a beep sound in case audio file doesn't play
    function playBeepTone() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            }
        } catch (e) {
            console.log("Audio synth fallback", e);
        }
    }

    // ===== REMINDER SYSTEM =====
    setInterval(() => {
        let now = new Date().toTimeString().slice(0, 5);
        let meds = JSON.parse(localStorage.getItem("medicines")) || [];

        meds.forEach(m => {
            if (m.time === now) {
                let message = "Time to take " + m.name + " (" + m.dose + ")";

                popupMessage.innerText = message;
                reminderPopup.style.display = "flex";

                if (alertSound) {
                    alertSound.currentTime = 0;
                    alertSound.play().catch(() => {
                        playBeepTone();
                    });
                } else {
                    playBeepTone();
                }

                if ("speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    let speech = new SpeechSynthesisUtterance(message);
                    speech.lang = "en-US";
                    speech.rate = 0.9;
                    window.speechSynthesis.speak(speech);
                }
            }
        });
    }, 10000); // Check every 10 seconds for timely notification

    // ===== CLOSE POPUP (OK BUTTON) =====
    window.closePopup = function () {
        reminderPopup.style.display = "none";
        if (alertSound) {
            alertSound.pause();
            alertSound.currentTime = 0;
        }
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    };

    // ===== AUTO LOGIN =====
    if (localStorage.getItem("loggedIn") === "true") {
        loadApp();
    } else {
        loginPage.style.display = "block";
    }

});
