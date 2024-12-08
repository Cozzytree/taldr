import { colors } from "../utils";

export default function FillOption({
  handleColor,
  handleStrokeColor,
}: {
  handleStrokeColor: (v: string) => void;
  handleColor: (v: string) => void;
}) {
  return (
    <div className="w-full grid grid-cols-4 gap-2 place-items-center">
      {colors.map((c) => (
        <button
          onPointerDown={() => {
            handleColor(c);
            handleStrokeColor(c);
          }}
          key={c}
          style={{ background: c }}
          className={`bg-[${c}] w-4 h-4 rounded-full`}
        />
      ))}

      <label
        htmlFor="custom-color"
        className="w-4 h-4 rounded-full bg-gradient-to-r from-red-700 to-green-600"
      />
      <input
        onChange={(e) => {
          handleColor(e.target.value);
          handleStrokeColor(e.target.value);
        }}
        className="hidden"
        type="color"
        id="custom-color"
      />
    </div>
  );
}
