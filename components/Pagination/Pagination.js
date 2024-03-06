import Link from "next/link";

export default function Pagination({  ...props }) {

  return (
    <nav className="pagination">
      PAGINATION
      <ul>
        <li><Link href="#"> aaa </Link></li>
      </ul>
    </nav>
  );
}
