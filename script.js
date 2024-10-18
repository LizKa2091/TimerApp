//ДОДЕЛАТЬ ДОБАВИТЬ ВОЗМОЖНОСТЬ ВВЕДЕНИЯ ВРЕМЕНИ ВРУЧНУЮ
const body = document.querySelector('body');
const mainWindow = document.querySelector('.main-window');

const loadDataButton = document.querySelector('.load-data');
const saveDataButton = document.querySelector('.save-data');
const clearDataButton = document.querySelector('.clear-data');
const loadingData = document.querySelector('.loading-data');

const changeThemeButtons = document.querySelectorAll('.theme-type');
const lightThemeButton = document.querySelector('.theme-light');
const darkThemeButton = document.querySelector('.theme-dark');

const timeSpans = document.querySelectorAll('.time-span')
const secondsSpan = document.querySelector('.seconds');
const minutesSpan = document.querySelector('.minutes');
const hoursSpan = document.querySelector('.hours');
const daysSpan = document.querySelector('.days'); //hidden

const actionButtons = document.querySelectorAll('.action-button');
const startButton = document.getElementsByClassName('start')[0];
const stopButton = document.getElementsByClassName('stop')[0];
const restartButton = document.getElementsByClassName('restart')[0];
const clearButton = document.getElementsByClassName('clear')[0];

let descriptionText = document.getElementsByClassName('description__p')[0];
const descriptionInput = document.getElementById('description__input');

let standardDescriptionStyles = {
    color: 'black',
    opacity: '1',
    border: '0'
};
let modifiedDescriptionStyles = {
    color: 'gray',
    opacity: '0.7',
    borderBottom: '1px dashed gray'
};

let isLightTheme = true;
let isRunning = false;
let isFillingDescription = false;
let isFillingTime = false;
let timesClickedDescription = 0;

let seconds = 0;
let minutes = 0;
let hours = 0;
let days = 0;
let intervalId = 0;

//пользователь сменил тему
const switchTheme = arg => {
    switch(arg) {
        case 'theme-light': 
            darkThemeButton.style.display = 'block';
            lightThemeButton.style.display = 'none';
            body.style.backgroundColor = '#fff';

            actionButtons.forEach(el => {
                el.style.backgroundColor = 'wheat';
                el.style.borderColor = 'wheat';
            });
            isLightTheme = true;
            break;
        case 'theme-dark':
            lightThemeButton.style.display = 'block';
            darkThemeButton.style.display = 'none';
            body.style.backgroundColor = '#303030';

            actionButtons.forEach(el => {
                el.style.backgroundColor = '#7F735E';
                el.style.borderColor = '#7F735E';
            });
            isLightTheme = false;
            break;
        default: 
            throw new Error('failed to change theme');
            break;
    }
}

[...changeThemeButtons].forEach(button =>{
    button.addEventListener('click', () => switchTheme(button.classList[0]))}
);

//пользователь запросил сохранение данных
function saveData() {
    stopTime();
    isLightTheme ? localStorage.setItem('theme-type', 'light') : localStorage.setItem('theme-type', 'dark');
    localStorage.setItem('time', `${days}:${hours}:${minutes}:${seconds}`);
    let descText = document.getElementsByClassName('description__p')[0];
    localStorage.setItem('desc', `${descText.textContent}`);
};
saveDataButton.addEventListener('click', saveData);

//пользователь запросил очистку данных
function clearData() {
    localStorage.clear();
};
clearDataButton.addEventListener('click', clearData);

//пользователь запросил загрузку данных
function loadData() {
    if (localStorage.length === 0) {
        console.log('joined if');
        loadingData.innerHTML = `<p>Не удалось обнаружить сохранённые данные</p>`;
        
        const intervalData = setTimeout(()=>{
            loadingData.innerHTML = '';
        }, 3000);
    }
    else {
        let savedTimeArr = localStorage.getItem('time').split(':');
        console.log(savedTimeArr);
        [days, hours, minutes, seconds] = savedTimeArr;
        stopTime();
        updateTimeText(days, hours, minutes, seconds);

        let savedTheme = localStorage.getItem('theme-type');
        switchTheme(`theme-${savedTheme}`);

        let savedDesc = localStorage.getItem('desc');
        descriptionText.textContent = savedDesc;
        if (savedDesc !== 'Нажмите, чтобы добавить описание') {
            descriptionText.style.color = standardDescriptionStyles.color;
            descriptionText.style.opacity = standardDescriptionStyles.opacity;
            descriptionText.style.border = standardDescriptionStyles.border;
        }
    }
};

loadDataButton.addEventListener('click', loadData);

startButton.addEventListener('click', startTime);
stopButton.addEventListener('click', stopTime);
restartButton.addEventListener('click', restartTime);
clearButton.addEventListener('click', clearTime);

//пользователь нажал на кнопку старта
async function startTime() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval( ()=>{
            seconds++;
            if (seconds >= 60) {
                seconds = seconds % 60;
                minutes++;
            }
            if (minutes >= 60) {
                minutes = minutes % 60;
                hours++;
            }
            if (hours >= 24) {
                hours = hours % 24;
                days++;
            }
            updateTimeText(days, hours, minutes, seconds);
        }, 1000);
    }
};

//пользователь нажал на кнопку стоп
async function stopTime() {
    if (isRunning) {
        isRunning = false;
        clearInterval(intervalId);
    }
};

//пользователь нажал на кнопку рестарта
function restartTime() {
    seconds = 0;
    minutes = 0;
    hours = 0;
    days = 0;
    if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
    }
    startTime();
};

//пользователь нажал на кнопку очистки
function clearTime() {
    clearInterval(intervalId);
    isRunning = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    days = 0;
    updateTimeText(days, hours, minutes, seconds);
};

const updateTimeText = (days, hours, minutes, seconds) => {
    seconds < 10 ? secondsSpan.textContent = `0${seconds}` : secondsSpan.textContent = seconds;
    minutes < 10 ? minutesSpan.textContent = `0${minutes}` : minutesSpan.textContent = minutes;
    hours < 10 ? hoursSpan.textContent = `0${hours}` : hoursSpan.textContent = hours;
    days < 10 ? daysSpan.textContent = `0${days}` : daysSpan.textContent = days;
    if (days>0) {
        console.log(days);
        daysSpan.style.display = 'inline';
        daysSpan.innerHTML+=':';
    }
};

//пользователь нажал на изменение описания
descriptionText.addEventListener('click', ()=>{
    isFillingDescription = true;
    descriptionText.style.display = 'none';
    descriptionInput.style.display = 'block';
    descriptionText.textContent = descriptionInput.value;
    timesClickedDescription++;
});

//пользователь нажал на поле ввода описания
descriptionInput.addEventListener('click', () => {
    timesClickedDescription++;
});

//пользователь после нажатия на поле ввода описания нажал куда-то ещё, не на поле
document.addEventListener('click', (e) => {
    if (isFillingDescription && (e.target !== descriptionText) && (e.target !== descriptionInput)) {
        if (descriptionInput.value !== '') {
            descriptionText.textContent = descriptionInput.value;
            descriptionText.style.color = standardDescriptionStyles.color;
            descriptionText.style.opacity = standardDescriptionStyles.opacity;
            descriptionText.style.border = standardDescriptionStyles.border;
        }
        else  {
            descriptionText.textContent = 'Нажмите, чтобы добавить описание';
            descriptionText.style.color = modifiedDescriptionStyles.color;
            descriptionText.style.opacity = modifiedDescriptionStyles.opacity;
            descriptionText.style.borderBottom = modifiedDescriptionStyles.borderBottom;
        }
        descriptionText.style.display = 'block';
        descriptionInput.style.display = 'none';
    }
});
