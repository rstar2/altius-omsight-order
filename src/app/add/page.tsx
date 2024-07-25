import { Card, CardBody, CardFooter, HStack } from "@chakra-ui/react";

import Link from "@/components/Link";
import OrderAddEditForm from "@/components/OrderAddEditForm";
import { ServerSideComponentProp } from "@/lib/types";
import { getFirstOrderForUser, getOrderVariant } from "@/lib/google-sheet.actions";

export default async function PageAdd({ searchParams }: ServerSideComponentProp) {
  const email = searchParams.email as string;

  const order = await getFirstOrderForUser(email);
  const orderVariant = await getOrderVariant();
  const name = order?.name;

  return (
    <Card>
      <CardBody>
        <OrderAddEditForm orderVariant={orderVariant} order={{ email, name }} />
      </CardBody>

      <CardFooter>
        <HStack>
          <Link href="/">Home</Link>
          {email && <Link href={`/orders?email=${email}`}>Orders</Link>}
        </HStack>
      </CardFooter>
    </Card>
  );
}
