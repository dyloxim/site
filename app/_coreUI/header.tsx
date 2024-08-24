'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation'

const Header = () => {

  let path = '';

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: ".5em"
    }}>
      <div className="reversed">
        <Link href="/" style={{fontSize: "20px"}}>dyloxim.com</Link>
        {usePathname().split('/').map((elem, i) => {
          path += elem + '/';
          return (
            <Link key={i} href={path} style={{fontSize: "20px"}}>{i == 0 ? '' : '/' }{elem}</Link>
          )
        })}
        
      </div>
    </div>
  );
}

export default Header;
