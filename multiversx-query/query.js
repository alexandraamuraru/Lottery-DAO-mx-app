const axios = require('axios');

const transactionHash = "3eefd0ff0040ab78aecf8303c47c35db2bdf4a661e8db8f58b0202d110a18817"; // Replace with your transaction hash
const apiUrl = `https://devnet-api.multiversx.com/transactions/${transactionHash}`;

axios.get(apiUrl)
    .then(response => {
        const transaction = response.data;
        console.log("Transaction Data:", transaction);

        // Check if the transaction has logs and events
        if (transaction.logs && transaction.logs.events) {
            transaction.logs.events.forEach(event => {
                if (event.data) {
                    const decodedData = Buffer.from(event.data, 'base64').toString('utf8');
                    console.log("Decoded Event Data:", decodedData);
                }
            });
        } else {
            console.log("No logs or events found in the transaction.");
        }
        
        // Specifically look for returnData if available
        if(transaction.results){
            transaction.results.forEach(result => {
                if(result.data) {
                    const decodedReturnData = Buffer.from(result.data, 'base64').toString('utf8');
                    console.log("Decoded Return Data:", decodedReturnData);
                } else {
                    console.log("No return data found in the transaction.");
                }
            })
        } else {
            console.log("No results.");
        }
    })
    .catch(error => {
        console.error("Error fetching transaction:", error);
    });
