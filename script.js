const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    priceCalendarApi = 'http://min-prices.aviasales.ru/calendar_preload',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    citiesData = 'dataBase/cities.json',
    API_KEY = '70ada17966d2f40ab3c05a48876fe7c5';

let city = [];

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

// выводим список городов по сопадениям
const showCityList = (input, listContainer) => {
    listContainer.textContent = '';

    if (input.value !== '') {

        const filterCity = city.filter((item) => {
            // если нужно, можем преобразовать возвращаемый item
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase()); // условие, если true -> filter return item
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            listContainer.append(li);
        });
    }
};

// нужный город кликаем в input, чистим список городов-совпадений
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

// вводим данные для поиска городов откуда-куда
const goInputCity = () => {

    const citiesInput = [
        inputCitiesFrom,
        inputCitiesTo
    ];

    const citiesListContainer = [
        dropdownCitiesFrom,
        dropdownCitiesTo
    ];

    // получаем список городов - совпадений
    citiesInput.forEach((input, listNum) => {
        getCity (input, citiesListContainer[listNum]);
    });
};

// события
goInputCity();

// функции
getData(citiesData, (data) => {
    city = JSON.parse(data).filter(item => item.name);
});

getData(proxy + priceCalendarApi + '?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true&token=' + API_KEY, (data) => {
    console.log(data);
});




