import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import ProductItem from "./ProductItem";

//const data = [
//  {
//    index: 0,
//    productName: "Apple company",
//    price: "1",
//  },
//  {
//    index: 1,
//    productName: "TrashBook",
//    price: "2",
//  },
//  {
//    index: 2,
//    productName: "Microsoft",
//    price: "0.0001",
//  },
//  {
//    index: 3,
//    productName: "TrashBook",
//    price: "2",
//  },
//  {
//    index: 4,
//    productName: "TrashBook",
//    price: "2",
//  },
//];

function ProductPage(props) {
  return (
    <SimpleGrid columns={4} spacing={5}>
      {props.data.map((e, i) => {
        return (
          <ProductItem
            key={e.id}
            id={e.id}
            productName={e.name}
            productPrice={e.price}
            purchaseFunction = {props.purchFunc}
            owned = {props.currentUser == e.owner}
            purchased = {e.purchased}
          />
        );
      })}
    </SimpleGrid>
  );
}

export default ProductPage;
