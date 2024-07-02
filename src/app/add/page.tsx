// import Image from "next/image";

import OrderAddForm from "@/components/OrderAddForm";
import googleSheet from "@/lib/google-sheet";

export default function PageAdd() {
  const spreadsheetId = googleSheet.spreadsheetId;

  return (
    <main>
      <div>
        <OrderAddForm />
      </div>
    </main>
  );
}
