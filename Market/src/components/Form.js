import React, { useState, useRef } from "react";
import {
  chakra,
  Stack,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import SuccessAlert from "./SuccessAlert";

// const dataObject = {
//     productName: "",
//     productPrice:
// }

const Form = ({ marketContract, account, fetchProducts }) => {
  const [loading, setLoading] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const productNameInput = useRef(null);
  const productPriceInput = useRef(null);
  //   const [data, setData] = useState()

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    // console.log(
    //   productNameInput.current.value,
    //   productPriceInput.current.value
    // );
    const productName = productNameInput.current.value;
    const productPrice = productPriceInput.current.value;
    const productPriceInWei = window.web3.utils.toWei(
      productPrice.toString(),
      "Ether"
    );
    // console.log(productPriceInWei);
    marketContract.methods
      .createProduct(productName, productPriceInWei)
      .send({ from: account })
      .once("receipt", (receipt) => {
        // console.log(receipt);
        setLoading(false);
        setDisplaySuccess(true);
        fetchProducts();
      });
  };

  return (
    <chakra.form
      shadow="base"
      rounded={[null, "md"]}
      overflow={{ sm: "hidden" }}
      onSubmit={handleSubmit}
      mt="5%"
    >
      <Stack
        px={4}
        py={5}
        p={[null, 6]}
        bg={useColorModeValue("white", "gray.700")}
        spacing={6}
        w={"50%"}
        mx="auto"
      >
        <SimpleGrid columns={6} spacing={3}>
          {displaySuccess && (
            <FormControl as={GridItem} colSpan={[6, 6]} textAlign="center">
              <SuccessAlert />
            </FormControl>
          )}
          <FormControl as={GridItem} colSpan={[6, 4]}>
            <FormLabel
              htmlFor="product_name"
              fontSize="sm"
              fontWeight="md"
              color={useColorModeValue("gray.700", "gray.50")}
            >
              Product Name
            </FormLabel>
            <Input
              name="product_name"
              ref={productNameInput}
              mt={1}
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
            />
          </FormControl>

          <FormControl as={GridItem} colSpan={[6, 2]}>
            <FormLabel
              htmlFor="price"
              fontSize="sm"
              fontWeight="md"
              color={useColorModeValue("gray.700", "gray.50")}
            >
              Price: (ETH)
            </FormLabel>
            <Input
              type="text"
              name="price"
              id="price"
              ref={productPriceInput}
              mt={1}
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
            />
          </FormControl>

          <FormControl as={GridItem} colSpan={[6, 6]}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color={useColorModeValue("gray.700", "gray.50")}
            >
              Product Description
            </FormLabel>
            <Textarea
              placeholder="Write about the product"
              rows={6}
              name="product_description"
              id="product_description"
              mt={1}
              focusBorderColor="brand.400"
              shadow="sm"
              w="full"
              fontSize={{ sm: "sm" }}
            />
          </FormControl>

          <FormControl as={GridItem} colSpan={[6, 6]}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color={useColorModeValue("gray.700", "gray.50")}
            >
              Product image link
            </FormLabel>
            <Input
              type="text"
              name="product_img_link"
              mt={1}
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
            />
          </FormControl>

          <FormControl as={GridItem} colSpan={[6, 6]} textAlign={"center"}>
            <Button
              type="submit"
              colorScheme="brand"
              _focus={{ shadow: "" }}
              fontWeight="md"
            >
              Add Product
            </Button>
          </FormControl>
          {loading && (
            <FormControl as={GridItem} colSpan={[6, 6]} textAlign="center">
              <Spinner />
            </FormControl>
          )}
        </SimpleGrid>
      </Stack>
      {/* <Box
        px={{ base: 4, sm: 6 }}
        py={3}
        bg={useColorModeValue("gray.50", "gray.900")}
        textAlign="right"
      >
      </Box> */}
    </chakra.form>
  );
};

export default Form;
