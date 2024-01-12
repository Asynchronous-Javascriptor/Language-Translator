// Select karte hain HTML se elements
const dropdowns = document.querySelectorAll(".dropdown-container"),
    inputLanguageDropdown = document.querySelector("#input-language"),
    outputLanguageDropdown = document.querySelector("#output-language");

// Dropdown ko options se bharne ke liye function
function populateDropdown(dropdown, options) {
    dropdown.querySelector("ul").innerHTML = "";
    options.forEach((option) => {
        const li = document.createElement("li");
        const title = option.name + " (" + option.native + ")";
        li.innerHTML = title;

        li.dataset.value = option.code;
        li.classList.add("option");
        dropdown.querySelector("ul").appendChild(li);
    });
}

// Input aur output language dropdowns ko languages ke sath bharo
populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

// Har dropdown ke liye event listeners add karo
dropdowns.forEach((dropdown) => {
    // Click par 'active' class ko toggle karo
    dropdown.addEventListener("click", (e) => {
        dropdown.classList.toggle("active");
    });

    // Option select karne par
    dropdown.querySelectorAll(".option").forEach((item) => {
        item.addEventListener("click", (e) => {
            // Current dropdown se 'active' class hatao
            dropdown.querySelectorAll(".option").forEach((item) => {
                item.classList.remove("active");
            });
            // Selected option ko 'active' karo
            item.classList.add("active");
            const selected = dropdown.querySelector(".selected");
            selected.innerHTML = item.innerHTML;
            selected.dataset.value = item.dataset.value;
            // Translation ko trigger karo
            translate();
        });
    });
});

// Bahar click karne par dropdowns ko close karo
document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
});

// Input aur output languages ko swap karnwane ke liye button
const swapBtn = document.querySelector(".swap-position"),
    inputLanguage = inputLanguageDropdown.querySelector(".selected"),
    outputLanguage = outputLanguageDropdown.querySelector(".selected"),
    inputTextElem = document.querySelector("#input-text"),
    outputTextElem = document.querySelector("#output-text");



// Google Translate API ka use karke translation karo
function translate() {
    const inputText = inputTextElem.value;
    const inputLanguage =
        inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguage =
        outputLanguageDropdown.querySelector(".selected").dataset.value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
        inputText,
    )}`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            outputTextElem.value = json[0].map((item) => item[0]).join("");
        })
        .catch((error) => {
            console.log(error);
        });
}

// Input text par input limit set karo aur har input par translation ko trigger karo
inputTextElem.addEventListener("input", (e) => {
    // 5000 characters tak limit karo
    if (inputTextElem.value.length > 5000) {
        inputTextElem.value = inputTextElem.value.slice(0, 5000);
    }
    // Translation ko trigger karo
    translate();
});

// Document upload ke liye event listener
const uploadDocument = document.querySelector("#upload-document"),
    uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (
        file.type === "application/pdf" ||
        file.type === "text/plain" ||
        file.type === "application/msword" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        // Uploaded file ka name display karo
        uploadTitle.innerHTML = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            inputTextElem.value = e.target.result;
            // Translation ko trigger karo
            translate();
        };
    } else {
        // Invalid file type ke liye alert
        alert("Please upload a valid file");
    }
});

// Translated text ko text file me download karne ke liye button
const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) => {
    const outputText = outputTextElem.value;
    const outputLanguage =
        outputLanguageDropdown.querySelector(".selected").dataset.value;
    if (outputText) {
        // Translated text ka Blob banao
        const blob = new Blob([outputText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        // Download link create karo aur click karo
        const a = document.createElement("a");
        a.download = `translated-to-${outputLanguage}.txt`;
        a.href = url;
        a.click();
    }
});

// Dark mode ka toggle
const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
    // Body par 'dark' class toggle karo
    document.body.classList.toggle("dark");
});

// Input text ke characters ka count display karo
const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
    inputChars.innerHTML = inputTextElem.value.length;
});
