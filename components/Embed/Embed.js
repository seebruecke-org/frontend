export default function Embed({ code }) {
  return (
    <div className="Embed" dangerouslySetInnerHTML={{__html: code}}>

    </div>
  );
}
