import Orders from "@/components/Orders";
import googleSheet from "@/lib/google-sheet";

export default function PageResults() {
  const spreadsheetId = googleSheet.spreadsheetId;

  return (
    <main>
      <div>
        <Orders />
        <p>
          Results - Spreadsheet : <code>{spreadsheetId}</code>
        </p>
      </div>
    </main>
  );
}
