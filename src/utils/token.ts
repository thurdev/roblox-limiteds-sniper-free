import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
export const generateXCSRFToken = async () => {
  const response = await axios.get('https://www.roblox.com/home', {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
      cookie: process.env.ROBLOX_COOKIES,
    },
  });
  const $ = cheerio.load(response.data);
  fs.writeFileSync('roblox.html', response.data); // Will be used to get user id, and the random uuid for the transaction
  const token = $('meta[name="csrf-token"]').attr('data-token');
  return token;
};
