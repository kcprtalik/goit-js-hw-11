import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '35135450-91eed02170714cd46fbec0091';

export async function fetchPictures(keyword, page, perPage) {
  const res = await axios.get(
    `?key=${KEY}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return res;
}
