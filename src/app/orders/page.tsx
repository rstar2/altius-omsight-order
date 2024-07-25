import { redirect } from "next/navigation";
import { Card, CardBody, CardFooter, Text } from "@chakra-ui/react";

import Link from "@/components/Link";
import Orders from "@/components/Orders";
import { getOrdersForUser } from "@/lib/google-sheet.actions";
import { ServerSideComponentProp } from "@/lib/types";

export default async function PageOrders({ searchParams }: ServerSideComponentProp) {
  const email = searchParams.email;

  // email is obligatory
  if (!email) return redirect("/");

  const { error, orders } = await getOrdersForUser(email as string);

  return (
    <Card>
      <CardBody>{error ? <Text>{error.message}</Text> : <Orders orders={orders} />}</CardBody>

      <CardFooter>
        <Link href="/">Home</Link>
        <Link href={`/add?email=${email}`}>Add</Link>
      </CardFooter>
    </Card>
  );
}
