interface ConsoleProps {
    onTrade: (type: 'bull' | 'bear') => void;
    onResurrection: () => boolean;
    cash: number;
    isCrashing: boolean;
}

export const TradeConsole = ({ onTrade, onResurrection, cash, isCrashing }: ConsoleProps) => {
    const handleResurrectClick = () => {
        const success = onResurrection();
        if (!success && cash < 50) {
            // 如果是因为没钱失败的（且没点取消），提示一下
            // 注意：因为 Hook 里如果是取消也会返回 false，这里为了简单只判断钱不够的情况
            // 实际上 Hook 里的 confirm 已经处理了大部分交互
        } else if (!success && cash >= 50) {
            // 用户取消了 confirm，不做任何事
        }
    };

    return (
        <div className="mt-6 w-full max-w-lg px-4 space-y-3">
            <div className="flex gap-4">
                <button 
                    onClick={() => onTrade('bear')}
                    className="flex-1 py-4 bg-[#1e222d] rounded-lg border border-red-900/30 active:scale-95 transition-all text-red-500 font-bold hover:bg-red-900/10"
                >
                    Short (熬夜)
                    <div className="text-[10px] opacity-60 font-normal mt-1">精力 -5.0</div>
                </button>

                <button 
                    onClick={() => onTrade('bull')}
                    className="flex-1 py-4 bg-[#1e222d] rounded-lg border border-green-900/30 active:scale-95 transition-all text-green-500 font-bold hover:bg-green-900/10"
                >
                    Long (锻炼)
                    <div className="text-[10px] opacity-60 font-normal mt-1">现金 +$5</div>
                </button>
            </div>

            <button 
                onClick={handleResurrectClick}
                disabled={!isCrashing} 
                className={`w-full py-3 rounded-lg border font-bold tracking-wider transition-all duration-300
                    ${isCrashing 
                        ? 'bg-[#FFD700] text-black border-[#FFD700] hover:bg-yellow-400 scale-105 shadow-lg cursor-pointer' 
                        : 'bg-transparent text-gray-700 border-gray-800 cursor-not-allowed opacity-30'
                    }
                `}
            >
                {isCrashing ? `💊 注入流动性 (救市) -$50` : "MARKET STABLE"}
            </button>
        </div>
    );
};