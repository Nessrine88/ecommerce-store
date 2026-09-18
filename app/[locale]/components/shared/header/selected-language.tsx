"use client";

import { usePathname, useRouter } from "@/navigation";
import { useLocale } from "next-intl";

const SelectedLanguage = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const getSelectedValue = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = e.target.value;

    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div>
      <select
        name="language"
        id="language"
        onChange={getSelectedValue}
        value={locale}
      >
        <option value="en">en</option>
        <option value="fr">fr</option>
        <option value="ar">ar</option>
      </select>
    </div>
  );
};

export default SelectedLanguage;