import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { createSeriesMarkers } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

// 更新 Props 接口
interface ChartProps {
    candleData: any[]; 
    volumeData: any[];
    maData: any[];
    markers?: any[];
    colors?: {
        textColor?: string;
    };
}

export const ChartComponent = (props: ChartProps) => {
    const {
        candleData,
        volumeData,
        maData,
        markers = [],
        colors: {
            textColor = 'white',
        } = {},
    } = props;

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const candleSeriesRef = useRef<any>(null);
    const volumeSeriesRef = useRef<any>(null);
    const maSeriesRef = useRef<any>(null);
    const markersRef = useRef<any>(null);

    // 1. 初始化图表
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            grid: {
                vertLines: { visible: false }, // 隐藏网格，更像 Bloomberg
                horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
            },
            // 时间轴配置
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                borderVisible: false,
                rightOffset: 10,
            },
            // 价格轴配置
            rightPriceScale: {
                borderVisible: false,
                scaleMargins: {
                    top: 0.1,    // K线留出顶部空间
                    bottom: 0.3, // K线底部留空给成交量
                },
            },
        });

        // A. 成交量 (Histogram) - 放在底部
        // 我们通过创建一个新的 priceScale 来实现“分层”显示的效果
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '', // 使用独立刻度，或者与主刻度分离
        });
        // 关键：强制把 Volume 压到底部 20% 的高度
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8, // 顶部留出 80% 给 K 线
                bottom: 0,
            },
        });

        // B. K线图 (Candlestick) - 主角
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', 
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        // C. 均线 (MA) - 指标
        const maSeries = chart.addSeries(LineSeries, {
            color: '#2962FF',
            lineWidth: 1,
            crosshairMarkerVisible: false, // 鼠标放上去时不显示圆点，保持整洁
            lineStyle: 2, // 虚线风格 (Dashed)
            title: 'MA(5)', // 图例名称
        });

        // 标记层
        const seriesMarkers = createSeriesMarkers(candleSeries, []);

        // 保存引用
        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;
        maSeriesRef.current = maSeries;
        markersRef.current = seriesMarkers;

        const resizeObserver = new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }
            const newRect = entries[0].contentRect;
            chart.applyOptions({ width: newRect.width, height: newRect.height });
        });
        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, []);

    // 2. 数据流更新 (高效增量更新)
    useEffect(() => {
        if (candleData.length > 0) candleSeriesRef.current?.setData(candleData);
        if (volumeData.length > 0) volumeSeriesRef.current?.setData(volumeData);
        if (maData.length > 0) maSeriesRef.current?.setData(maData);
    }, [candleData, volumeData, maData]);

    // 3. 标记更新
    useEffect(() => {
        if (markers) markersRef.current?.setMarkers(markers);
    }, [markers]);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
};