import "./Home.css"
import { Header } from "../../components/Header/Header"

export default function Home() {
  return (
    <>
      <div className="bg-blue-500 w-screen h-[550px] flex flex-col items-center relative" id="hero-section">
        <Header />
        <h1 className="text-3xl text-white sansbold text-center mt-10 sm:text-5xl sm:mt-16 lg:text-7xl lg:mt-20">سرویس تعمیر گوشی در محل</h1>
        <p className="text-white w-full text-center mt-7 px-7 lg:px-24">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع
        </p>
        <a href="#" className="btn btn-wide btn-outline bg-white text-blue-500 flex items-center gap-2 mt-5
      hover:bg-white md:mt-10">ثبت سفارش
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </a>
        <div className="bg-white shadow-md shadow-slate-300 w-11/12 h-max
        flex flex-col justify-center items-center gap-5 rounded-xl p-5
        absolute -bottom-[600px] left-1/2 -translate-x-1/2 sm:h-96 sm:-bottom-64 lg:flex-row lg:h-56 lg:-bottom-32">
          <div className="bg-slate-200 w-full h-max flex flex-col items-center justify-center gap-10
            rounded-xl p-5 sm:h-1/2 sm:flex-row lg:w-1/2 lg:h-full">
            <img className="w-32" src="./../../../public/imgs/poz.png" alt="تعمیر در محل" />
            <div className="flex justify-center flex-col gap-3">
              <span className="text-slate-600 sansbold text-3xl text-center sm:text-right">پرداخت در محل</span>
              <span className="text-slate-400 text-center sm:text-right">پرداخت ۸۰ درصد مبلغ در محل شما برای جمع بودن خیال شما  متن تستی متن تستی متن تستی از پرداخت امن</span>
            </div>
          </div>
          <div className="bg-slate-200 w-full h-max flex flex-col items-center justify-center gap-10
            rounded-xl p-5 sm:h-1/2 sm:flex-row lg:w-1/2 lg:h-full">
            <img className="w-32 scale-150" src="./../../../public/imgs/location.png" alt="تعمیر در محل" />
            <div className="flex justify-center flex-col gap-3">
              <span className="text-slate-600 sansbold text-3xl text-center sm:text-right">پرداخت در محل</span>
              <span className="text-slate-400 text-center sm:text-right">پرداخت ۸۰ درصد مبلغ در محل شما برای جمع بودن خیال شما  متن تستی متن تستی متن تستی از پرداخت امن</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}