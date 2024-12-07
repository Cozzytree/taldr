export default function RadiusOption({
  handleRadius,
}: {
  handleRadius: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <button
        onPointerDown={() => handleRadius(true)}
        className="rounded-md border-2 border-foreground w-5 h-5"
      />
      <button
        onPointerDown={() => handleRadius(false)}
        className="rounded-none border-2 border-foreground w-5 h-5"
      />
    </div>
  );
}
