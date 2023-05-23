import React from 'react'

function UserOrders() {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-6'>
      <div className="border-blue-300 border border-dashed w-full rounded-xl p-6 pb-9
      flex justify-center items-center flex-wrap relative">
        <div className="w-1/2 flex justify-center items-center gap-3 p-3">
          <span className="sansbold">نام دستگاه:</span>
          <span>Iphone 13</span>
        </div>
        <div className="w-1/2 flex justify-center items-center gap-3 p-3">
          <span className="sansbold">تعمیرات مورد نیاز:</span>
          <span>LCD - دوربین جلو - سوکت شارژ</span>
        </div>
        <div className="w-1/2 flex justify-center items-center gap-3 p-3">
          <span className="sansbold">تعمیرات مورد نیاز:</span>
          <span>LCD - دوربین جلو - سوکت شارژ</span>
        </div>
        <div className="flex justify-center items-center gap-3
          absolute left-1/2 -translate-x-1/2 -bottom-6">
          <div className="btn btn-blue w-max">در انتظار تایید</div>
          <button className="btn btn-danger">لغو سفارش</button>
        </div>
      </div>
    </div>
  )
}

export default UserOrders