

const Error = ({errMessage}) => {
  return <div className="flex items-center justify-center w-full h-full">
    <h3 className="text-[24px] leading-[30px] text-headingColor font-semibold">{errMessage}</h3>
  </div>
}

export default Error