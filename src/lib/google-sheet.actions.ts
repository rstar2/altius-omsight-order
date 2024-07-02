"use server";

import { OrderAddSchema } from "./types";
import { redirect } from "next/navigation";

export async function addOrder(_prevState: any, formData: FormData) {
  console.log("Add order 1");
  // Validate form fields using Zod
  const validatedFields = OrderAddSchema.safeParse({
    email: formData.get("email"),
    user: formData.get("user"),
    model: formData.get("model"),
    size: formData.get("size"),
    color: formData.get("color"),
    extra: formData.get("extra"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to Create/Add Order.",
    };
  }

  // TODO: add to the sheet

  console.log("Add order 2");
  redirect(`/results?email${validatedFields.data.email}`);
}

export async function getOrdersForUser(formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = OrderAddSchema.safeParse({
    email: formData.get("email"),
    user: formData.get("user"),
    model: formData.get("model"),
    size: formData.get("size"),
    color: formData.get("color"),
    extra: formData.get("extra"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to Create/Add Order.",
    };
  }

  // TODO: add to the sheet

  console.log("Add order");
  redirect(`/results?email${validatedFields.data.email}`);
}
