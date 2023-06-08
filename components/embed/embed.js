import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Youtube from "@/components/Embed/providers/youtube";
import Twitter from "@/components/embed/providers/twitter";
import Default from "@/components/embed/providers/default";


export default function Embed({ embed_data }) {
  const data = JSON.parse(embed_data);
  const comp = {
    'YouTube': Youtube,
    'Twitter': Twitter
  }[data.provider_name]


  return (<div className="embed">
    <Default embed_data={data}/>
  </div>)
// {comp({embed_data:data})}
}
function Embed_old({ embed_data }) {
  const { t } = useTranslation("common");

  const data = JSON.parse(embed_data);
  let embedHTML = data["rawData"]["html"];
  const embedType = data["rawData"]["type"];
  const titleText = t("embed.title", { type: embedType });
  const descriptionText = t("embed.description", data["rawData"]);
  const buttonText = t("embed.button");
  const checkboxText = t("embed.checkbox");


  if (embedHTML.includes("<iframe")) {
    embedHTML = embedHTML.replace("src=", "data-src=");
    embedHTML = embedHTML.replace("data-src=", `data-2click-type="${embedType}" data-src=`);
    useEffect(() => {
      /*!
 * 2Click-Iframe-Privacy v0.3.0
 * https://github.com/01-Scripts/2Click-Iframe-Privacy
 *
 * Licensed MIT © 2018-2019 Michael Lorer - https://www.01-scripts.de/
 */

      window._2ClickIframePrivacy = new function() {

        let config = {
          enableCookies: true,
          useSessionCookie: true,
          cookieNamespace: "_2ClickIPEnable-",
          showContentLabel: "Inhalt anzeigen",
          rememberChoiceLabel: "Auswahl merken",
          privacyPolicyLabel: "Datenschutzerklärung",
          privacyPolicyUrl: false
        };

        this.types = new Array({
          type: "video"
        }, {
          type: "map"
        }, {
          type: "calendar"
        });

        function setCookie(name, value, days) {
          let d = new Date;
          d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
          document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
        }

        function setSessionCookie(name, value) {
          document.cookie = name + "=" + value + ";path=/";
        }

        function getCookie(name) {
          let v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
          return v ? v[2] : null;
        }

        // Create <div>-element within the respective iframe to display the defined data-security message and get consent for loading the iframe content.
        function wrap(el, wrapper, type) {
          el.parentNode.insertBefore(wrapper, el);
          wrapper.className = "bg-orange-200 px-20 py-20 md:py-28 privacy-msg privacy-" + type + "-msg";
          wrapper.innerHTML =
            `<h2 class="font-brezel text-medium md:text-large font-bold italic leading-tight mt-2">
              ${titleText}
             </h2>
             <p class="block font-rubik text-small md:text-xs mt-5">
               ${descriptionText} 
             </p>
             <a href="javascript:void(0);" 
                class=" mt-10 font-rubik font-bold text-small md:text-base uppercase py-4 sm:py-5 md:py-6 px-7 sm:px-8 md:px-10 rounded-full inline-block text-center bg-white text-black hover:bg-black hover:text-white"
                onclick="window._2ClickIframePrivacy.EnableContent('${type}'); return false;">
                  ${buttonText}
             </a>
            `;
          // <div  class=" mt-10 font-rubik font-bold text-small md:text-base uppercase ">
          //  <input type="checkbox"  name="remind-'${type}'" />
          //  <label> ${checkboxText} </label>
          // </div>
          wrapper.innerHTML = "<p>" + wrapper.innerHTML + "</p>";
          wrapper.appendChild(el);
        }

        this.EnableContent = function(type) {
          let i;

          // Cookies globally enabled by config?
          if (config.enableCookies) {
            let remind = false;
            let x = document.querySelectorAll("div.privacy-" + type + "-msg p input");
            // Check if any checkbox for the selected class was checked. If so a cookie will be set
            for (i = 0; i < x.length; i++) {
              if (x[i].checked == true) {
                remind = true;
              }
            }

            if (remind) {
              if (config.useSessionCookie) {
                setSessionCookie(config.cookieNamespace + type, "1");
              } else {
                setCookie(config.cookieNamespace + type, "1", 30);
              }
            }
          }

          let x = document.querySelectorAll("div.privacy-" + type + "-msg p");
          for (i = 0; i < x.length; i++) {
            x[i].parentNode.removeChild(x[i]);
          }

          x = document.querySelectorAll("div.privacy-" + type + "-msg");
          for (let i = 0; i < x.length; i++) {
            let parent = x[i].parentNode;

            // Move all children out of the element
            while (x[i].firstChild) parent.insertBefore(x[i].firstChild, x[i]);

            // Remove the empty element
            parent.removeChild(x[i]);
          }

          x = document.querySelectorAll("iframe[data-2click-type=\"" + type + "\"]");
          for (let i = 0; i < x.length; i++) {
            x[i].src = x[i].getAttribute("data-src");
          }

          // If available, execute the callback that is defined for the currently active type
          for (let i = 0; i < this.types.length; i++) {
            if (this.types[i].type == type && this.types[i].callback) {
              window[this.types[i].callback]();
            }
          }
        };

        this.init = function(Userconfig) {
          console.log("Iniiit");
          // Read UserConfiguration:
          if (typeof Userconfig.enableCookies !== "undefined") {
            config.enableCookies = Userconfig.enableCookies;
          }
          if (typeof Userconfig.useSessionCookie !== "undefined") {
            config.useSessionCookie = Userconfig.useSessionCookie;
          }
          if (typeof Userconfig.cookieNamespace !== "undefined") {
            config.cookieNamespace = Userconfig.cookieNamespace;
          }
          if (typeof Userconfig.privacyPolicyUrl !== "undefined") {
            config.privacyPolicyUrl = Userconfig.privacyPolicyUrl;
          }
          if (typeof Userconfig.showContentLabel !== "undefined") {
            config.showContentLabel = Userconfig.showContentLabel;
          }
          if (typeof Userconfig.rememberChoiceLabel !== "undefined") {
            config.rememberChoiceLabel = Userconfig.rememberChoiceLabel;
          }
          if (typeof Userconfig.privacyPolicyLabel !== "undefined") {
            config.privacyPolicyLabel = Userconfig.privacyPolicyLabel;
          }

          if (Array.isArray(Userconfig.CustomTypes)) {
            this.types = Userconfig.CustomTypes;
          }

          for (let i = 0; i < this.types.length; i++) {
            let selector = document.querySelectorAll("iframe[data-2click-type=\"" + this.types[i].type + "\"]");

            let x;
            if (!getCookie(config.cookieNamespace + this.types[i].type)) {
              for (x = 0; x < selector.length; x++) {
                wrap(selector[x], document.createElement("div"), this.types[i].type);
              }
            } else {
              for (x = 0; x < selector.length; x++) {
                selector[x].src = selector[x].getAttribute("data-src");
              }
            }
          }

        };
      };

      document.addEventListener("DOMContentLoaded", window._2ClickIframePrivacy.init(""));
    });
  }

  return Youtube(embed_data);
  // return (<div className="Embed" dangerouslySetInnerHTML={{ __html: embedHTML }}>
  //
  //   </div>);
}
