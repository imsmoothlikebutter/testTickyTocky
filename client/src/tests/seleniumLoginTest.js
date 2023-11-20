const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async () => {
  // ChromeOptions to run in headless mode
  let chromeOptions = new chrome.Options();
  chromeOptions.addArguments("--headless"); // Set Chrome to run in headless mode
  chromeOptions.addArguments("--no-sandbox"); // Disable the sandbox for running as root

  // Initialize the WebDriver
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  try {
    // Navigate to your React application's login page
    await driver.get("https://gracious-kare.cloud/login");

    // Wait for the email input to be visible
    await driver.wait(until.elementLocated(By.id("login-form_email")), 10000);

    // Find elements
    const emailInput = await driver.findElement(By.id("login-form_email"));
    const passwordInput = await driver.findElement(
      By.id("login-form_password")
    );
    const loginButton = await driver.findElement(By.className("login-button"));

    // Fill out the login form
    await emailInput.sendKeys("sleepy2@gmail.com");
    await passwordInput.sendKeys("Password@12345");
    await loginButton.click();

    // Wait for navigation to the account page
    await driver.wait(until.urlContains("/account"), 10000);

    // Check if the login was successful
    let currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/account")) {
      console.log("Login was successful.");
    } else {
      console.log("Login failed.");
    }
  } catch {
    console.log("Login failed.");
  } finally {
    // Close the WebDriver
    await driver.quit();
  }
})();
