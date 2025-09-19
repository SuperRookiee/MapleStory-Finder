interface IOptionSet {
    [key: string]: string | undefined;
}

interface RenderOptionRowProps {
    label: string;
    statKey: string;
    totalValue?: string;
    base: IOptionSet;
    add: IOptionSet;
    etc: IOptionSet;
    exceptional: IOptionSet;
    star: IOptionSet;
}

const RenderOptionRow = ({ label, statKey, totalValue, base, add, etc, exceptional, star }: RenderOptionRowProps) => {
    if (!totalValue || totalValue === "0") return null;

    const parts = [
        base[statKey] && base[statKey] !== "0" ? base[statKey] : null,
        add[statKey] && add[statKey] !== "0" ? `+${add[statKey]}` : null,
        etc[statKey] && etc[statKey] !== "0" ? `+${etc[statKey]}` : null,
        exceptional[statKey] && exceptional[statKey] !== "0" ? `+${exceptional[statKey]}` : null,
        star[statKey] && star[statKey] !== "0" ? `+${star[statKey]}` : null,
    ].filter(Boolean);

    return (
        <div className="flex justify-between items-start text-xs sm:text-sm gap-3">
            <span className="text-blue-300 leading-5 sm:leading-6">{label}</span>
            <span className="min-w-[6.25rem] sm:min-w-[8.75rem] text-right flex justify-end items-center gap-2 sm:gap-3 leading-5 sm:leading-6">
                {parts.length > 0 && (
                    <span className="text-yellow-400 text-[0.65rem] sm:text-xs leading-5 sm:leading-6">
                        ({parts.join(" ")})
                    </span>
                )}
                <span className="leading-5 sm:leading-6 text-xs sm:text-sm">+{totalValue}</span>
            </span>
        </div>
    );
};

export default RenderOptionRow;
