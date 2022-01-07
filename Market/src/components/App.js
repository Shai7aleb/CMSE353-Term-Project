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
      const marketplace = await new web3.eth.Contract(abi, address);
      // const productCount = await marketplace.methods.productCount().call();
      // console.log(productCount);

      setMarketContract(marketplace);
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

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Navbar accountAddress={account} />
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route
            path="addproduct"
            element={<Form marketContract={marketContract} account={account} />}
          />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default App;
