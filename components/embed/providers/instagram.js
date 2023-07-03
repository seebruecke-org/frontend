import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { InstagramEmbed } from "react-social-media-embed";

export default function Instagram(embed_data) {
  const { t } = useTranslation();

  const [active, setActive] = useState(false);

  return (
    <>
      {active && (
        <div className="instagram-embed">
          <InstagramEmbed
            url={embed_data.url}
            placeholderDisabled
          />
        </div>
      )}
      {!active && (
        <div
          className="text-white bg-orange-800">
          <div className="px-8 md:px-16 md:py-16">
            <h2 className="block font-brezel text-xl italic font-bold leading-none mb-10">
              {t("embed.default.title", { provider: "Instagram" })}
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
        </div>
      )}
    </>
  );
}
