import { Button } from "@/app/[locale]/components/ui/button";
import { Input } from "@/app/[locale]/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/app/[locale]/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const Search = async () => {
  const locale = await getLocale();
  const categories = await getAllCategories(locale);
  const t = await getTranslations("Search");

  return (
    <form action={`/${locale}/search`} method="GET">
      <div className="flex w-full md:max-w-7xl max-w-sm items-center space-x-2">
        {/* <Select name="category" defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="all">
              {t("all")}
            </SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <Input
          name="q"
          type="text"
          placeholder={t("placeholder")}
          className="md:w-[100px] lg:w-[300px]"
        />

        <Button type="submit">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;