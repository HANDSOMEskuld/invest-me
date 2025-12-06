import { ChartComponent } from './ChartComponent';

interface SectionProps {
    candleData: any[]; // 变了
    volumeData: any[]; // 新增
    maData: any[];     // 新增
    markers: any[];
    isCrashing: boolean;
}

export const ChartSection = ({ candleData, volumeData, maData, markers, isCrashing }: SectionProps) => {
    return (
        <div 
            className={`w-full max-w-lg border-t border-b bg-[#131722] relative transition-colors duration-500 
                ${isCrashing ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,83,80,0.15)]' : 'border-gray-800'}`}
            style={{ height: '400px' }} // 加高一点，因为有成交量了
        >
            <ChartComponent 
                candleData={candleData}
                volumeData={volumeData}
                maData={maData}
                markers={markers}
                colors={{ textColor: isCrashing ? '#ffcccc' : '#d1d4dc' }}
            />
            
            {/* 左上角图例 (Webull 风格) */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none text-[10px] font-mono opacity-80">
                <div className="flex items-center gap-2">
                    <span className="text-[#26a69a] font-bold">O {candleData[candleData.length-1]?.open.toFixed(2)}</span>
                    <span className="text-[#ef5350] font-bold">H {candleData[candleData.length-1]?.high.toFixed(2)}</span>
                    <span className="text-[#ef5350] font-bold">L {candleData[candleData.length-1]?.low.toFixed(2)}</span>
                    <span className="text-[#26a69a] font-bold">C {candleData[candleData.length-1]?.close.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-[#2962FF]">MA(5): {maData[maData.length-1]?.value.toFixed(2)}</span>
                    <span className="text-gray-500">Vol: {volumeData[volumeData.length-1]?.value}</span>
                </div>
            </div>

            {isCrashing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-red-500/10 text-6xl font-black rotate-[-15deg]">CRASH</span>
                </div>
            )}
        </div>
    );
};