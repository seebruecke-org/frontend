import React, { useState } from "react";
import { useTranslation } from "next-i18next";

export default function Default(embed_data) {
  const { t } = useTranslation();

  const [active, setActive] = useState(false);

  return (
    <div
      className="bg-orange-800 text-white ">
      {active && (
        <div dangerouslySetInnerHTML={{ __html: embed_data.html }}></div>
      )}
      {!active && (
        <div className="px-8 md:px-16 md:py-16">
          <h2 className="block font-brezel text-xl italic font-bold leading-none mb-10">
            {t("embed.default.title", {provider: embed_data.provider_name})}
          </h2>
          <p className="font-brezel text-base md:text-medium leading-tight
      mt-5  mx-2 sm:mx-4 md:mx-0 z-10">
            {t("embed.default.description")}
          </p>
          <button
            className="
          whitespace-no-wrap text-gray-700 hover:text-white
          hover:bg-black bg-white text-xs md:text-base
          font-rubik font-bold uppercase rounded-full
          py-5 sm:py-5 md:py-6 px-9 sm:px-8 md:px-10 mt-32"
            onClick={() => setActive(true)}
          >

            {t("embed.default.button")}
          </button>

        </div>
      )}
    </div>
  );
}
