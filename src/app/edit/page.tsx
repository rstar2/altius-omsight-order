import { Card, CardBody, CardFooter, Text } from "@chakra-ui/react";

import Link from "@/components/Link";
import OrderAddEditForm from "@/components/OrderAddEditForm";
import { ServerSideComponentProp } from "@/lib/types";
import { getOrderFor } from "@/lib/google-sheet.actions";

export default async function PageAdd({ searchParams }: ServerSideComponentProp) {
  const email = searchParams.email as string;
  const a1Row = searchParams.a1Row as string;

  const order = await getOrderFor(+a1Row);
  if (!order) return <Text>No such order anymore</Text>;

  if (order.email !== email) return <Text>No such user's order anymore</Text>;

  return (
    <Card>
      <CardBody>
        <OrderAddEditForm order={order} />
      </CardBody>

      <CardFooter>{email && <Link href={`/orders?email=${email}`}>Orders</Link>}</CardFooter>
    </Card>
  );
}
