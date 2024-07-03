import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import BigNumber from 'bignumber.js';
import { Address } from '@multiversx/sdk-core/out';
import './TokenHolders.css';

const TokenHolders = () => {
  const { address } = useGetAccountInfo();
  const [tokenHolders, setTokenHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodeBase64 = (base64) => {
    return Buffer.from(base64, 'base64');
  };

  const deserializeAddresses = (byteArray) => {
    const addresses = [];
    for (let i = 0; i < byteArray.length; i += 32) {
      const addressBytes = byteArray.slice(i, i + 32);
      const addressHex = Buffer.from(addressBytes).toString('hex');
      const addressBytes2 = Buffer.from(addressHex, 'hex');
      const decodedAddress = new Address(addressBytes2);
      const address = decodedAddress.bech32();
      addresses.push(address);
    }
    return addresses;
  };

  const deserializeBigNumbers = (byteArray) => {
    const bigNumbers = [];
    let i = 0;
    while (i < byteArray.length) {
      const length = byteArray.readUInt32BE(i);
      i += 4;
      const bigNumberBytes = byteArray.slice(i, i + length);
      const bigNumber = new BigNumber(bigNumberBytes.toString('hex'), 16);
      bigNumbers.push(bigNumber.toString(10));
      i += length;
    }
    return bigNumbers;
  };

  const decodeMultiValue2 = (response) => {
    const decodedAddresses = decodeBase64(response[0]);
    const decodedBigNumbers = decodeBase64(response[1]);

    const addresses = deserializeAddresses(decodedAddresses);
    const bigNumbers = deserializeBigNumbers(decodedBigNumbers);

    return {
      addresses: addresses,
      bigNumbers: bigNumbers,
    };
  };

  const fetchTokenHolders = useCallback(async () => {
    const apiUrl = `https://devnet-api.multiversx.com/vm-values/query`;
    const payload = {
      scAddress: 'erd1qqqqqqqqqqqqqpgqnzjjeygr897tnfgvyfcl4tvsc4ycmqrnvwqqd8jdvt',
      funcName: 'getTokenHolders',
      args: [],
      caller: address
    };

    try {
      const response = await axios.post(apiUrl, payload);
      console.log("Full API Response:", response.data);

      // Ensure the returnData is correctly accessed
      const returnData = response.data.data.data ? response.data.data.data.returnData : [];
      console.log("Return Data:", returnData);

      if (Array.isArray(returnData) && returnData.length > 0) {
        const decodedData = decodeMultiValue2(returnData);
        const tokenHolders = decodedData.addresses.map((address, index) => ({
          address,
          balance: decodedData.bigNumbers[index],
        }));

        setTokenHolders(tokenHolders);
      } else {
        console.log("No valid return data found.");
        setTokenHolders([]);
      }
    } catch (error) {
      console.error('Error fetching token holders:', error.response || error.message);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchTokenHolders();
    }
  }, [address, fetchTokenHolders]);

  return (
    <div className="token-holders">
      <h1>DAO Members</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {JSON.stringify(error)}</p>}
      {!loading && tokenHolders.length === 0 && <p>No token holders found.</p>}
      {tokenHolders.length > 0 && (
        <ul>
          {tokenHolders.map((tokenHolder, index) => (
            <li key={index}>
                <div>
              <span className="address">Address: {tokenHolder.address}</span>
              <span className="balance">Balance: {tokenHolder.balance}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TokenHolders;
