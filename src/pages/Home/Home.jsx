import "./Home.css"
import { Header } from "../../components/Header/Header"

function ServiceBox(props) {
  return (
    <div className="bg-slate-200 shadow-sm shadow-[#25252535] w-44 max-w-[11rem] flex justify-center items-center gap-3 py-3 rounded-md
      hover:shadow-xl sm:w-72 sm:max-w-[18rem] sm:px-10">
      {props.svg}
      <span className="text-slate-700 irsB sm:text-xl">{props.title}</span>
    </div>
  )
}


export default function Home() {
  return (
    <>
      <div className="bg-blue-500 w-screen h-[550px] flex flex-col items-center relative" id="hero-section">
        <Header />
        <h1 className="text-3xl text-white sansbold text-center mt-10 sm:text-5xl sm:mt-16 lg:text-7xl lg:mt-20">سرویس تعمیر گوشی در محل</h1>
        <p className="text-white w-full text-center mt-7 px-7 lg:px-24">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع
        </p>
        <a href="#" className="whiteBtn md:mt-10">ثبت سفارش
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

      <div className="container flex justify-center flex-col items-center gap-10 mt-[650px] mb-24 mx-auto sm:mt-72 lg:mt-44">
        <h1 className="text-slate-700 sansbold text-2xl sm:text-5xl">برخی از خدمات ما</h1>
        <div className="w-full flex flex-wrap justify-center items-center gap-3 sm:gap-5">
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-zinc-500" d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                <path className="fill-blue-500" d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            )}
            title="تعمیر موبایل"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-orange-500" d="M2.273 9.53a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.547Zm9.467-4.984a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546ZM7.4 13.108a5.535 5.535 0 0 1-3.775-2.88 3.273 3.273 0 0 1-1.944.24 7.4 7.4 0 0 0 5.328 4.465c.53.113 1.072.169 1.614.166a3.253 3.253 0 0 1-.666-1.9 5.639 5.639 0 0 1-.557-.091Zm3.828 2.285a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546Zm3.163-3.108a7.436 7.436 0 0 0 .373-8.726 3.276 3.276 0 0 1-1.278 1.498 5.573 5.573 0 0 1-.183 5.535 3.26 3.26 0 0 1 1.088 1.693ZM2.098 3.998a3.28 3.28 0 0 1 1.897.486 5.544 5.544 0 0 1 4.464-2.388c.037-.67.277-1.313.69-1.843a7.472 7.472 0 0 0-7.051 3.745Z" />
              </svg>
            )}
            title="نصب لینوکس"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-slate-400" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                <path className="fill-slate-400" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
              </svg>
            )}
            title="محصولات اپل"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-sky-500" d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z" />
              </svg>
            )}
            title="تعویض ویندوز"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-zinc-500" d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                <path className="fill-blue-500" d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            )}
            title="تعمیر موبایل"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-orange-500" d="M2.273 9.53a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.547Zm9.467-4.984a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546ZM7.4 13.108a5.535 5.535 0 0 1-3.775-2.88 3.273 3.273 0 0 1-1.944.24 7.4 7.4 0 0 0 5.328 4.465c.53.113 1.072.169 1.614.166a3.253 3.253 0 0 1-.666-1.9 5.639 5.639 0 0 1-.557-.091Zm3.828 2.285a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546Zm3.163-3.108a7.436 7.436 0 0 0 .373-8.726 3.276 3.276 0 0 1-1.278 1.498 5.573 5.573 0 0 1-.183 5.535 3.26 3.26 0 0 1 1.088 1.693ZM2.098 3.998a3.28 3.28 0 0 1 1.897.486 5.544 5.544 0 0 1 4.464-2.388c.037-.67.277-1.313.69-1.843a7.472 7.472 0 0 0-7.051 3.745Z" />
              </svg>
            )}
            title="نصب لینوکس"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-slate-400" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                <path className="fill-slate-400" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
              </svg>
            )}
            title="محصولات اپل"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-sky-500" d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z" />
              </svg>
            )}
            title="تعویض ویندوز"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-zinc-500" d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                <path className="fill-blue-500" d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            )}
            title="تعمیر موبایل"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-orange-500" d="M2.273 9.53a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.547Zm9.467-4.984a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546ZM7.4 13.108a5.535 5.535 0 0 1-3.775-2.88 3.273 3.273 0 0 1-1.944.24 7.4 7.4 0 0 0 5.328 4.465c.53.113 1.072.169 1.614.166a3.253 3.253 0 0 1-.666-1.9 5.639 5.639 0 0 1-.557-.091Zm3.828 2.285a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546Zm3.163-3.108a7.436 7.436 0 0 0 .373-8.726 3.276 3.276 0 0 1-1.278 1.498 5.573 5.573 0 0 1-.183 5.535 3.26 3.26 0 0 1 1.088 1.693ZM2.098 3.998a3.28 3.28 0 0 1 1.897.486 5.544 5.544 0 0 1 4.464-2.388c.037-.67.277-1.313.69-1.843a7.472 7.472 0 0 0-7.051 3.745Z" />
              </svg>
            )}
            title="نصب لینوکس"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-slate-400" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                <path className="fill-slate-400" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
              </svg>
            )}
            title="محصولات اپل"
          />
          <ServiceBox
            svg={(
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path className="fill-sky-500" d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z" />
              </svg>
            )}
            title="تعویض ویندوز"
          />
        </div>
      </div>

      <div className="container flex flex-col justify-center items-center gap-16 mt-16 mx-auto">
        <div className="w-full flex justify-start relative">
          <div className="bg-blue-500 w-[500px] h-[500px] rounded-full absolute -left-44 -top-64 blur-[150px] -z-10 opacity-25 hidden lg:block"></div>
          <div className="w-full h-48 flex justify-center items-center gap-3
            lg:w-3/4 sm:gap-10">
            <div className="w-1/2 h-full flex flex-col justify-center items-center gap-3">
              <h3 className="text-xl sansbold flex justify-center items-center relative
              before:absolute before:w-[110%] before:h-1/2 before:bg-blue-500 before:opacity-25
              lg:text-3xl">
                ارایه پشتیبانی آنلاین
              </h3>
              <p className="text-center text-sm sm:text-base">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون
              </p>
            </div>
            <div className="bg-slate-200 w-40 h-40 rounded-full lg:w-48 lg:h-48"></div>
          </div>
        </div>
        <div className="w-full flex justify-end relative">
        <div className="bg-blue-500 w-[500px] h-[500px] rounded-full absolute -right-44 -top-64 blur-[150px] -z-10 opacity-25 hidden lg:block"></div>
          <div className="w-full h-48 flex flex-row-reverse justify-center items-center gap-3
            lg:w-3/4 sm:gap-10">
            <div className="w-1/2 h-full flex flex-col justify-center items-center gap-3">
              <h3 className="text-xl sansbold flex justify-center items-center relative
              before:absolute before:w-[110%] before:h-1/2 before:bg-blue-500 before:opacity-25
              lg:text-3xl">
                ارایه پشتیبانی آنلاین
              </h3>
              <p className="text-center text-sm sm:text-base">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون
              </p>
            </div>
            <div className="bg-slate-200 w-40 h-40 rounded-full lg:w-48 lg:h-48"></div>
          </div>
        </div>
        <div className="w-full flex justify-start relative">
          <div className="bg-blue-500 w-[500px] h-[500px] rounded-full absolute -left-44 top-0 blur-[150px] -z-10 opacity-25 hidden lg:block"></div>
          <div className="w-full h-48 flex justify-center items-center gap-3
            lg:w-3/4 sm:gap-10">
            <div className="w-1/2 h-full flex flex-col justify-center items-center gap-3">
              <h3 className="text-xl sansbold flex justify-center items-center relative
              before:absolute before:w-[110%] before:h-1/2 before:bg-blue-500 before:opacity-25
              lg:text-3xl">
                ارایه پشتیبانی آنلاین
              </h3>
              <p className="text-center text-sm sm:text-base">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون
              </p>
            </div>
            <div className="bg-slate-200 w-40 h-40 rounded-full lg:w-48 lg:h-48"></div>
          </div>
        </div>
        <div className="w-full flex justify-end relative">
        <div className="bg-blue-500 w-[500px] h-[500px] rounded-full absolute -right-44 top-0 blur-[150px] -z-10 opacity-25 hidden lg:block"></div>
          <div className="w-full h-48 flex flex-row-reverse justify-center items-center gap-3
            lg:w-3/4 sm:gap-10">
            <div className="w-1/2 h-full flex flex-col justify-center items-center gap-3">
              <h3 className="text-xl sansbold flex justify-center items-center relative
              before:absolute before:w-[110%] before:h-1/2 before:bg-blue-500 before:opacity-25
              lg:text-3xl">
                ارایه پشتیبانی آنلاین
              </h3>
              <p className="text-center text-sm sm:text-base">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون
              </p>
            </div>
            <div className="bg-slate-200 w-40 h-40 rounded-full lg:w-48 lg:h-48"></div>
          </div>
        </div>
      </div>
    </>
  )
}