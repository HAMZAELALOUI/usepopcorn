import { useState,useEffect } from "react";



export function useLocalStrageState(initialState,key){
  const [value, setValue] = useState(getLocalData());
  function getLocalData() {
    const storeValue = localStorage.getItem(key);
    return storeValue ? JSON.parse(storeValue) : initialState;
  }
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value,key]
  );
  return [value,setValue]
}