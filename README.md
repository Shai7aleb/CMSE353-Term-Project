### CMSE353-Term-Project (Decetralized marketplace) <br>
The system being done here is a decentralized marketplace on the internet. There are 2 types of users, the buyer and the seller. The seller can add a product to sell while the buyer can purchase any listed product. The system mainly relies 
on distributed blockchain technology which allows it to be decentralized instead of it being owned and controlled by a single entity (centralized network)<br>
This system uses the Ethereum smart contracts to run the marketplace. A smart contract is a small program that is stored on the blockchain that is used to automatically transfer funds (ether) from a set of input accounts to a set of receiving accounts based on some condition that is determined by this program. 
In our system we have contracts that allow people to add products to the blockchain as well as purchase product from it 

## setup:<br>
#dependancies:<br>
Install Node js (can be installed from https://nodejs.org/en/ ) <br>

Open command line interface and type ‘npm install truffle -g’ <br>

Install ganache from https://trufflesuite.com/ganache/  <br>

Install Metamask extension on a supported web browser (e.g: chrome, firefox,…) <br>

#usage:<br>
Open ganache and select the new workspace option,then select the 'truffle-config.js' file. <br>

After creating the workspace, note the RPC server url. <br>

Open your commandline; cd into the project directory and type 'truffle migrate' <br>

Open metamask on your browser and create an account. <br>

Then in the top of the metamask menu, next to the account circle picture, make sure the network matches the RPC url noted in step 2. 
If it doesn't then click the account circle picture and select settings -> networks -> add networks then enter the information required <br>

In order to link metamask to ganache, click the account circle picture and click on 'import account'. In the textbox that will appear,
paste the private key that you can get from one of the accounts in ganache by clicking the key icon next to it. You can import as many accounts as you want <br>

Back in the commadline, enter npm install followed by 'npm start'. The website should automatically open in your browser.  <br>
