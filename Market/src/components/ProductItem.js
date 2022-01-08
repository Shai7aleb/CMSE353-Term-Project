import React from "react";
import { chakra, Box, Flex, useColorModeValue } from "@chakra-ui/react";

function ProductItem({ id, productName, productPrice, purchaseFunction, owned, purchased}) {
  return (
    <Box w={2 / 3} p={{ base: 4, md: 4 }}>
      <chakra.h1
        fontSize="2xl"
        fontWeight="bold"
        color={useColorModeValue("gray.800", "white")}
      >
        {productName}
      </chakra.h1>

      <Flex mt={3} alignItems="center" justifyContent="space-between">
        <chakra.h1 color="white" fontWeight="bold" fontSize="lg">
          {window.web3.utils.fromWei(productPrice,'ether') + " ETH"}
        </chakra.h1>
        <chakra.button
          px={2}
          py={1}
          bg={owned?"gray":"white"}
          fontSize="xs"
          color="gray.900"
          fontWeight="bold"
          rounded="lg"
          textTransform="uppercase"
          _hover={owned? null:{
            bg: "gray.200",
          }}
          _focus={owned? null:{
            bg: "gray.400",
          }}
          name = {id}
          value = {productPrice}            
          onClick={owned? null:
            (event) => {
                purchaseFunction(event.target.name,event.target.value)
            }
          }
        >
            {owned ? (purchased?'Owned':'Selling') : 'Buy'}
        </chakra.button>
      </Flex>
    </Box>
  );
}

export default ProductItem;
