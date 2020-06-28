const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const urls = [
  'https://www.imdb.com/title/tt8946378/?ref_=hm_fanfav_tt_1_pd_fp1',
  'https://www.imdb.com/title/tt5753856/?ref_=hm_fanfav_tt_2_pd_fp1',
];

(async () => {
  const moviesData = [];

  for (let movie of urls) {
    const html = await request({
      url: movie,
      gzip: true,
    });
  
    let $ = cheerio.load(html);
  
    let title = $('div.title_wrapper > h1').text();
  
    let rating = $('span[itemprop="ratingValue"]').text();
  
    let duration = $('div.title_wrapper > div > time').text();
  
    let releasedDate = $('.txt-block:nth-child(6)').text();
  
    let genres = [];
    
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
      releasedDate,
      uniqueGenres,
    });

    fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');
  }

  console.log(moviesData);
})();

