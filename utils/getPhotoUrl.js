import { createApi } from 'unsplash-js';

import { UNSPLASH_KEY } from '../env/env.js';

const unsplash = createApi({ accessKey: UNSPLASH_KEY });

export async function getphotoUrl(query) {
  try {
    const request = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 10,
      orientation: 'squarish',
    });

    const photos = request.response.results;
    const index = Math.floor(Math.random() * photos.length);

    return photos[index].urls.small;
  } catch (error) {
    console.error('Unsplash error: ', error);
    return null;
  }
}
