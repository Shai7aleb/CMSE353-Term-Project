import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import ProductItem from "./ProductItem";

const data = [
  {
    index: 0,
    productName: "Apple company",
    price: "1",
  },
  {
    index: 1,
    productName: "TrashBook",
    price: "2",
  },
  {
    index: 2,
    productName: "Microsoft",
    price: "0.00001",
  },
  {
    index: 3,
    productName: "TrashBook",
    price: "2",
  },
  {
    index: 4,
    productName: "TrashBook",
    price: "2",
  },
];

function ProductPage() {
  return (
    <SimpleGrid columns={4} spacing={10}>
      {data.map((e, i) => {
        return (
          <ProductItem
            key={e.index}
            productName={e.productName}
            productPrice={e.price}
          />
        );
      })}
    </SimpleGrid>
  );
}

export default ProductPage;
