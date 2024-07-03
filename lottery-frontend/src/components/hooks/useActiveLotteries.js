import React, { useState, useEffect, useCallback, act } from 'react';
import axios from 'axios';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

export const useActiveLotteries = (adresa) => {
  const { address } = useGetAccountInfo();
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveLotteries = useCallback(async () => {
    const apiUrl = `https://devnet-api.multiversx.com/vm-values/query`;
    const payload = {
      scAddress: 'erd1qqqqqqqqqqqqqpgqhdc2aqx208zlwl7wr9rvg0awexl4hk53vwqqt9fsac', // Replace with your smart contract address
      funcName: 'getActiveLotteries',
      args: [],
      caller: address
    };

    try {
      const response = await axios.post(apiUrl, payload);
      console.log("Full API Response:", response.data);

      // Ensure the returnData is correctly accessed
      const returnData = response.data.data.data ? response.data.data.data.returnData : [];
      console.log("Return Data:", returnData);

      if (Array.isArray(returnData) && returnData.length > 0 && returnData[0] !== '') {
        const activeLotteries = [];
        const decodedData = Buffer.from(returnData[0], 'base64'); // Decode base64 to buffer
        console.log("Decoded Data (Buffer):", decodedData);

        let i = 0;
        while (i < decodedData.length) {
          const bufferLength = decodedData.readUInt32BE(i);
          i += 4;
          const bufferBytes = decodedData.slice(i, i + bufferLength);
          activeLotteries.push(bufferBytes.toString('utf8'));
          i += bufferLength;
        }
      
        setLotteries(activeLotteries);
      } else {
        console.log("No valid return data found.");
        setLotteries([]);
      }
    } catch (error) {
      console.error('Error fetching active lotteries:', error.response || error.message);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchActiveLotteries();
    }
  }, [address, fetchActiveLotteries]);

  return {lotteries, loading, error};
};

export default useActiveLotteries;
