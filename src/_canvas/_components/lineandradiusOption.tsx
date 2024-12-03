import RadiusOption from "@/_canvas/_components/radiusOption.tsx";
import DashedOption from "@/_canvas/_components/dashedOption.tsx";

const LineandradiusOption = (
    {handleDots, handleRadius} : {
    handleRadius : (v : boolean) => void ,
    handleDots : (v : [number, number]) => void
}) => {
    return (
      <div className={"flex justify-start px-2 gap-2"}>
        <RadiusOption handleRadius={handleRadius} />
        <DashedOption handleDashed={handleDots} />
      </div>
    )
}
export default LineandradiusOption;