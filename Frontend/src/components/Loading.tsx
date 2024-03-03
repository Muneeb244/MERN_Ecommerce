
const Loading = () => {
  return (
    <div>Loading...</div>
  )
}

export default Loading

export const Skeleton = ({width = "unset"}) => {
  return <div className="skeleton-loader" style={{width}} >
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
  </div>
}