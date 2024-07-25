"use server";

import timers from "node:timers/promises";

import { v4 as uuidv4 } from "uuid";
import { GoogleSpreadsheetCellErrorValue } from "google-spreadsheet";
import { redirect } from "next/navigation";

import goggleSheetAPI, { UserOrderA1Address } from "./google-sheet";
import { Order, OrderAddSchema, User, RowA1Address } from "./types";

/**
 * NOTE: Used from useFormState(), so the first argument is the "previous/initial" state of the form
 */
export async function addOrder(_prevState: any, formData: FormData) {
  // simulate a longer delay
  // await timers.setTimeout(5000);

  // Validate form fields using Zod
  const validatedFields = OrderAddSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    model: formData.get("model"),
    size: formData.get("size"),
    color: formData.get("color"),
    extra: formData.get("extra"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const orderData = validatedFields.data;

  const orderRowData = [uuidv4(), orderData.name, orderData.email, orderData.model, orderData.size, orderData.color];
  if (orderData.extra) orderRowData.push(orderData.extra);

  try {
    await goggleSheetAPI.load();
    await goggleSheetAPI.sheet.addRow(orderRowData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : `Cannot add new order for ${orderData.email}` };
  }

  redirect(`/orders?email=${validatedFields.data.email}`);
}

/**
 * NOTE: Used from useFormState(), so the first argument is the "previous/initial" state of the form
 *
 * NOTE: The row's id and a1Row is passed as hidden input
 */
export async function editOrder(_prevState: any, formData: FormData) {
  // simulate a longer delay
  // await timers.setTimeout(5000);

  const id = formData.get("id");
  const a1Row = formData.get("a1Row");
  if (!id || "string" !== typeof id) return { error: new Error("Cannot edit order - no valid id ") };
  if (!a1Row || "string" !== typeof a1Row) return { error: new Error("Cannot edit order - no valid A1 address ") };

  // Validate form fields using Zod
  const validatedFields = OrderAddSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    model: formData.get("model"),
    size: formData.get("size"),
    color: formData.get("color"),
    extra: formData.get("extra"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const orderData = validatedFields.data;

  try {
    await goggleSheetAPI.load();

    const currentId = goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.ID + a1Row).value;
    if (currentId !== id)
      throw new Error(
        `Order with id ${id} is not on the correct A1 address any more - sheet has changed in the meantime`,
      );

    goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.Name + a1Row).value = orderData.name;
    goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.Email + a1Row).value = orderData.email;
    goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.Model + a1Row).value = orderData.model;
    goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.Size + a1Row).value = orderData.size;
    goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.Color + a1Row).value = orderData.color;
    goggleSheetAPI.sheet.getCellByA1(UserOrderA1Address.Extra + a1Row).value = orderData.extra;

    // saves all cells in one API call
    await goggleSheetAPI.sheet.saveUpdatedCells();
  } catch (e) {
    return { error: e instanceof Error ? e.message : `Cannot edit order ${a1Row}` };
  }

  redirect(`/orders?email=${validatedFields.data.email}`);
}

export async function deleteOrder({ id, a1Row }: Pick<Order, "id"> & RowA1Address) {
  // simulate a longer delay
  //   await timers.setTimeout(5000);

  try {
    await goggleSheetAPI.load();
    const rows = await goggleSheetAPI.sheet.getRows();
    const row = rows.find((row) => row.rowNumber === a1Row);
    if (!row) throw new Error(`No order with A1 address A${a1Row}`);

    // validate if sheet has been changed in the meantime
    // @ts-expect-error (use the private row._rawData[] as it's the only way to get the value of a cell by index)
    const currentId = row._rawData[0];
    if (currentId !== id)
      throw new Error(
        `Order with id ${id} is not on the correct A1 address any more - sheet has changed in the meantime`,
      );

    await row.delete();
  } catch (e) {
    return { error: e instanceof Error ? e.message : `Cannot delete order with A1 address A${a1Row}` };
  }
}

export async function getOrderFor(a1Row: RowA1Address["a1Row"]) {
  try {
    await goggleSheetAPI.load();

    return getOrder(a1Row);
  } catch (e) {
    return undefined;
  }
}

export async function getFirstOrderForUser(email: string) {
  try {
    await goggleSheetAPI.load();

    let row = 1;
    let order;

    while ((order = getOrder(row))) {
      if (order.email === email) return order;
      row++;
    }
  } catch (e) {
    // discard, no need to "return" error
  }
  return undefined;
}

export async function getOrdersForUser(email: string) {
  try {
    await goggleSheetAPI.load();
    // NOTE: the first row with index 0 is the "header" (name, Email, Model, Size, Color, Extra)
    // NOTE: this same row is A1-xxx in a1Address , e.g. getCell(0, 0) === getCellByA1("A1")

    let row = 1;
    let order;

    const orders: (Order & User & RowA1Address)[] = [];
    while ((order = getOrder(row))) {
      if (order.email === email) orders.push(order);
      row++;
    }
    return { orders };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(`Cannot get orders for ${email}`) };
  }
}

function getOrder(a1Row: RowA1Address["a1Row"]): (Order & User & RowA1Address) | undefined {
  const id = getCellValue(UserOrderA1Address.ID + a1Row, true);
  if (!id) return undefined;
  return {
    id,
    a1Row,
    name: getCellValue(UserOrderA1Address.Name + a1Row),
    email: getCellValue(UserOrderA1Address.Email + a1Row),

    model: getCellValue(UserOrderA1Address.Model + a1Row),
    size: getCellValue(UserOrderA1Address.Size + a1Row),
    color: getCellValue(UserOrderA1Address.Color + a1Row),
    extra: getCellValue(UserOrderA1Address.Extra + a1Row, true),
  };
}

function getCellValue<T extends string | number = string>(a1Address: string, optional: true): T | undefined;
function getCellValue<T extends string | number = string>(a1Address: string, optional?: false): T;
function getCellValue<T extends string | number = string>(a1Address: string, optional?: boolean): T | undefined {
  const value = goggleSheetAPI.sheet.getCellByA1(a1Address).value;
  if (value instanceof GoogleSpreadsheetCellErrorValue) throw new Error(value.message);

  if (value !== null) return value as T;

  if (!optional) throw new Error(`No value in ${a1Address}`);

  return undefined;
}
