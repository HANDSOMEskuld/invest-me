interface HeaderProps {
    currentPrice: number;
    cash: number;
    alpha: number;
    isCrashing: boolean;
}

export const DashboardHeader = ({ currentPrice, cash, alpha, isCrashing }: HeaderProps) => {
    return (
        <div className="mb-4 w-full max-w-lg px-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Human Capital ($ME)</h1>
                    <div className="text-4xl font-bold flex items-baseline gap-2">
                        <span className={currentPrice >= 100 ? "text-[#26a69a]" : "text-[#ef5350]"}>
                            {currentPrice.toFixed(2)}
                        </span>
                    </div>
                </div>
                
                <div className="text-right">
                    <h1 className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Cash Balance</h1>
                    {/* 修复：给 cash 加一个固定的宽度/高度容器，防止数字变化时抖动 */}
                    <div className={`text-4xl font-mono font-bold transition-colors duration-300 ${cash === 0 ? 'text-red-500' : 'text-[#FFD700]'}`}>
                        ${cash.toFixed(0)}
                    </div>
                </div>
            </div>

            {/* 下半部分：固定高度 h-6，防止警告出现时布局跳动 */}
            <div className="flex justify-between items-center text-xs h-6">
                <div className={`font-mono ${alpha >= 0 ? 'text-[#26a69a]' : 'text-gray-400'}`}>
                    Alpha: {alpha > 0 ? '+' : ''}{alpha.toFixed(2)}
                </div>
                
                {/* 警告标签 */}
                <div className={`transition-opacity duration-300 ${isCrashing ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="px-2 py-1 bg-red-600 text-white rounded font-bold animate-pulse text-[10px] tracking-wider">
                        CRASHING
                    </div>
                </div>
            </div>
        </div>
    );
};