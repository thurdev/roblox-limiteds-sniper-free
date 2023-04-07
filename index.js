(async function () {
  "use strict";

  await timeout(2000);

  let firstItem = document.getElementsByClassName("item-card-container")[0];
  let buyButton = document.querySelector(
    ".item-purchase-btns-container .btn-container button"
  );
  let modalButtonConfirm = document.querySelector("button.modal-button");
  let catalogPageURL =
    "https://www.roblox.com/catalog?Category=1&CurrencyType=3&pxMin=0&pxMax=0&salesTypeFilter=2&SortType=4";
  let triesIfNotInSale = localStorage.getItem("rlb-tries-if-not-in-sale") || 0;

  if (firstItem) {
    firstItem.click();
    await timeout(2500);
  } else {
    if (window.location.href == catalogPageURL) {
      window.location.reload();
    }
  }

  if (buyButton) {
    buyButton.click();
    await timeout(1000);

    modalButtonConfirm.click();

    window.location.reload();
  } else {
    let matchURL = window.location.href.match(
      /\bhttps?:\/\/www\.roblox\.com\/catalog\/\d+?\b/g
    )[0];
    if (matchURL && !isNaN(matchURL.split("/")[4])) {
      if (
        document.querySelector(".item-first-line").innerText ==
        "Ninguém está vendendo este item no momento."
      ) {
        triesIfNotInSale++;
        localStorage.setItem("rlb-tries-if-not-in-sale", triesIfNotInSale);
        window.location.reload();
      }

      if (triesIfNotInSale >= 5) {
        localStorage.setItem("rlb-tries-if-not-in-sale", 0);
        window.location.href = catalogPageURL;
      }
    }
  }
})();

function timeout(timer) {
  return new Promise((resolve) => {
    setTimeout(resolve, timer);
  });
}
