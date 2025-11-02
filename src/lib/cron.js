import cron from "cron";
import https from "https";

const job = new cron.CronJob("0 */14 * * * *", function () {
  console.log("You will see this message every 14 minutes");
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200)
        console.log("Pinged successfully to prevent idling.");
      else console.log("Failed to ping the server.", res.statusCode);
    })
    .on("error", (e) => {
      console.error("Error while pinging the server: ", e);
    });
});

export default job;
