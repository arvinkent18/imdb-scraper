const request = require('request-promise');
const cheerio = require('cheerio');

const baseURI = 'https://www.imdb.com/title/tt8946378/?ref_=hm_fanfav_tt_1_pd_fp1';

const movieData = new Set();

(async () => {
  const html = await request({
    url: baseURI,
    gzip: true,
  });

  let $ = cheerio.load(html);

  let title = $('div.title_wrapper > h1').text();

  let rating = $('span[itemprop="ratingValue"]').text();

  let duration = $('div.title_wrapper > div > time').text();

  let releasedDate = $('div.title_wrapper > div > a:nth-child(8)').text();

  let genres = [];

  $('#titleStoryLine > div:nth-child(10) > a[href^="/search"]').each((_index, element) => {
    let genre = $(element).text();

    genres.push(genre);
  });

  movieData.add(title);
  movieData.add(rating);
  movieData.add(duration);
  movieData.add(releasedDate);
  movieData.add(genres);

  console.log(movieData);
})();

