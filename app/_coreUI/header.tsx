'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation'

const Header = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: ".5em"
    }}>
      <div className="reversed">
        <Link href="/" style={{fontSize: "30px"}}>nai.dyloxim.com</Link>
        <Link href={usePathname()} style={{fontSize: "30px"}}>{usePathname()}</Link>
        
      </div>
    </div>
  );
}

export default Header;
