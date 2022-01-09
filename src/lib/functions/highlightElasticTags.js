export default function highlightElasticTags(text) {
  const regex = new RegExp(/<em>(.*?)<\/em>/); // Match text inside two square brackets
  return (
    <div>
      {text.split(regex).reduce((prev, tagged, i) => {
        if (i % 2 === 0) {
          prev.push(tagged);
        } else {
          prev.push(
            <mark key={i + tagged} style={{ backgroundColor: "yellow" }}>
              {tagged}
            </mark>
          );
        }
        return prev;
      }, [])}
    </div>
  );
}
