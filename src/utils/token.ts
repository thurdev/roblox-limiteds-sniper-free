import axios from 'axios';
export const generateXCSRFToken = async () => {
  const config = {
    method: 'post',
    url: 'https://auth.roblox.com/v2/logout',
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
      cookie: process.env.ROBLOX_COOKIES,
    },
  };

  const response = await axios(config).catch((err) => {
    return err.response;
  });
  return response.headers?.['x-csrf-token'];
};
