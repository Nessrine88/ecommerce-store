'use client'

import { useParams, usePathname, useRouter  } from "next/navigation";
import React, { useState } from "react";
import { json } from "zod";

const SelectedLanguage = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
 

  const getSelectedValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
     localStorage.setItem("language",newLocale)
    const newPathname = pathname.replace(/^\/[^/]+/, `/${newLocale}`);
    router.replace(newPathname)
  };

  return (
    <div>
      <select name="language" id="language" onChange={getSelectedValue} value={params.locale as string}>
        <option value="en">en</option>
        <option value="fr">fr</option>
        <option value="ar">ar</option>
      </select>
    </div>
  );
};

export default SelectedLanguage;