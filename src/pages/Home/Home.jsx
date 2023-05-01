import "./Home.css"
import { Header } from "../../components/Header/Header"

export default function Home() {
  return (
    <div className="bg-blue-500 w-screen h-[500px] flex flex-col items-center" id="hero-section">
      <Header />
      <h1 className="text-7xl text-white mt-20">سرویس تعمیر گوشی در محل</h1>
    </div>
  )
}