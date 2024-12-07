type opacs = 0 | 0.5 | 1;
const opacities = [0, 0.5, 1];

const OpacityOptions = ({
  setOpac,
  handlecoloropac,
}: {
  setOpac: (v: opacs) => void;
  handlecoloropac: (v: opacs) => void;
}) => {
  return (
    <div className={"w-full grid grid-cols-3 place-items-center px-2"}>
      {opacities.map((o, i) => (
        <div
          key={i}
          className={
            "border border-foreground/10 w-5 h-5 flex justify-center items-center"
          }
        >
          <button
            onPointerDown={() => {
              handlecoloropac(o as opacs);
              setOpac(o as opacs);
            }}
            style={{ opacity: o }}
            className={`bg-foreground rounded-sm w-full h-full`}
            key={i}
          />
        </div>
      ))}
    </div>
  );
};

export default OpacityOptions;
