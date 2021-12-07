import Notiflix from 'notiflix';
import './css/styles.css';
import CountriesList from './templates/countriesListCard'
import CountryCard from './templates/countryCard.hbs'
import FetchApi from './fetchCountries';
import debounce  from 'lodash.debounce';

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const URL_PARAMS = `name,capital,population,flags,languages`;
const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector(`.country-list`);
const countryInfo = document.querySelector(`.country-info`);
const findField = document.querySelector(`#search-box`)

findField.addEventListener(`input`,  debounce(onFindfield, DEBOUNCE_DELAY))

function onFindfield(evt) {
    evt.preventDefault();
    const name = evt.target.value;
    const countryUrl = `${BASE_URL}${name}?fields=${URL_PARAMS}`

    if (name.trim() === '') {
        countryList.innerHTML = '';
        return
    };
        
    FetchApi(countryUrl)
        .then(countries => { return countries })
        .then(createMarkup)
        .catch(onReject)
};

function createMarkup(countriesArr) {
     
    if (countriesArr.length === 1) {
        countryList.innerHTML = '';
            countryInfo.innerHTML = `${CountryCard(countriesArr[0])}`;
        }
        if (countriesArr.length > 1 && countriesArr.length < 10) {
            countryInfo.innerHTML = '';
            countryList.innerHTML ='';
            countriesArr.forEach(element => {
             countryList.insertAdjacentHTML(`beforeend`, CountriesList(element))
          });          
        }
        if (countriesArr.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
};

function onReject() {
    Notiflix.Notify.failure(`Oops, there is no country with that name`);
};