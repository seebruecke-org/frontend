import HTML from '@/components/HTML';

export default function ParagraphBlock({ attributes: { content }}) {
  return <p className="font-rubik text-base md:text-medium leading-normal px-10 md:px-0">
    <HTML html={content}  />
  </p>
}
