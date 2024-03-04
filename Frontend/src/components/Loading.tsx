
const Loading = () => {
  return (
    <div>Loading...</div>
  )
}

export default Loading


interface skeletonProps{
  width ?: string;
  length ?: number
}

export const Skeleton = ({width = "unset", length = 3}: skeletonProps) => {


  const skeletons = Array.from({length},(_, idx) => <div key={idx} className="skeleton-shape"></div>)
  return <div className="skeleton-loader" style={{width}} >
    {skeletons}
  </div>
}