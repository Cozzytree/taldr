type opacs = 0 | 0.5 | 1
const opacities = [0, 0.5, 1]

const OpacityOptions = ({ setOpac, handlecoloropac} : {
    setOpac : (v :  opacs) => void,
    handlecoloropac : (v : opacs) => void}
) => {
    return (
        <div className={"w-full grid grid-cols-4 px-2"}>
            {opacities.map((o , i) =>
                <button onClick={() => {
                    handlecoloropac(o as opacs)
                    setOpac(o as opacs)
                }}
                  className={`border border-foreground/20 bg-foreground/${100 * o} rounded-sm w-5 h-5`} key={i}
                />
            )}
        </div>
    )
}

export default OpacityOptions