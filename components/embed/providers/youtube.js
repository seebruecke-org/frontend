import React from "react";

export default function youtube(embed_data) {
  console.log(embed_data.html);
  return (
    <div className="embed embed-youtube bg-orange-800 text-white md:min-h-full w-auto md:w-2/4 px-8 md:px-16 py-16 md:py-32 mx-2 sm:mx-4 md:mx-0 z-10 relative -mt-80 md:mt-0">
      <div dangerouslySetInnerHTML={{__html: embed_data.html}}></div>
      <p className="font-brezel text-base md:text-medium leading-tight mt-5">
        Azin Azadi  asas ere fgtf xxx ss er er
      </p>

    </div>
  )
}
