import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const ViewAllProduct = ({t}:any) => {
  
  return (
    <div className="flex justify-center  items-center my-8">
      <Button className="px-8 py-4 text-lg font-semibold">
        <Link href="/en/search">{t("viewAllProducts") }</Link>
      </Button>
    </div>
  );
};

export default ViewAllProduct;
