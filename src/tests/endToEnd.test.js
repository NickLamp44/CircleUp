import puppeteer from "puppeteer";
jest.setTimeout(30000);

describe("Filter Events by City", () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("Displays all events by default", async () => {
    const events = await page.$$(".event");
    expect(events.length).toBeGreaterThan(0);
  });

  test("Filters events by city", async () => {
    await page.type("#city-search", "Berlin");
    const suggestions = await page.$$(".suggestion");
    await suggestions[0].click();
    const events = await page.$$(".event");
    expect(events.length).toBeGreaterThan(0);
  });
});
