import { useEffect } from "react";

export const useRender = (name: string) => {
  useEffect(() => {
    console.log(`MOUNTED ${name}`);
    return () => console.log(`UNMOUNTED ${name}`);
  }, []);

  useEffect(() => {
    console.log(`RENDERED ${name}`);
  });
};
