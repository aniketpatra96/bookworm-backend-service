import { CronJob } from "cron";
import https from "https";

const job = new CronJob("0 */14 * * * *", () => {
  console.log("⏱️ Pinging server to prevent idling...");

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.error("❌ API_URL is not defined in environment variables.");
    return;
  }

  https
    .get(apiUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Pinged successfully to prevent idling.");
      } else {
        console.log(
          `⚠️ Failed to ping server. Status Code: ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error("🚨 Error while pinging the server:", err.message);
    });
});

export default job;
