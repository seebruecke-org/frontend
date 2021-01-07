export default function StageMedium({ kicker, title }) {
  return <div className="flex justify-center bg-orange-200">
    <div className="max-w-regular w-full py-10">
      <h1 className="italic font-bold">
        <small className="font-normal block">
          {kicker}
        </small>

        {title}
      </h1>
    </div>
  </div>
}
