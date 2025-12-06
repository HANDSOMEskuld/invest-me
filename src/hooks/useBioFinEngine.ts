import { useState, useEffect, useRef } from 'react';

// 辅助：生成随机 K 线
const generateNextBar = (lastClose: number, time: number, momentum: number) => {
    // 1. 计算收盘价 (基于动量)
    let change = -0.1; // 基础熵增
    
    // 动量影响
    if (momentum > 0) {
        change += (momentum * 0.2) + 0.1;
    } else if (momentum < 0) {
        change += (momentum * 0.2) - 0.1;
    }
    
    // 随机波动 (Noise)
    const volatility = 0.5 + Math.abs(momentum * 0.1);
    const noise = (Math.random() - 0.5) * volatility;
    change += noise;

    const close = lastClose + change;
    const open = lastClose;
    
    // 2. 计算 High/Low (影线)
    // 简单的模拟：High 比 Max(Open, Close) 高一点，Low 比 Min 低一点
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    // 3. 计算成交量 (Volume) - 模拟“精力消耗”或“情绪强度”
    // 动量越大，或者波动越大，量越大
    const volume = Math.floor(Math.abs(change) * 100 + Math.random() * 50);
    const color = close >= open ? '#26a69a' : '#ef5350'; // 涨绿跌红

    return {
        candle: { time, open, high, low, close },
        volume: { time, value: volume, color },
        value: close // 方便外部计算 Alpha
    };
};

const generateInitialData = () => {
    const now = Math.floor(Date.now() / 1000);
    const candleData = [];
    const volumeData = [];
    const maData = []; // 均线数据
    let price = 100;

    for (let i = 60; i > 0; i--) {
        const time = now - i;
        const bar = generateNextBar(price, time, 0.5); // 初始微涨
        price = bar.candle.close;
        
        candleData.push(bar.candle);
        volumeData.push(bar.volume);
        
        // 简单计算 MA (这里简化取 Close)
        maData.push({ time, value: price }); 
    }
    return { candle: candleData, volume: volumeData, ma: maData };
};

export const useBioFinEngine = () => {
    const initial = generateInitialData();
    const [candleData, setCandleData] = useState(initial.candle);
    const [volumeData, setVolumeData] = useState(initial.volume);
    const [maData, setMaData] = useState(initial.ma);
    const [markers, setMarkers] = useState<any[]>([]);
    
    const [cash, setCash] = useState(100); 
    const [isCrashing, setIsCrashing] = useState(false);

    const momentumRef = useRef(0.5); 
    const lastTimeRef = useRef(candleData[candleData.length - 1].time);
    const lastMarkerTimeRef = useRef(0);

    // 辅助：计算移动平均线 (SMA 5)
    const calculateMA = (data: any[], period = 5) => {
        if (data.length < period) return data[data.length - 1].close;
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[data.length - 1 - i].close;
        }
        return sum / period;
    };

    const addMarker = (marker: any) => {
        if (lastMarkerTimeRef.current === marker.time) return;
        setMarkers(prev => [...prev, marker]);
        lastMarkerTimeRef.current = marker.time;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            // 批量更新，防止多次渲染
            const nextTime = lastTimeRef.current + 1;
            lastTimeRef.current = nextTime;

            // 1. 动量衰减逻辑
            if (momentumRef.current > 0) {
                momentumRef.current -= 0.1;
                if (momentumRef.current < 0) momentumRef.current = 0;
            } else if (momentumRef.current < 0) {
                momentumRef.current += 0.05; // 负动量恢复较慢
                if (momentumRef.current > 0) momentumRef.current = 0;
            }

            // 危机检测
            if (momentumRef.current < -3.0 && !isCrashing) setIsCrashing(true);
            else if (momentumRef.current >= -1.0 && isCrashing) setIsCrashing(false);

            // 2. 生成新数据
            const lastClose = candleData[candleData.length - 1].close;
            const newBar = generateNextBar(lastClose, nextTime, momentumRef.current);

            // 3. 更新所有数据流
            setCandleData(prev => {
                const newData = [...prev, newBar.candle];
                if (newData.length > 200) newData.shift();
                return newData;
            });

            setVolumeData(prev => {
                const newData = [...prev, newBar.volume];
                if (newData.length > 200) newData.shift();
                return newData;
            });

            setMaData(prev => {
                // 计算新的均线值
                const currentMA = (lastClose * 4 + newBar.candle.close) / 5; // 简化的加权
                const newData = [...prev, { time: nextTime, value: currentMA }];
                if (newData.length > 200) newData.shift();
                return newData;
            });

        }, 1000);

        return () => clearInterval(interval);
    }, [candleData, isCrashing]); // 依赖 candleData 获取 lastClose

    // 交互逻辑
    const handleAction = (type: 'bull' | 'bear') => {
        const currentTime = lastTimeRef.current;
        if (type === 'bull') {
            momentumRef.current += 5.0; 
            setCash(prev => prev + 5); 
            addMarker({ time: currentTime, position: 'belowBar', color: '#26a69a', shape: 'arrowUp', text: '+$5' });
        } else {
            momentumRef.current -= 5.0;
            addMarker({ time: currentTime, position: 'aboveBar', color: '#ef5350', shape: 'arrowDown', text: 'FATIGUE' });
        }
    };

    const handleResurrection = () => {
        if (cash < 50) return false;
        const confirm = window.confirm(`消耗 $50 救市？`);
        if (!confirm) return false;

        setCash(prev => prev - 50);
        momentumRef.current = 5.0;
        setIsCrashing(false);
        addMarker({ time: lastTimeRef.current, position: 'inBar', color: '#FFD700', shape: 'circle', text: 'SAVED', size: 2 });
        return true;
    };

    return {
        // 导出新的数据结构
        candleData,
        volumeData,
        maData,
        markers,
        cash,
        isCrashing,
        currentPrice: candleData[candleData.length-1].close,
        handleAction,
        handleResurrection
    };
};