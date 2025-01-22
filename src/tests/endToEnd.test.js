import puppeteer from "puppeteer";

jest.setTimeout(30000); // Extend timeout for end-to-end tests

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
    expect(events.length).toBeGreaterThan(0); // Ensure at least one event is displayed
  });

  test("Filters events by city", async () => {
    // Type "Berlin" into the city search box
    await page.type("#city-search", "Berlin");

    // Wait for the suggestions to load and select the first one
    await page.waitForSelector(".suggestion");
    const suggestions = await page.$$(".suggestion");
    expect(suggestions.length).toBeGreaterThan(0); // Ensure suggestions are shown

    // Click the first suggestion
    await suggestions[0].click();

    // Verify that filtered events are displayed
    const events = await page.$$(".event");
    expect(events.length).toBeGreaterThan(0); // Ensure events for the selected city are displayed
  });
});
