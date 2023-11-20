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
    // Navigate to your application's registration page
    await driver.get("https://gracious-kare.cloud/register");

    // Wait for the email input to be visible
    await driver.wait(until.elementLocated(By.id("email")), 10000);

    // Find elements
    let emailInput = await driver.findElement(By.id("email"));
    let passwordInput = await driver.findElement(By.id("password"));
    let confirmPasswordInput = await driver.findElement(By.id("cfmPassword"));
    let firstNameInput = await driver.findElement(By.id("f_name"));
    let lastNameInput = await driver.findElement(By.id("l_name"));
    let registerButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );

    // Fill out the registration form
    await emailInput.sendKeys("sleepy2@gmail.com");
    await passwordInput.sendKeys("Password@12345");
    await confirmPasswordInput.sendKeys("Password@12345");
    await firstNameInput.sendKeys("sleepy");
    await lastNameInput.sendKeys("head");

    // Click the "Register" button
    await registerButton.click();

    // Wait for some confirmation that registration was successful
    await driver.wait(until.urlContains("/login"), 10000);

    // Check if the registration was successful
    let currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/login")) {
      console.log("Registration was successful.");
    } else {
      console.log("Registration failed.");
    }
  } catch {
    console.log("Login failed.");
  } finally {
    await driver.quit();
  }
})();
