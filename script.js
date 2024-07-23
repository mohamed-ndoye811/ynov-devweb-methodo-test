const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error("Usage: node script.js <input-file> <output-file>");
  process.exit(1);
}

console.log(`Input file: ${inputFile}`);

const series = {};
const vies = {};
const lastDate = {};
const users = {};

const debugUser = "1e481168-243e-4e64-87d3-a2b5085a77a2";

const initialVies = 2;
const maxVies = 2;

let lineCount = 0;
const maxLines = 40;

// Convert timestamp to yyyy-mm-dd
function convertTimestamp(timestamp) {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toISOString().split("T")[0];
}

// Calculate the difference in days between two dates
function dateDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
}

const csvWriter = createCsvWriter({
  path: outputFile,
  alwaysQuote: true,
  header: [
    { id: "Date", title: "Date" },
    { id: "Niveau", title: "Niveau" },
    { id: "Allonge", title: "Allonge" },
    { id: "Assis", title: "Assis" },
    { id: "SessionID", title: "SessionID" },
    { id: "formattedDate", title: "formattedDate" },
    { id: "serie", title: "serie" },
  ],
});

const results = [];

// Clean up CSV data
function cleanCsvData(data) {
  return data
    .replace(/\r/g, "") // Remove carriage returns
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing whitespace
}

// Read and process the input CSV
fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    const dateTs = cleanCsvData(row.Date);
    const niveau = cleanCsvData(row.Niveau);
    const assis = cleanCsvData(row.Assis);
    const allonge = cleanCsvData(row.Allonge);
    const sessionid = cleanCsvData(row.SessionID);
    const formattedDate = cleanCsvData(row.formattedDate);
    const convertedDate = convertTimestamp(dateTs);

    if (!users[sessionid]) {
      users[sessionid] = {
        series: 0,
        vies: initialVies,
        lastDate: convertedDate,
        assis: 0,
        allonge: 0,
      };
    }

    const diffDays = dateDiff(convertedDate, users[sessionid].lastDate);

    // Check if user skipped more than 3 days
    if (diffDays > 3) {
      users[sessionid].id = 0;
      users[sessionid].vie = initialVies;
      users[sessionid].dayCompleted = false;
    } else if (diffDays > 1) {
      users[sessionid].vies -= diffDays - 1;
      users[sessionid].dayCompleted = false;
    } else if (diffDays === 0) {
      if (assis.toLowerCase() === "true" && users[sessionid].assis < 2) {
        users[sessionid].assis += +niveau;
      }

      if (allonge.toLowerCase() === "true" && users[sessionid].allonge < 2) {
        users[sessionid].allonge += +niveau;
      }
    } else {
      users[sessionid].assis = 0;
      users[sessionid].allonge = 0;
      users[sessionid].dayCompleted = false;
    }

    users[sessionid].lastDate = convertedDate;

    if (
      users[sessionid].assis == 2 &&
      users[sessionid].allonge == 2 &&
      !users[sessionid].dayCompleted
    ) {
      users[sessionid].series += 1;
      users[sessionid].dayCompleted = true;
      if (users[sessionid].series % 5 === 0) {
        users[sessionid].vies = Math.min(users[sessionid].vies + 1, maxVies);
      }
    }

    if (
      assis.toLowerCase() === "true" &&
      allonge.toLowerCase() === "true" &&
      niveau === "2" &&
      !users[sessionid].dayCompleted
    ) {
      users[sessionid].series += 1;
      users[sessionid].dayCompleted = true;
    }

    if (
      !niveau &&
      assis.toLowerCase() === "false" &&
      allonge.toLowerCase() === "false"
    ) {
      users[sessionid].vies -= 1;
    }

    if (users[sessionid].vies < 0) {
      users[sessionid].series = 0;
      users[sessionid].vies = initialVies;
    }

    if (users[sessionid].series % 5 === 0) {
      users[sessionid].vies = Math.min(users[sessionid].vies + 1, maxVies);
    }

    results.push({
      Date: cleanCsvData(row.Date),
      Niveau: cleanCsvData(row.Niveau),
      Allonge: cleanCsvData(row.Allonge),
      Assis: cleanCsvData(row.Assis),
      SessionID: cleanCsvData(row.SessionID),
      formattedDate: cleanCsvData(row.formattedDate),
      serie: users[sessionid].series,
    });
  })
  .on("end", () => {
    csvWriter.writeRecords(results).then(() => {
      console.log("The CSV file was written successfully");
    });
  })
  .on("error", (error) => {
    console.error(error);
  });
