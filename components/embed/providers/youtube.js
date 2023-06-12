import React, { useState } from "react";
import { useTranslation } from "next-i18next";

export default function Youtube(embed_data) {
  const { t } = useTranslation();
  const aspectRatio = embed_data.width / embed_data.height;

  const [active, setActive] = useState(false);

  return (
    <div
      className="embed embed-youtube bg-orange-800 text-white " style={{ "--aspect-ratio": aspectRatio }}>
      {active && (
        <div dangerouslySetInnerHTML={{ __html: embed_data.html }}></div>
      )}
      {!active && (
        <div className="relative">
          <img src={embed_data.fetched_thumbnail} className="w-full" />
          <svg className="abstract absolute inset-0 mx-auto my-auto" width="147" height="188" viewBox="0 0 147 188"
               fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
            setActive(true);
          }}>
            <path d="M0 188V0L147 92.2129L0 188Z" fill="#F55511" />
          </svg>
        </div>
      )}
      {!active && (
        <p className="font-brezel text-base md:text-medium leading-tight
      mt-5 px-8 md:px-16 md:py-16 mx-2 sm:mx-4 md:mx-0 z-10">
          {t("embed.youtube")}
        </p>
      )}
    </div>
  );
}
