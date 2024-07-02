import { z } from "zod";

export type User = {
  email: string;
  name: string;
};

export type Order = {
  model: string;
  size: Size;
  color: Color;
  extra?: string;
};

export type UserOrders = User & {
  orders: ReadonlyArray<Order>;
};

// here use array as enum (no reason way)
const Size = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
export type Size = (typeof Size)[number];

// here use native enum (no reason way)
export enum Color {
  Red = "Red",
  Blue = "Blue",
  Green = "Green",
  Black = "Black",
}

export const OrderAddSchema = z.object({
  email: z.string().email(),
  name: z.string({
    invalid_type_error: "Please set a name.",
  }),
  model: z.string({
    invalid_type_error: "Please select a model.",
  }),
  size: z.enum(Size, {
    invalid_type_error: "Please select a size.",
  }),
  color: z.nativeEnum(Color, {
    invalid_type_error: "Please select a color.",
  }),
  extra: z.string().optional(),
});
