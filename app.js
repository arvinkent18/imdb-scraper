const requestPromise = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { resolve } = require('path');

const movies = [
  { 
    url: 'https://www.imdb.com/title/tt8946378/?ref_=hm_fanfav_tt_1_pd_fp1', 
    id: 'knive_out',
  },
  {
    url: 'https://www.imdb.com/title/tt5753856/?ref_=hm_fanfav_tt_2_pd_fp1', 
    id: 'dark',
  },
];

(async () => {
  const moviesData = [];

  for (let movie of movies) {
    const html = await requestPromise({
      url: movie.url,
      gzip: true,
    });
  
    let $ = cheerio.load(html);
  
    let title = $('div.title_wrapper > h1').text();
  
    let rating = $('span[itemprop="ratingValue"]').text();
  
    let duration = $('div.title_wrapper > div > time').text();

    let thumbnail = $('div.poster > a > img').attr('src');
  
    let releasedDate = $('.txt-block:nth-child(6)').text();
  
    const genres = [];
    
    $('a[href^="/search/title?genres"]').each((_index, element) => {
      let genre = $(element).text();
  
      genres.push(genre);
    });

    duration = duration.trim();
    releaseDate = releasedDate.trim();
    let uniqueGenres = [...new Set(genres)];

    moviesData.push({
      title,
      rating,
      duration,
      thumbnail,
      releasedDate,
      uniqueGenres,
    });

    let file = fs.createWriteStream(`${movie.id}.jpg`);

    await new Promise((resolve, reject) => {
      let stream = request({
        uri: thumbnail,
        gzip: true,
      })
      .pipe(file)
      .on('finish', () => {
        console.log('finished scraping image...', stream.path);
        resolve();
      })
    });

    fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');
  }
})();

