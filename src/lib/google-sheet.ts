import "server-only";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: email,
  GOOGLE_PRIVATE_KEY: key,
  GOOGLE_SHEET_ID: spreadsheetId,
} = process.env as unknown as {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
};

const serviceAccountAuth = new JWT({
  email: email,
  key: key.split(String.raw`\n`).join("\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const goggleSheet = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
export default goggleSheet;
