import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import stripJs from "strip-js";
import { TwitterEmbed } from "react-social-media-embed";

export default function Twitter(embed_data) {
  const { t } = useTranslation();
  const aspectRatio = embed_data.width / embed_data.height;

  const [active, setActive] = useState(false);

  const safeHTML = stripJs(embed_data.html);

  const loadTwitter = () => {
    const existingScript = document.getElementById("twitter-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.id = "twitter-script";
      document.body.appendChild(script);
      script.onload = () => {
        twttr.widgets.load();
      };
    } else {
      twttr.widgets.load();
    }
  };

  function activate() {
    setActive(true);
    loadTwitter();
  }

  return (
    <>
      {active && (
        <TwitterEmbed
          url={embed_data.url}
        />
      )}
      {!active && (

        <div
          className={`
      embed embed-twitter
      text-white 
      ${active || "bg-orange-800"}
      font-brezel text-base md:text-medium leading-tight
      mt-5 md:py-16 mx-2 sm:mx-4 md:mx-0`}>
          <div className="px-8 md:px-16" dangerouslySetInnerHTML={{ __html: safeHTML }}></div>

          <div className="
          mt-16 md:pt-16
          border-t border-solid border-white border-opacity-40
          ">
            <div className="mx-8 md:mx-16 flex flex-col md:flex-row items-start">
              <button
                className="
          whitespace-no-wrap text-gray-700 hover:text-white
          hover:bg-black bg-white text-xs md:text-base
          font-rubik font-bold uppercase rounded-full
          py-5 sm:py-5 md:py-6 px-9 sm:px-8 md:px-10"
                onClick={() => activate()}
              >

                Aktivieren
              </button>

              <p className="ml-4 md:ml-8 mt-4 md:mt-0">
                {t("embed.twitter")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
