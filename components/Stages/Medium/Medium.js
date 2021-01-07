export default function StageMedium({ kicker, title }) {
  return <div className="flex justify-center bg-orange-200">
    <div className="max-w-regular w-full py-10">
      <h1 className="font-brezel italic">
        <small className=" text-medium block leading-none">
          {kicker}
        </small>

        <span className="font-bold text-4xl leading-none">{title}</span>
      </h1>
    </div>
  </div>
}
