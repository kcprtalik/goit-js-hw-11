//  IMPORT

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPictures } from './js/pixabay';

//  VARIABLES

const searchForm = document.querySelector('.search-form');
const galleryClear = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.btn-more');
const gallery = document.querySelector('.gallery');

let totalHits = 0;
let keyword = '';
let page = 1;
const perPage = 40;

//  EVENTS

searchForm.addEventListener('submit', inputOn);
loadMoreButton.addEventListener('click', loadMore);

//  FUNCTIONS

function lightboxGallery() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

//  FUNCTION 1. SEARCH

function inputOn(event) {
  event.preventDefault();
  //const keyword = event.target.value;
  keyword = event.currentTarget.searchQuery.value;
  clearForm();
  loadMoreButton.classList.add('is-hidden');

  fetchPictures(keyword, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        noSearchContent();
      } else {
        createGallery(data.hits);
        lightboxGallery();

        successfulSearch(data);

        if (data.totalHits > perPage) {
          loadMoreButton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error);
}

//  FUNCTION 2. LOAD MORE

function loadMore() {
  page += 1;
  fetchPictures(keyword, page, perPage)
    .then(({ data }) => {
      createGallery(data.hits);
      lightboxGallery();

      if (data.totalHits <= page * perPage) {
        loadMoreButton.classList.add('is-hidden');
        endOfSearch();
      }
    })
    .catch(error);
}

function clearForm() {
  galleryClear.innerHTML = '';
}

//CREATE GALLERY

function createGallery(images) {
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__item" href="${largeImageURL}">
        <div class="photo-card" id=${id}>
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info__item"> <b>Likes</b> ${likes} </p>
          <p class="info__item"> <b>Views</b> ${views} </p>
          <p class="info__item"> <b>Comments</b> ${comments} </p>
          <p class="info__item"> <b>Downloads</b> ${downloads} </p>
        </div>
      </div>
      </a>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

//  NOTIFLIX

function noSearchContent() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function endOfSearch() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}
//function successfulSearch()
function successfulSearch(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

//=============================================================================

// let lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

//===============================================================================

// webformatURL - link do małego obrazka.
// largeImageURL - link do dużego obrazka.
// tags - wiersz z opisem obrazka. Będzie pasować do atrybutu alt.
// likes - liczba “lajków”.
// views - liczba wyświetleń.
// comments - liczba komentarzy.
// downloads - liczba pobrań.

//=============================================================================<div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>

//=============================================================================
//commit
