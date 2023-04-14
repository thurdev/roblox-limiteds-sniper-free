export const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const now = () => {
  const now = new Date();
  return `${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()}:${
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
  }:${now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()}`;
};
