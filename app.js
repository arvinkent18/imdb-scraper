const request = require('request-promise');
const cheerio = require('cheerio');

const baseURI = 'https://www.imdb.com/title/tt8946378/?ref_=hm_fanfav_tt_1_pd_fp1';

const movieData = new Set();

(async () => {
  const html = await request(baseURI);

  let $ = cheerio.load(html);

  let title = $('div.title_wrapper > h1').text();

  let rating = $('span[itemprop="ratingValue"]').text();

  movieData.add(title);
  movieData.add(rating);

  console.log(movieData);
})();

