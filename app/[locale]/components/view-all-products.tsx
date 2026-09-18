import { Button } from "./ui/button";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

const ViewAllProduct = async () => {
  const t = await getTranslations("Homepage");

  return (
    <div className="flex justify-center items-center my-8">
      <Button  className="px-8 py-4 text-lg font-semibold">
        <Link href={`/search`}>
          {t("viewAllProducts")}
        </Link>
      </Button>
    </div>
  );
};

export default ViewAllProduct;