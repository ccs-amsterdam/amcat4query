import React from "react";

export function highlightElasticTags(text) {
  const regex = new RegExp(/<em>(.*?)<\/em>/); // Match text inside two square brackets
  return (
    <div>
      {String(text)
        .split(regex)
        .reduce((prev, tagged, i) => {
          if (i % 2 === 0) {
            prev.push(tagged);
          } else {
            prev.push(<highlight key={i + tagged}>{tagged}</highlight>);
          }
          return prev;
        }, [])}
    </div>
  );
}

export function removeElasticTags(text) {
  return String(text).replaceAll("<em>", "").replaceAll("</em>", "");
}
