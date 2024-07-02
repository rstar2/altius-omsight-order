# Altius Omsight Orders

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
```

## Deploy on Vercel

...

### Notes

- Create a Google SpreadSheet
  1. Create a Google project and all it access the spreadsheet
     - Enable the `Google Sheets API`
     - Create a Service Account (as owner) and API keys for it  - e.g download the JSON file
  2. Create a spreadsheet in any Google accounts
     - Share it with the upper Service Account email
  3. Use `google-auth-library` and the `google-spreadsheet` libs to operate over the spreadsheet from Node.js.
     - Need the Service Account email, the private key (both from the JSON key file) and the ID of the spreadsheet.
