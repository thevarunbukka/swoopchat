import { useState, useEffect } from "react";
import { BACKEND_URL } from "@env";

const useHTTP = (url, method, body, headers) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  console.log("body : ");
  console.log(body);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const request = await fetch(BACKEND_URL + url, {
          method: method,
          body: JSON.stringify(body),
          headers: headers,
        });
        const response = await request.json();

        console.log("status : ");
        console.log(response.status);
        setStatus(response.status);

        console.log("data : ");
        console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("error : ");
        console.log(error);
        setError(error);
        setIsLoading(false);
      }
    };
    sendRequest();
  }, [url]);

  return { status, data, error, isLoading };
};

export default useHTTP;
