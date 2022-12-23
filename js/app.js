// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchBar = document.querySelector("#search-bar");

// fetch data from API
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

function displayEmployees(employeeData) {
    employees = employeeData;

    let employeeHTML = '';

    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}">
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `
    });
    gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {

    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];

    let date = new Date(dob.date);

    const modalHTML = `
        <img class="avatar" src="${picture.large}">
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr>
            <p>${phone}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p>Birthday:
            ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
            <button class="left-button">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <button class="right-button">
                <span class="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>
    `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;

    const leftButton = document.querySelector(".left-button");
    const rightButton = document.querySelector(".right-button");

    leftButton.addEventListener('click', () => {
        if (index > 0) {
            index -= 1;
            displayModal(index);
        }
    });

    rightButton.addEventListener('click', () => {
        if (index < 11) {
            index += 1;
            displayModal(index);
        }
    });
}

gridContainer.addEventListener('click', e => {

    if (e.target !== gridContainer) {

        // select the card element based on its proximity to actual element clicked
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');

        displayModal(parseInt(index));
    }
});

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});

searchBar.addEventListener('keyup', e => {
    let search = e.target.value.toLowerCase();
    let names = document.querySelectorAll(".card .name");
    names.forEach(employee => {
        if (employee.textContent.toLowerCase().includes(search)) {
            employee.parentNode.parentNode.style.display = 'flex';
        } else {
            employee.parentNode.parentNode.style.display = 'none';
        }
    });
});