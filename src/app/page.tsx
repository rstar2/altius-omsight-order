"use client";

import { useSetState } from "react-use";
import { FormControl, FormLabel, FormErrorMessage, Input, Card, CardBody, CardFooter, HStack } from "@chakra-ui/react";

import Link from "@/components/Link";
import { EmailSchema } from "@/lib/types";

export default function PageHome() {
  const [{ email, emailValidationError }, setEmailState] = useSetState({
    email: "",
    emailValidationError: "",
  });

  return (
    <Card>
      <CardBody>
        <FormControl isInvalid={!!emailValidationError}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              const errors = EmailSchema.safeParse(value).error?.flatten();
              setEmailState({
                email: value,
                emailValidationError: errors?.formErrors[0] ?? "",
              });
            }}
          />
          {emailValidationError && <FormErrorMessage>{emailValidationError}</FormErrorMessage>}
        </FormControl>
      </CardBody>

      <CardFooter>
        <HStack>
          <Link href={`/orders?email=${email}`} disabled={!email || !!emailValidationError}>
            Orders
          </Link>

          <Link href={`/add?email=${email}`} disabled={!email || !!emailValidationError}>
            Add
          </Link>
        </HStack>
      </CardFooter>
    </Card>
  );
}
