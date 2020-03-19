const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    citiesData = 'dataBase/cities.json';

const city = [
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Самара',
    'Екатеринбург',
    'Калининград',
    'Уфа',
    'Казань',
    'Ростов-на-Дону',
    'Магадан'
];


// посмотреть использование fetch в гугле, его чаще испол-т
// https://jsonplaceholder.typicode.com/
// rest full api - получаем весь объект, с которым потом работает
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        //console.log(request.readyState);  посмотерть про readyState
        if (request.readyState !== 4) return;

        // если получили данные
        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};

const showCityList = (input, listContainer) => {
    listContainer.textContent = '';

    if (input.value !== '') {

        const filterCity = city.filter((item) => {
            // если нужно, можем преобразовать возвращаемый item
            const fixItem = item.toLowerCase();
            return fixItem.includes(input.value.toLowerCase()); // условие, если true -> filter return item
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            listContainer.append(li);
        });
    }
};

const getCity = (input, listContainer) => {

    input.addEventListener('input', () => {
        showCityList(input, listContainer);
    });

    listContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'li') {
            input.value = target.textContent;
            listContainer.textContent = '';
        }
    });
};

const goInputCity = () => {

    const citiesInput = [
        inputCitiesFrom,
        inputCitiesTo
    ];

    const citiesListContainer = [
        dropdownCitiesFrom,
        dropdownCitiesTo
    ];

    citiesInput.forEach((input, listNum) => {
        getCity (input, citiesListContainer[listNum]);
    });
};

// события
goInputCity();

// функции
/*
getData(proxy + citiesApi, (data) => {
    console.log(data);
});
*/

getData(citiesData, (data) => {
    console.log(data);
});




