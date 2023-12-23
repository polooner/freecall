import puppeteer from 'puppeteer';

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.on('dialog', async (dialog) => {
    console.log(dialog.message());
    dialog.dismiss();
  });
  //Dialog will not close?

  await page.goto(
    'https://us05web.zoom.us/j/82821789760?pwd=vaRSUcEPsJCbh0EUrh40aKb0v6ugHp.1'
  );

  // Note: The meeting host must enable Show a "Join from your browser" link for their participants.
  // Settings -> In Meeting (Advanced) -> Show a "Join from your browser" link

  // Prevent automatic zoom installer download
  // intercepts request when response headers was received

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.url().endsWith('.pkg')) request.abort();
    else request.continue();
  });

  await page
    .waitForSelector(
      '#zoom-ui-frame > div.bhauZU7H > div > div.pUmU_FLW > h3:nth-child(2) > span > a'
    )
    .then((btn) => btn?.click());

  await delay(20000);
  await browser.close();
})();
