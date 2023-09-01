 console.log("Hello")
// Знаходимо потрібні посилання , HTML теги з яикми будемо працювати
let url = "https://swapi.dev/api/people/?page=1";         

let nextPage = " ";
let prevPage = " ";
let name = document.querySelector('#name'),
    gender = document.querySelector('#gender'),
    birthYear = document.querySelector('#birth-year'),
    homeworld = document.querySelector('#planet'),
    filmsTitles = document.querySelector('#films'),
    heroesPlanet = document.querySelector('#species');
let blockInfo = document.querySelector(".container_heroes-info");
let nextButton = document.querySelector(".button_next-hero");
let prevButton = document.querySelector(".button_prev-hero");
let closeButtonInfo = document.querySelector(".close");

    //Очищаємо блок з таблицею
    if (blockInfo) {
        blockInfo.style.display = "none"
    }        
    // Призначаємо слухачі подій 
    nextButton.addEventListener("click", nextPageUrl);
    if (prevButton) {
        prevButton.addEventListener("click", prevPageUrl);
    }
    if (closeButtonInfo) {
        closeButtonInfo.addEventListener("click", closeInfo);
    }
    //Викликаємо функцію для того щоб дістати список 
    getPeople(url);  


// очищаємо блок від створених попередніх персонажів
function clearContainer() {
    const container = document.getElementById('container_heroes');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function getPeople(url) {
    fetch(url)
        .then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function(data) {
                clearContainer();                                                // Очистили вміст блоку перед виводом
                const itemsArray = data.results;                                 //зберегли масив обєктів
                const container = document.getElementById('container_heroes');   //підтягнули контейнер куди помістимо персонажів
                nextPage = data.next;                                            //Зберегли наступну сторінку 
                prevPage = data.previous;                                        //Зберегли попередню сторінку 
                itemsArray.forEach(item => {                                      
                    var divElement = document.createElement('div');               //Створюємо нові блоки
                    divElement.textContent = item.name;                           //Прописуємо в блоках імя персонжів 
                    divElement.classList.add('heroe_blok');                        //Задаємо їм клас 
                    divElement.addEventListener("click", showInfo.bind(null, item));  //Призначаємо слухачі з привязкою аргументу до фунції
                    container.appendChild(divElement);                             //Вставляємо в структуру нові блоки з їх параметрами
                });
                console.log(data);                                                 //Перевірка чи все вивело вірно.
            });
        })
        .catch(function(err) {
            console.error('Error:', err);
        });
}

function showInfo(characterData) {
    if (blockInfo.style.display === "none") {   //Перевіряємо чи контейнер прихований якщо так то показуємо для виводу інфо
        blockInfo.style.display = "";               
    }
    
    //Встановлюємо в таблицю ІНФО  дані персонажа в відповідні поля 
    name.innerHTML = characterData.name;         
    gender.innerHTML = characterData.gender;
    birthYear.innerHTML = characterData.birth_year;

    //дістаємо "світ" для розділу Світ
    fetch(characterData.homeworld)            
        .then(response => response.json())
        .then(homeworldData => {
            homeworld.innerHTML = homeworldData.name;
        })
        .catch(error => {
            console.error('Error homeworld:', error);
            homeworld.innerHTML = 'Невідомий';
        });
    
    //дістаємо фльми для розділу
    Promise.all(characterData.films.map(filmUrl =>
        fetch(filmUrl)                           
            .then(response => response.json())
            .then(filmData => filmData.title)
    ))
        .then(films => {
            filmsTitles.innerHTML = films.join(', '); //Формуємо через " розділовий знак"
        })
        .catch(error => {
            console.error('Error  films:', error);
            filmsTitles.innerHTML = 'Фільми не знайдено';
        });
    
     //дістаємо фльми для розділу
    fetch(characterData.species)
        .then(response => response.json())        
        .then(speciesData => {
            heroesPlanet.innerHTML = speciesData.name;
        })
        .catch(error => {
            console.error('Error  species:', error);
            heroesPlanet.innerHTML = 'Невідомий вид';
        });
}
 //Функція для виклику наступного списку 
function nextPageUrl() {  
    getPeople(nextPage); 
}
 //Функція для виклику попереднього списку 
function prevPageUrl() {
    getPeople(prevPage); 
}
 //Функція яка приховує табличю з інфо про персонажа
function closeInfo() {
    blockInfo.style.display = "none";
}

                                
