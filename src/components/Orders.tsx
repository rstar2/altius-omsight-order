"use client";

import { useTransition, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/navigation";
import { Text, List, ListItem, Divider, IconButton, HStack, Spacer, useToast } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

import { Order, User, RowA1Address } from "@/lib/types";
import { deleteOrder } from "@/lib/google-sheet.actions";
import { OrderDeleteDialog } from "./OrderDeleteDialog";

export default function Orders({ orders }: { orders: (Order & User & RowA1Address)[] }) {
  const router = useRouter();
  const [listRef] = useAutoAnimate();
  const [isPendingDelete, startTransitionDelete] = useTransition();
  const toast = useToast();
  const [orderToDelete, setOrderToDelete] = useState<Order & RowA1Address>();

  if (orders.length === 0) return <Text>No orders yet</Text>;

  const handleDeleteOrder = (order: Order & RowA1Address) => {
    startTransitionDelete(async () => {
      const { error } = (await deleteOrder({ id: order.id, a1Row: order.a1Row })) ?? {};
      if (error) {
        toast({
          title: "Delete failed.",
          description: error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // this will "refresh" the page, while this client-component is not-recreated
        // e.g. it will just refresh the parent PageOrders component and refresh the data
        router.refresh();
      }
    });
  };

  const name = orders[0].name;
  return (
    <>
      <Text>Orders for {name}</Text>
      <Divider my={3} />
      <List ref={listRef}>
        {orders.map((order) => (
          <ListItem key={order.a1Row}>
            <HStack spacing={2}>
              <Text>{order.model}</Text>
              <Spacer />
              <IconButton
                aria-label="Edit"
                icon={<MdEdit />}
                variant="ghost"
                isRound
                onClick={() => router.push(`/edit?email=${order.email}&a1Row=${order.a1Row}`)}
                isDisabled={isPendingDelete}
              />
              <IconButton
                aria-label="Delete"
                icon={<MdDelete />}
                variant="ghost"
                isRound
                colorScheme="red"
                onClick={() => setOrderToDelete(order)}
                isLoading={isPendingDelete}
                isDisabled={isPendingDelete}
              />
            </HStack>
          </ListItem>
        ))}
      </List>

      <OrderDeleteDialog
        isOpen={!!orderToDelete}
        onClose={(confirmed) => {
          setOrderToDelete(undefined);
          if (confirmed) handleDeleteOrder(orderToDelete!);
        }}
      />
    </>
  );
}
