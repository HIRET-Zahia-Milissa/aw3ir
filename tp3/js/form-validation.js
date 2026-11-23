function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function setFieldState(id, isValid) {
    const field = document.querySelector("#" + id);
    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-invalid", !isValid);
    return isValid;
}

function showModal(title, bodyHtml) {
    document.querySelector(".modal-title").textContent = title;
    document.querySelector(".modal-body").innerHTML = bodyHtml;
    const myModal = new bootstrap.Modal(document.getElementById("myModal"));
    myModal.show();
}

window.onload = function () {
    console.log("DOM ready!");

    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const firstname = document.querySelector("#firstname").value.trim();
        const birthday = document.querySelector("#birthday").value;
        const address = document.querySelector("#address").value.trim();
        const email = document.querySelector("#email").value.trim();

        const birthdayTimestamp = new Date(birthday).getTime();
        const nowTimestamp = Date.now();
        const birthdayOk = birthday !== "" && birthdayTimestamp <= nowTimestamp;

        const errors = [];
        if (!setFieldState("name", name.length >= 5)) errors.push("Nom : 5 caractères minimum");
        if (!setFieldState("firstname", firstname.length >= 5)) errors.push("Prénom : 5 caractères minimum");
        if (!setFieldState("birthday", birthdayOk)) errors.push("Date de naissance : invalide ou dans le futur");
        if (!setFieldState("address", address.length >= 5)) errors.push("Adresse : 5 caractères minimum");
        if (!setFieldState("email", validateEmail(email))) errors.push("Adresse mail : format invalide");

        if (errors.length > 0) {
            const list = errors.map((e) => "<li>" + escapeHtml(e) + "</li>").join("");
            showModal("Formulaire incorrect", "<ul>" + list + "</ul>");
        } else {
            const mapsUrl = "http://maps.google.com/maps?q=" + encodeURIComponent(address);
            const body =
                "<p>Bonjour " + escapeHtml(firstname) + " " + escapeHtml(name) + ",</p>" +
                "<p>Vous habitez à : " +
                '<a href="' + mapsUrl + '" target="_blank">' + escapeHtml(address) + "</a></p>";
            showModal("Formulaire valide", body);
        }
    });
};
