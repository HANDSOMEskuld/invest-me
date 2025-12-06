import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

export const KLineChart = () => {
    // 1. 创建引用，用于访问 DOM 元素
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        // 如果容器还没准备好，就不执行
        if (!chartContainerRef.current) return;

        // 2. 初始化图表：Bloomberg 风格配置
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' }, // 纯黑背景
                textColor: '#d1d4dc', // 浅灰文字
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.5)' }, // 极淡的网格
                horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400, // 高度设定
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });
        chartRef.current = chart;

        // 3. 添加 $ME (我的股价 - K线)
        const meSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', // 涨：绿 (国际标准)
            downColor: '#ef5350', // 跌：红
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            title: '$ME', // 左上角显示代号
        });

        // 模拟数据：$ME
        meSeries.setData([
            { time: '2023-12-01', open: 100, high: 105, low: 98, close: 103 },
            { time: '2023-12-02', open: 103, high: 106, low: 95, close: 96 },
            { time: '2023-12-03', open: 96,  high: 100, low: 96, close: 99 },
            { time: '2023-12-04', open: 99,  high: 102, low: 98, close: 101 },
            { time: '2023-12-05', open: 101, high: 104, low: 100, close: 102 },
        ]);

        // 4. 添加 $IMCI (大盘指数 - 折线)
        const marketSeries = chart.addLineSeries({
            color: '#FFD700', // 金色
            lineWidth: 2,
            title: '$IMCI', // 全球大盘
        });

        // 模拟数据：$IMCI (对比参照)
        marketSeries.setData([
            { time: '2023-12-01', value: 100 },
            { time: '2023-12-02', value: 101 },
            { time: '2023-12-03', value: 102 },
            { time: '2023-12-04', value: 101.5 },
            { time: '2023-12-05', value: 103 },
        ]);

        // 5. 设置自适应大小 (响应式)
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        // 自动适配初始内容
        chart.timeScale().fitContent();

        // 6. 清理函数：组件销毁时删除图表，防止内存泄漏
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // 渲染容器
    return (
        <div className="w-full p-4 bg-black">
            <h2 className="text-white text-xl font-bold mb-2 ml-1">My Performance ($ME)</h2>
            {/* 图表挂载点 */}
            <div 
                ref={chartContainerRef} 
                className="w-full h-[400px] border border-gray-800 rounded-lg overflow-hidden" 
            />
        </div>
    );
};