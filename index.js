(async function () {
  "use strict";

  if (isItemPage()) {
    await timeout(1000);
  } else {
    await timeout(5000);
  }

  let firstItem = document.getElementsByClassName("item-card-container")[0];
  let buyButton = document.querySelector(
    ".item-purchase-btns-container .btn-container button"
  );
  let catalogPageURL =
    "https://www.roblox.com/catalog?Category=1&CurrencyType=3&pxMin=0&pxMax=0&salesTypeFilter=2&SortType=4";
  let triesIfNotInSale = localStorage.getItem("rlb-tries-if-not-in-sale") || 0;

  if (firstItem && !isItemPage()) {
    firstItem.click();
    await timeout(2500);
  } else {
    if (window.location.href == catalogPageURL) {
      window.location.reload();
    }
  }

  if (buyButton) {
    let keepTrying = true;

    while (keepTrying) {
      buyButton.click();
      await timeout(500);

      let modalButtonConfirm = document.querySelector("button.modal-button");
      if (
        modalButtonConfirm &&
        (modalButtonConfirm?.innerText == "Comprar agora" ||
          modalButtonConfirm?.innerText == "Get Now")
      ) {
        modalButtonConfirm.click();
        await timeout(500);
      } else if (
        modalButtonConfirm.innerText == "Personalizar" ||
        modalButtonConfirm.innerText == "Customize"
      ) {
        window.location.reload();
        await timeout(500);
      }

      let modalTitle = document.querySelector("h4.modal-title")?.innerText;

      if (
        modalTitle == "Compra concluída" ||
        modalTitle == "Purchase Complete"
      ) {
        keepTrying = false;
        window.location.reload();
        await timeout(500);
      }
    }
  } else {
    if (isItemPage()) {
      if (
        document.querySelector(".item-first-line").innerText ==
          "Ninguém está vendendo este item no momento." ||
        document.querySelector(".item-first-line").innerText ==
          "There is no one currently selling this item."
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

function isItemPage() {
  let matchURL = window.location.href.match(
    /\bhttps?:\/\/www\.roblox\.com\/catalog\/\d+?\b/g
  );

  if (matchURL && matchURL[0]) {
    if (!isNaN(matchURL[0].split("/")[4])) {
      return true;
    }
  }
  return false;
}
