type opacs = 0 | 0.5 | 1
const opacities = [0, 0.5, 1]

const OpacityOptions = ({ setOpac, handlecoloropac} : {
    setOpac : (v :  opacs) => void,
    handlecoloropac : (v : opacs) => void}
) => {
    return (
        <div className={"w-full grid grid-cols-4 px-2"}>
            {opacities.map((opac : opacs, i) =>
                <button onClick={() => {
                    handlecoloropac(opac)
                    setOpac(opac)
                }}
                  size={"sm"}
                  variant={"outline"}
                  className={`border border-foreground/20 bg-foreground/${100 * opac} rounded-sm w-5 h-5`} key={i}
                />
            )}
        </div>
    )
}

export default OpacityOptions