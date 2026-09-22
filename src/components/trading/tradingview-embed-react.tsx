import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

interface TradingViewWidgetProps {
  symbol?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ 
  symbol = "CAPITALCOM:ECFZ2026" 
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
    }
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "${resolvedTheme === 'dark' ? 'dark' : 'light'}",
        "style": "1",
        "locale": "en",
        "backgroundColor": "${resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'}",
        "gridColor": "${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}",
        "support_host": "https://www.tradingview.com",
        "allow_symbol_change": true,
        "toolbar_bg": "${resolvedTheme === 'dark' ? '#1e293b' : '#f8fafc'}"
      }`;
    container.current?.appendChild(script);
  }, [symbol, resolvedTheme]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  );
};

export default memo(TradingViewWidget); 