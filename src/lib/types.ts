import { z } from "zod";

export interface ServerSideComponentProp {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export type User = {
  email: string;
  name: string;
};

export type OrderVariant = {
  // model -> price
  models: {
    name: string;
    price: number;
  }[];
  // possible colors
  sizes: Size[];
  // possible colors
  colors: string[];
};

export type Order = {
  id: string;
  model: string;
  size: Size;
  color: string;
  extra?: string;
};

export type UserOrders = User & {
  orders: ReadonlyArray<Order>;
};

// here use array as enum (no reason way)
const Size = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
export type Size = (typeof Size)[number];

export const SizeSchema = z.enum(Size, {
  invalid_type_error: "Please select a size.",
});

export const EmailSchema = z.string().trim().email({
  message: "Invalid email",
});

export const OrderAddSchema = z.object({
  email: EmailSchema,
  name: z
    .string({
      invalid_type_error: "Please set a name.",
    })
    .trim()
    .min(5, {
      message: "Name must be at least 5 characters",
    }),
  model: z
    .string({
      invalid_type_error: "Please select a model.",
    })
    .trim()
    .min(1, {
      message: "Required a valid model",
    }),
  size: SizeSchema,
  color: z
    .string({
      invalid_type_error: "Please select a color.",
    })
    .trim()
    .min(1, {
      message: "Required a valid color",
    }),
  extra: z.string().optional(),
});

export type RowA1Address = {
  a1Row: number;
};
