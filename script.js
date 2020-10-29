let allUsers = [];
let foundUsers = [];
let minInputLength = 1;
let searchUserInput, sendButton, userData;
let usersStatistics;
let showAfterLoad = null;
let preLoader = null;
window.addEventListener('load', async () => {
  startIds();
  await fetchDataFromAPI();
  mapEvents();
});
function startIds() {
  searchUserInput = document.querySelector('#searchUserInput');
  sendButton = document.querySelector('#sendButton');
  userData = document.querySelector('#userData');
  usersStatistics = document.querySelector('#usersStatistics');
  showAfterLoad = document.querySelector('#showAfterLoad');
  preLoader = document.querySelector('#preLoader');
}
async function fetchDataFromAPI() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allUsers = json.results.map(({ login, name, gender, picture, dob }) => {
    return {
      id: login.uuid,
      name: `${name.first} ${name.last}`,
      filterName: `${name.first} ${name.last}`.toLowerCase(),
      picture: picture.large,
      age: dob.age,
      gender: gender,
    };
  });
  allUsers.sort((a, b) => {
    a.name.localeCompare(b.name);
  });
  showLoading();
}
function showLoading() {
  setTimeout(() => {
    preLoader.classList.add('hidden');
    showAfterLoad.classList.remove('hidden');
  }, 2000);
}

function mapEvents() {
  searchUserInput.addEventListener('keyup', processDataEnteredInInput);
  sendButton.addEventListener('click', () => {
    findUserFromInput(searchUserInput.value);
  });
}
function processDataEnteredInInput(event) {
  const thisEvent = event.key;
  const dataEntered = event.target.value.trim();

  const length = dataEntered.length;
  sendButton.disabled = length < minInputLength;
  if (thisEvent.key !== 'Enter') {
    return;
  }
  if (minInputLength < 1) {
    return;
  }
  if (event.key === 'Enter') {
    findUserFromInput(dataEntered);
  }
}
function findUserFromInput(dataEntered) {
  const lowerCaseDataEntered = dataEntered.toLowerCase();
  const foundUserFromInput = allUsers.filter((users) => {
    return users.filterName.includes(lowerCaseDataEntered);
  });

  handleFilteredUsers(foundUserFromInput);
}
function handleFilteredUsers(foundUserFromInput) {
  if (foundUserFromInput.length === 0) {
    showNoUsers();
    showNoStatistics();
  }
  showUsers(foundUserFromInput);
  showStatistics(foundUserFromInput);
}
function showNoUsers() {
  userData.innerHTML = ` <h2>No user data to be shown</h2>`;
}
function showNoStatistics() {
  userStatistics.innerHTML = `<h2>No Statistics to be shown</h2>`;
}
function showUsers(users) {
  const h2 = document.createElement('h2');
  h2.textContent = users.length + ' users found';
  const ul = document.createElement('ul');
  users.map(({ name, picture, age }) => {
    const li = document.createElement('li');
    //   li.classList.add('flex-box');
    const img = `<img class ="avatar" src="${picture}" alt="name"> `;
    const span = `<span> ${name}, ${age} years old</span>`;
    li.innerHTML = `${img} ${span} <br/>_______________________________________`;
    ul.appendChild(li);
    userData.innerHTML = ' ';
  });
  userData.appendChild(h2);

  userData.appendChild(ul);
}
function showStatistics(users) {
  const countMales = users.filter((user) => user.gender === 'male').length;
  const countfemales = users.filter((user) => user.gender === 'female').length;
  const sumAges = users.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);
  const avgOfAges = new Intl.NumberFormat().format(sumAges / users.length || 0);
  usersStatistics.innerHTML = `<h5>Statistics</h5>
<ul>
<li>Number of males: ${countMales}</li>
<li>Number of females: ${countfemales}</li>
<li>Sum of all ages: ${sumAges}</li>
<li>Average of all ages: ${avgOfAges}</li>

</ul>
`;
}
