const puppeteer = require("puppeteer");
const cron = require("node-cron");
const path = require("path");

// Naukri credentials
const EMAIL = "ayanchakraborty194@gmail.com";
const PASSWORD = "Ayan123#";

// Resume file path (update path if needed)
const RESUME_PATH = path.resolve(__dirname, "Resume", "Resume of Ayan Chakraborty");

// Naukri profile URL
const PROFILE_URL = "https://www.naukri.com/mnjuser/profile";

// Function to update profile and upload resume
async function updateProfileAndResume() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Go to Naukri login page
    await page.goto("https://www.naukri.com/nlogin/login");

    // Enter email and password
    await page.type("#usernameField", EMAIL, { delay: 100 });
    await page.type("#passwordField", PASSWORD, { delay: 100 });

    // Click on login button and wait for navigation
    await Promise.all([
      page.click(".waves-effect"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    console.log("Logged in successfully ✅");

    // Go to profile page
    await page.goto(PROFILE_URL, { waitUntil: "networkidle2" });

    // Click on "Update" button
    await page.click('button[title="Update Profile"]');
    console.log("Profile updated successfully ✅");

    // Upload the resume
    console.log("Uploading resume...");
    const fileInput = await page.waitForSelector('input[type="file"]', {
      visible: true,
    });
    await fileInput.uploadFile(RESUME_PATH);

    // Wait for upload completion
    await page.waitForTimeout(5000); // Add delay to ensure upload is complete
    console.log("Resume uploaded successfully ✅");

  } catch (error) {
    console.error("Error during profile update or resume upload:", error);
  } finally {
    await browser.close();
  }
}

// Schedule to run at 10 AM daily
cron.schedule("0 10 * * *", () => {
  console.log("Running profile update and resume upload at 10 AM...");
  updateProfileAndResume();
});

// Run immediately on start (optional)
updateProfileAndResume();
