"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FormControl, FormLabel, FormErrorMessage, VStack, Input, Select, Button, useToast } from "@chakra-ui/react";

import { addOrder, editOrder } from "@/lib/google-sheet.actions";
import { Order, OrderVariant, RowA1Address, User } from "@/lib/types";

export default function OrderAddEditForm({
  orderVariant,
  order,
}: {
  orderVariant: OrderVariant;
  order?: Partial<Order & User & RowA1Address>;
}) {
  // id and a1Row always go together, the id is used only for protection,
  // so that the correct order to be edited (if for instance in the meantime the sheet has been chnaged)
  const isEdit = !!order?.id && !!order?.a1Row;

  const toast = useToast();
  const [state, dispatch] = useFormState(isEdit ? editOrder : addOrder, undefined);

  const error = state?.error;
  useEffect(() => {
    if (error)
      toast({
        title: isEdit ? "Edit failed." : "Add failed",
        //   description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
  }, [isEdit, error, toast]);

  // don't allow to change email and name if they are known - even when editing

  return (
    // NOTE: the form is validated only in server, no need to pre-validate it here,
    //   as then which errors to show? - those from client or later from the server-action and useFormState()
    <form action={dispatch}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!state?.errors?.email}>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" defaultValue={order?.email} readOnly={/* !isEdit &&  */ !!order?.email} />
          {state?.errors?.email && <FormErrorMessage>{state.errors.email[0]}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!state?.errors?.name}>
          <FormLabel>Name</FormLabel>
          <Input name="name" defaultValue={order?.name} readOnly={/* !isEdit &&  */ !!order?.name} />
          {state?.errors?.name && <FormErrorMessage>{state.errors.name[0]}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!state?.errors?.model}>
          <FormLabel>Model</FormLabel>
          {/* <Input name="model" defaultValue={order?.model} /> */}
          <Select name="model" defaultValue={order?.model}>
            {orderVariant.models.map(({ name, price }) => (
              <option value={name} key={name}>
                {name} - ${price}
              </option>
            ))}
          </Select>
          {state?.errors?.model && <FormErrorMessage>{state.errors.model[0]}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!state?.errors?.size}>
          <FormLabel>Size</FormLabel>
          {/* <Input name="size" defaultValue={order?.size} /> */}
          <Select name="size" defaultValue={order?.size}>
            {orderVariant.sizes.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </Select>
          {state?.errors?.size && <FormErrorMessage>{state.errors.size[0]}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!state?.errors?.color}>
          <FormLabel>Color</FormLabel>
          {/* <Input name="color" defaultValue={order?.color} /> */}
          <Select name="color" defaultValue={order?.color}>
            {orderVariant.colors.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </Select>
          {state?.errors?.color && <FormErrorMessage>{state.errors.color[0]}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!state?.errors?.extra}>
          <FormLabel>Extra</FormLabel>
          <Input name="extra" defaultValue={order?.extra} />
          {state?.errors?.extra && <FormErrorMessage>{state.errors.extra[0]}</FormErrorMessage>}
        </FormControl>

        {isEdit && <input type="hidden" name="id" value={order.id} />}
        {isEdit && <input type="hidden" name="a1Row" value={order.a1Row} />}

        <SubmitButton isEdit={isEdit} />
      </VStack>
    </form>
  );
}
// NOTE: the useFormState() (and the new useActionState) is not returning any more
// the "pending" status as currently in the ts-docs,
// so explicit useFormStatus() in a child component has to be used
function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isDisabled={pending} isLoading={pending} loadingText={isEdit ? "Editing" : "Adding"}>
      {isEdit ? "Edit" : "Add"}
    </Button>
  );
}
