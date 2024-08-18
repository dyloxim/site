import Link from 'next/link'
import Header from "./_coreUI/header";
import Footer from "./_coreUI/footer";

const Root = () => {

  return (
    <>
      <Header/>
      <hr/>
      <p>I am </p>
      <Link href="/myror">IFS App</Link>
      <Footer/>
    </>
  );

}

export default Root;
