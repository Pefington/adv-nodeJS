import { createApi } from 'unsplash-js';

import { UNSPLASH_KEY } from '../env/env.js';

const unsplash = createApi({ accessKey: UNSPLASH_KEY });

export async function getPhoto(query) {
  try {
    const request = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 10,
      orientation: 'squarish',
    });

    const photos = request.response.results;
    const index = Math.floor(Math.random() * photos.length);
    const photo = photos[index];

    return {
      url: photo.urls.small,
      alt: photo.alt_description,
    };
  } catch (error) {
    console.error('Unsplash error: ', error);
    return null;
  }
}
