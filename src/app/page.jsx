import Link from "next/link";

export default function Home() {
  return (<>
    <div className="h-[100vh] main_sec text-center max-w-full p-4" style={{alignContent:"center"}}>
      <div className="px-5 py-5 flex flex-col gap-2 main_div">
        <div><h1 className="text-white text-5xl ">Welcome to <span className="text-6xl font-bold">RK Dairy Farm</span></h1></div>
        <div className="ml-10"><button className="text-3xl px-2 py-1 text-center rounded bg-white text-green-950 font-medium"><Link
          href="/product"
          style={{textAlign:"center"}}
          
        >
          Explore Products
        </Link></button></div>
      </div>
    </div>
    
  </>
  );
}
