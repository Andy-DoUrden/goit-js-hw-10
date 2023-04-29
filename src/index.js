import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

const { input, list, info } = refs;

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const value = e.target.value.trim();

  if (!value) {
    list.innerHTML = '';
    return;
  }

  fetchCountries(value).then(onFetchProcessing).catch(onError);
}

function onFetchProcessing(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (data.length > 1 && data.length <= 10) {
    showSearchedCounties(data);
  } else {
    showCountyDetails(data);
  }
}

function showSearchedCounties(array) {
  const htmlData = array
    .map(({ flags, name }) => {
      return `
    <li class="country-item"><img class="country-img" src=${flags.svg} alt=${flags.alt}><span class="country-text">${name.official}</span></li>
    `;
    })
    .join('');

  list.innerHTML = htmlData;
}

function showCountyDetails(array) {
  const { name, capital, population, flags, languages } = array[0];
  const countryLanguages = Object.values(languages).join(', ');

  list.innerHTML = `
  <li class="country-item--detail">
    <span class="country-text--detail"><img class="country-img--detail" src=${flags.svg} alt=${flags.alt}>${name.official}</span>
    <span class="country-desc--detail"><b>Capital:</b>${capital}</span>
    <span class="country-desc--detail"><b>Population:</b>${population}</span>
    <span class="country-desc--detail"><b>Languages:</b>${countryLanguages}</span>
  </li>
  `;
}

function onError() {
  Notify.failure('Oops, there is no country with that name');
}
