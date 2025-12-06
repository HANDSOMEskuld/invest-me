import { useBioFinEngine } from './hooks/useBioFinEngine';
import { DashboardHeader } from './components/DashboardHeader';
import { ChartSection } from './components/ChartSection';
import { TradeConsole } from './components/TradeConsole';

function App() {
    const { 
        candleData, // 变了
        volumeData, // 新增
        maData,     // 新增
        markers, 
        cash, 
        isCrashing,
        currentPrice, // Hook 里单独导出了 currentPrice 方便 Header 用
        handleAction, 
        handleResurrection 
    } = useBioFinEngine();

    // Alpha 暂时简化为与开盘价对比，或者你可以把大盘逻辑加回来
    // 为了代码简洁，这里 MVP 先聚焦在 K 线体验上
    const alpha = currentPrice - 100; 

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center font-sans select-none transition-colors duration-1000 
            ${isCrashing ? 'bg-[#1a0505]' : 'bg-black'} text-white`}
        >
            <DashboardHeader 
                currentPrice={currentPrice}
                cash={cash}
                alpha={alpha}
                isCrashing={isCrashing}
            />
            
            <ChartSection 
                candleData={candleData}
                volumeData={volumeData}
                maData={maData}
                markers={markers}
                isCrashing={isCrashing} 
            />

            <TradeConsole 
                onTrade={handleAction}
                onResurrection={handleResurrection}
                cash={cash}
                isCrashing={isCrashing}
            />
            
            <footer className="mt-8 text-center opacity-30 text-[10px]">
                INVEST ME &copy; 2025 BIO-FIN TECH
            </footer>
        </div>
    );
}

export default App;