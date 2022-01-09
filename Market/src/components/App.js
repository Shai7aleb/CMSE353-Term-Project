import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

//Components
import Navbar from "./Navbar";
import Form from "./Form";
import ProductPage from "./ProductPage";

//abis
import Marketplace from "../abis/Market.json";

const colors = {
  brand: {
    50: "#ecefff",
    100: "#cbceeb",
    200: "#a9aed6",
    300: "#888ec5",
    400: "#666db3",
    500: "#4d5499",
    600: "#3c4178",
    700: "#2a2f57",
    800: "#181c37",
    900: "#080819",
  },
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ colors, config });

const App = () => {
  const [account, setAccount] = useState("");
  const [products, setProducts] = useState([]);
  const [marketContract, setMarketContract] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("No Ethereum browser detected");
    }
  };

  const fetchProducts = async () => {
    // console.log("Fetching products");
    const productCount = await marketContract.methods.productCount().call();
    let listofProducts = [];
    for (var i = 1; i <= productCount; i++) {
      const product = await marketContract.methods.products(i).call();
      // console.log(product)
      if (product.owner === account[0] || product.purchased === false) {
        //display if available for sale or owned
        listofProducts = [...listofProducts, product];
      }
    }
    setProducts(listofProducts);
  };

  const loadDataFromBlockChain = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = await Marketplace.networks[networkId];
    if (networkData) {
      const abi = Marketplace.abi;
      const address = networkData.address;

      //------------------Load a list of products from the blockchain------------------
      const marketplace = await new web3.eth.Contract(abi, address);
      setMarketContract(marketplace);
      const productCount = await marketplace.methods.productCount().call();
      let listofProducts = [];
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        // console.log(product)
        if (product.owner === accounts[0] || product.purchased === false) {
          //display if available for sale or owned
          listofProducts = [...listofProducts, product];
        }
      }
      setProducts(listofProducts);
      //------------------Finish loading the products-----------------------------
      setLoading(false);
    } else {
      // console.log(
      //   "Marketplace contract not detected to current connected network"
      // );
      alert("Marketplace contract not detected to current connected network");
    }
  };

  const initializeMain = async () => {
    await loadWeb3();
    await loadDataFromBlockChain();
  };

  useEffect(() => {
    initializeMain();
  }, []);

  const purchaseProduct = (id, price) => {
    // console.log(account , id, price)
    console.log("Purchasing product");
    setLoading(true);
    marketContract.methods
      .purchaseProduct(id)
      .send({ from: account, value: price })
      .once("receipt", (receipt) => {
        console.log("Receiving receipt");
        setLoading(false);
      })
      .catch((e) => console.log("user cancelled transaction"));
  };

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Navbar accountAddress={account} />
        <Routes>
          <Route
            path="/"
            element={
              <ProductPage
                data={products}
                purchFunc={purchaseProduct}
                currentUser={account}
              />
            }
          />
          <Route
            path="addproduct"
            element={
              <Form
                marketContract={marketContract}
                account={account}
                fetchProducts={fetchProducts}
              />
            }
          />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default App;
