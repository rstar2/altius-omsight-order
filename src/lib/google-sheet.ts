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

const API = {
  async load() {
    await goggleSheet.loadInfo();

    // load only these which will surely include all orders
    // [A-F] is for user-orders, [J-M] is for the order-variation
    await this.sheet.loadCells(`${UserOrderA1Address.ID}1:${OrderVariantA1Address.Sizes}1000`);
  },

  get sheet() {
    return goggleSheet.sheetsByIndex[0];
  },
};

export enum UserOrderA1Address {
  ID = "A",
  Name = "B",
  Email = "C",
  Model = "D",
  Size = "E",
  Color = "F",
  Extra = "G",
}

export enum OrderVariantA1Address {
  Models = "K",
  Prices = "L",
  Colors = "M",
  Sizes = "N",
}

export default API;
