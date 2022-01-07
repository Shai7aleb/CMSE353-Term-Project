import React from "react";
import { chakra, Box, Flex, useColorModeValue } from "@chakra-ui/react";

function ProductItem({ id, productName, productPrice }) {
  return (
    <Box w={2 / 3} p={{ base: 4, md: 4 }}>
      <chakra.h1
        fontSize="2xl"
        fontWeight="bold"
        color={useColorModeValue("gray.800", "white")}
      >
        {productName}
      </chakra.h1>

      <chakra.p
        mt={2}
        fontSize="sm"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit In odit
      </chakra.p>

      <Flex mt={3} alignItems="center" justifyContent="space-between">
        <chakra.h1 color="white" fontWeight="bold" fontSize="lg">
          {productPrice}
        </chakra.h1>
        <chakra.button
          px={2}
          py={1}
          bg="white"
          fontSize="xs"
          color="gray.900"
          fontWeight="bold"
          rounded="lg"
          textTransform="uppercase"
          _hover={{
            bg: "gray.200",
          }}
          _focus={{
            bg: "gray.400",
          }}
        >
          Buy
        </chakra.button>
      </Flex>
    </Box>
  );
}

export default ProductItem;
