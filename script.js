const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    priceCalendarApi = 'http://min-prices.aviasales.ru/calendar_preload',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    citiesData = 'dataBase/cities.json',
    API_KEY = '70ada17966d2f40ab3c05a48876fe7c5';

const MAX_TICKET = 10;

let city = [];

const getData = (url, callback, errorback = console.error) => {

    try {

        const request = new XMLHttpRequest();

        request.open('GET', url);

        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) return;

            // если получили данные
            if (request.status === 200) {
                callback(request.response);
            } else {
                errorback(request.status);
            }
        });
        request.send();

    } catch(err) {
        console.log(err);
    }
};

// выводим список городов по сопадениям
const showCityList = (input, listContainer) => {
    listContainer.textContent = '';

    if (input.value !== '') {

        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
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
        getCity(input, citiesListContainer[listNum]);
    });
};

const getLinkTicket = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);
    const day = date.getDate();
    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;
    link += month < 10 ? '0' + month : month;

    link += data.destination;
    link += '1';

    return link;
};

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getViewDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const getChanges = (num) => {
    if (num) return num === 1 ? 'С одной пересадкой' : 'Две и более пересадок';
    else return 'Без пересадок';
};

const showMessage = (textMessage) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.style.color = 'red';
    cheapestTicket.innerHTML = '<h3>' + textMessage + '</h3>';
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLinkTicket(data)}" target="_blank" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getViewDate(data.depart_date)}</div>
                    </div>
            
                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

// самый дешевый билет на дату
const renderSearchDay = (cheapTicketDay) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.style.color = 'white';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    if (cheapTicketDay.length) {
        const ticket = createCard(cheapTicketDay[0]);
        cheapestTicket.append(ticket);
    } else {
        cheapestTicket.insertAdjacentHTML('beforeend', '<h3>На выбранную дату билеты отсутствуют.</h3>');
    }
};

// самые дешевые на другие даты
const renderSearchPeriod = (tickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    tickets.sort((a, b) => a.value - b.value);

    for (let i = 0; i < tickets.length && i < MAX_TICKET; i++) {
        const ticket = createCard(tickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const renderSearch = (data, needDate) => {
    const tickets = JSON.parse(data).best_prices;

    if (tickets.length) {
        const cheapTicketDay = tickets.filter(item => item.depart_date === needDate);

        renderSearchDay(cheapTicketDay);
        renderSearchPeriod(tickets);
    }
};

// события
goInputCity();

document.body.addEventListener('click', () => {
    dropdownCitiesFrom.textContent = '';
    dropdownCitiesTo.textContent = '';
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault(); // отменяет перезагрузку страницы после отправки

    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name), // find возвращает только один элемент, как его найдет
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {

        const urlRequest = '?origin=' + formData.from.code +
            '&destination=' + formData.to.code +
            '&depart_date=' + formData.when +
            '&one_way=true';

        getData(priceCalendarApi + urlRequest,
            (response) => {
                renderSearch(response, formData.when);
            },
            (err) => {
                showMessage('В этом направлении нет рейсов');
                console.error('ошибка', err)
            }
        );

    }
    else showMessage('Введите корректно город');
});

// функции
getData(citiesData, (data) => {
    city = JSON.parse(data).filter(item => item.name);

    city.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name ? -1 : 0));
});





