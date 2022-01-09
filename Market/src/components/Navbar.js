import React from "react";

import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import Logo from "../logo.png";

import { useNavigate } from "react-router-dom";

const Navbar = ({ accountAddress }) => {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();
  let navigate = useNavigate();

  const navigateToProduct = () => {
    navigate("/");
  };
  const navigateToSeller = () => {
    navigate("/addproduct");
  };

  return (
    <React.Fragment>
      <chakra.header
        bg={bg}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <chakra.img
            src={Logo}
            alt="Logo"
            h="100px"
            w="auto"
            position="absolute"
          />
          <Flex ml="10%">
            <chakra.a
              href="/"
              title="Crypto Shop HomePage"
              display="flex"
              alignItems="center"
            ></chakra.a>
            <HStack display="flex" alignItems="center" spacing={1}>
              {/* <chakra.h3>Test</chakra.h3> */}
              <Button variant="ghost" onClick={navigateToProduct}>
                Products
              </Button>
              <Button variant="ghost" onClick={navigateToSeller}>
                Sell
              </Button>
            </HStack>
          </Flex>
          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={1}
              mr={1}
              color="brand.500"
              display={{ base: "none", md: "inline-flex" }}
            >
              <chakra.h2 fontWeight="medium">{accountAddress}</chakra.h2>
            </HStack>
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                onClick={mobileNav.onOpen}
              />

              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <CloseButton
                  aria-label="Close menu"
                  onClick={mobileNav.onClose}
                />

                <Button w="full" variant="ghost" onClick={navigateToProduct}>
                  Products
                </Button>
                <Button w="full" variant="ghost" onClick={navigateToSeller}>
                  Sell
                </Button>
              </VStack>
            </Box>
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
};

export default Navbar;
