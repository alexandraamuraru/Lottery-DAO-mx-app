import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

export const useEndedLotteries = (adresa) => {
  const { address } = useGetAccountInfo();
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEndedLotteries = useCallback(async () => {
    const apiUrl = `https://devnet-api.multiversx.com/vm-values/query`;
    const payload = {
      scAddress: 'erd1qqqqqqqqqqqqqpgqhdc2aqx208zlwl7wr9rvg0awexl4hk53vwqqt9fsac', // Replace with your smart contract address
      funcName: 'getEndedLotteries',
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
        const endedLotteries = [];
        const decodedData = Buffer.from(returnData[0], 'base64'); // Decode base64 to buffer
        console.log("Decoded Data (Buffer):", decodedData);

        let i = 0;
        while (i < decodedData.length) {
          const bufferLength = decodedData.readUInt32BE(i);
          i += 4;
          const bufferBytes = decodedData.slice(i, i + bufferLength);
          endedLotteries.push(bufferBytes.toString('utf8'));
          i += bufferLength;
        }
      
        setLotteries(endedLotteries);
      } else {
        console.log("No valid return data found.");
        setLotteries([]);
      }
    } catch (error) {
      console.error('Error fetching ended lotteries:', error.response || error.message);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchEndedLotteries();
    }
  }, [address, fetchEndedLotteries]);

  return { lotteries, loading, error };
};

export default useEndedLotteries;