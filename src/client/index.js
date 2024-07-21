// js files
import { checkWeatherSubmit, getDataFromLocalStorage } from "./js/formHandler";
import { isValidData, getCurrentDate, isEndDateValid, daysBetween2Dates } from "./js/formValidate";

// sass files
import "./styles/main.scss";
import "./styles/desktop.scss";
import "./styles/tablet.scss";
import "./styles/mobile.scss";

// add event listeners
const checkWeatherbtn = document.getElementById('checkWeather');
window.addEventListener('load', getDataFromLocalStorage);
checkWeatherbtn.addEventListener('click', checkWeatherSubmit);

export {
    checkWeatherSubmit,
    isValidData,
    getCurrentDate,
    isEndDateValid,
    daysBetween2Dates,
    getDataFromLocalStorage
};