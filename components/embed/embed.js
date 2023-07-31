import React from "react";
import Youtube from "@/components/embed/providers/youtube";
import Twitter from "@/components/embed/providers/twitter";
import Default from "@/components/embed/providers/default";
import Instagram from "@/components/embed/providers/instagram";


export default function Embed({ embed_data }) {
  const data = JSON.parse(embed_data);

  let comp = {
    'YouTube': Youtube,
    'Twitter': Twitter,
    'Instagram': Instagram
  }[data.provider_name] || Default

  return (<div>
    {comp(data)}
  </div>)
}
