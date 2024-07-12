import React, { useEffect, useRef, useState } from 'react';
import { widget } from '../../charting_library';

const BacktestChart = () => {
  const chartContainerRef = useRef(null);
  // eslint-disable-next-line
  const [webSocket, setWebSocket] = useState(null);
  // const [instrument, setInstrument] = useState('NIFTY24MAYFUT');
  // const [minutes, setMinutes] = useState(1);
  // const minutesRef = useRef(null);
  const tvWidgetRef = useRef(null);

  const defaultProps = {
    symbol: 'AAPL',
    interval: 'D',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    if (!window.Datafeeds || !window.Datafeeds.UDFCompatibleDatafeed) {
      console.error("TradingView Datafeeds is not loaded");
      return;
    }

    const widgetOptions = {
      symbol: defaultProps.symbol,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
      interval: defaultProps.interval,
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      theme: 'Dark', // Specify the theme as 'Dark' for dark mode
    };

    console.log("Initializing TradingView widget with options:", widgetOptions);

    tvWidgetRef.current = new widget(widgetOptions);

    tvWidgetRef.current.onChartReady(() => {
      console.log("TradingView chart ready");
      tvWidgetRef.current.headerReady().then(() => {
        const button = tvWidgetRef.current.createButton();
        button.setAttribute('title', 'Click to show a notification popup');
        button.classList.add('apply-common-tooltip');
        button.addEventListener('click', () => tvWidgetRef.current.showNoticeDialog({
          title: 'Notification',
          body: 'TradingView Charting Library API works correctly',
          callback: () => {
            console.log('Noticed!');
          },
        }));

        button.innerHTML = 'Check API';
      });

      return () => {
        tvWidgetRef.current.remove();
      };
    });

    // const connectWebSocket = () => {
    //   let tradingDataWebSocket = new WebSocket('ws://127.0.0.1:8000/ws/trading_data/');

    //   tradingDataWebSocket.onopen = () => {
    //     console.log('Connected to tradingDataWebSocket');
    //     setWebSocket(tradingDataWebSocket);
    //   };

    //   tradingDataWebSocket.onerror = (error) => {
    //     console.error('WebSocket error:', error);
    //   };

    //   tradingDataWebSocket.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     if (data.timestamp && data.trading_symbol && data.last_price) {
    //       const bar = {
    //         time: new Date(data.timestamp).getTime() / 1000,
    //         open: parseFloat(data.open_price),
    //         high: parseFloat(data.high_price),
    //         low: parseFloat(data.low_price),
    //         close: parseFloat(data.close_price),
    //       };
    //       console.log("Received bar data from WebSocket:", bar);
    //       tvWidgetRef.current.chart().updateData(bar);
    //     }
    //   };

    //   tradingDataWebSocket.onclose = (event) => {
    //     console.log('tradingDataWebSocket closed:', event);
    //     setWebSocket(null);
    //   };
    // };

    // if (!webSocket) {
    //   connectWebSocket();
    // }

    // return () => {
    //   if (webSocket) {
    //     webSocket.close();
    //     setWebSocket(null);
    //   }
    //   if (tvWidgetRef.current) {
    //     tvWidgetRef.current.remove();
    //   }
    // };
  }, [webSocket]);

  // const sendCommand = () => {
  //   console.log(`Sending command: ${instrument} for ${minutes} minute(s)`);
  //   if (webSocket && webSocket.readyState === WebSocket.OPEN) {
  //     const commandData = {
  //       instrument,
  //       minutes,
  //     };
  //     webSocket.send(JSON.stringify(commandData));
  //   } else {
  //     console.log('WebSocket is not connected.');
  //   }
  // };

  // const handleConnect = () => {
  //   if (!webSocket) {
  //     console.log('Connecting to WebSocket...');
  //     setWebSocket();
  //   } else {
  //     console.log('WebSocket is already connected.');
  //   }
  // };

  // const handleDisconnect = () => {
  //   if (webSocket) {
  //     webSocket.close();
  //     setWebSocket(null);
  //     console.log('Disconnected from WebSocket.');
  //   } else {
  //     console.log('WebSocket is not connected.');
  //   }
  // };

  return (
    <div style={{ marginTop: '20px', marginLeft: '20px' }}>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          {/* <button
            style={{
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              margin: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '5px',
            }}
            onClick={handleConnect}
          >
            Connect
          </button>
          <button
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              margin: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '5px',
            }}
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
          <input
            type="text"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            placeholder="Instrument"
            style={{color:'black', marginRight: '10px', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <select
            ref={minutesRef}
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
            className="form-control ml-2 mr-2 py-3 px-4 bg-blue-200 border border-blue-300 text-gray-800 rounded-lg text-base"
          >
            <option value="1">1 Minute</option>
            <option value="2">2 Minutes</option>
            <option value="3">3 Minutes</option>
            <option value="4">4 Minutes</option>
            <option value="5">5 Minutes</option>
          </select>
          <button
            onClick={sendCommand}
            style={{
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '5px',
            }}
          >
            Send Command
          </button> */}
        </div>
      </div>

      <div style={{ height: '480px', width: '98%' }} ref={chartContainerRef} className={'TVChartContainer'}></div>
    </div>
  );
};

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default BacktestChart;