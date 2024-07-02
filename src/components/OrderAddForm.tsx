"use client";

import { useFormState, useFormStatus } from "react-dom";

import { addOrder } from "@/lib/google-sheet.actions";

export default function OrderAdd() {
  const [errorMessage, dispatch, isPending] = useFormState(addOrder, undefined);

  return (
    <form action={dispatch}>
      <label htmlFor="email"></label>
      <input name="email" type="email" />
      <hr />
      <button type="submit" disabled={isPending}>
        Add
      </button>

      {errorMessage && <p>{errorMessage.message}</p>}
    </form>
  );
}
