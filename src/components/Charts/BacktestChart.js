import React, { useEffect, useRef, useState } from 'react';
import { widget } from '../../charting_library';
import { createChart, CrosshairMode } from 'lightweight-charts';
const BacktestChart = () => {4


  const chartContainerRef = useRef(null);
  const tvWidgetRef = useRef(null);

  const [datastoreStatus, setdatastoreStatus] = useState(null);
 // const [selectedValue, setSelectedValue] = useState('');
 const selectedOptionRef=useRef(null);
 let coordinates=[];
   
  let linetype_data=[]; 
  let timePriceStore = [];
  let timePriceStoreUnix = [];
  let current_line_id=null;
  let current_dropdown_option=null;
  let current_line_mode=null;
  // let last_offsetX=null;
  // let last_offsetY=null;
  let current_line_ids=[];
  let all_stock_data=[];
  let all_data=[];
  let all_coordinates=[];
  // let all_data_lines=[];
  // let crossHairSubscription = null;

  const defaultProps = {
    symbol: 'AAPL',
    interval: 'D',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: true,
    chart_scroll: true,
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
    const yellowDiv = document.createElement('div');

// Apply styling to make it yellow
yellowDiv.className='yellowdiv';
yellowDiv.style.backgroundColor = 'yellow';
yellowDiv.style.width = '700px'; // Example width
yellowDiv.style.height = '700px'; // Example height
yellowDiv.style.margin = '10px'; // Example margin
yellowDiv.style.alignContent='center';
    chartContainerRef.current.appendChild(yellowDiv);
   // tvWidgetRef.current.appendChild(yellowDiv);

    // Initialize TradingView widget
    tvWidgetRef.current = new widget(widgetOptions);

    tvWidgetRef.current.onChartReady(() => {
      const obj1=tvWidgetRef.current.chart();
      const drawitem=obj1.getAllShapes();
         // const subscribeToDrawingEvent= () =>{
        let prev_id=null; 
        tvWidgetRef.current.subscribe('drawing_event', (lid, lmode) => {
          if(prev_id!=lid){
            current_line_ids.push(lid);
            prev_id=lid;

          }
         
          if (lmode === "remove") {
            console.log("Remove the line from chart!!!");
            console.log("Line ID:", lid);
            let remove_line=lid;
            console.log("Mode:", lmode);
            if(all_stock_data[remove_line]){
              all_stock_data[remove_line]=[];
            }
            // Implement your logic to remove the line from the chart
          }
          if (lmode === "create") {
            current_line_id = lid;
           
            current_line_mode = lmode;
      
            
          }
        });
     // }
      // Function to handle crossHairMoved event
      let stock_type_status=false;
      const handleCrossHairMoved = ({ time, price,offsetX,offsetY }) => {
        //subscribeToDrawingEvent();
        
        let date = new Date(time * 1000);
        let formattedDate = date.toISOString();
        console.log({time,price});
        console.log({formattedDate,price});
        console.log("Saving data during crosshair event");
        timePriceStore.push({ time: formattedDate, price: price });
        timePriceStoreUnix.push({ time: time, price: price });

        coordinates.push({offsetX:offsetX,offsetY:offsetY})

        const labelElement = document.createElement('div');
       
        labelElement.className = 'selected-label'; // Add a class name for easy identification
        labelElement.style.position = 'absolute';
        labelElement.style.left = `${offsetX}px`;  // Setting left position with offsetX
        labelElement.style.top = `${offsetY}px`;   // Setting top position with offsetY
       
        labelElement.style.padding = '8px';
        labelElement.style.backgroundColor = 'yellow';
        labelElement.style.border = '1px solid black';
        labelElement.style.zIndex = 1000; // Ensure it's above other elements
        // selectedOptionRef.current
        let store_color=current_dropdown_option;
        labelElement.textContent = selectedOptionRef.current;
        console.log("the line color up till now is")
        console.log(labelElement.textContent);
        if(stock_type_status===false){  
     
        chartContainerRef.current.appendChild(labelElement);
        linetype_data.push(current_dropdown_option);
        stock_type_status=true;
        }
       
      

      };
      // Function to set line color based on selectedOptionRef.current
const setLineColor = () => {
  let lineColor;

  if (selectedOptionRef.current === "buy-line") {
      console.log("its a buy line");
      lineColor = 'rgba(0, 255, 0, 1)'; // Green line
  } else if (selectedOptionRef.current === "sell-line") {
      console.log("its a sell line");
      lineColor = 'rgba(255, 0, 0, 1)'; // Red line
  } else if (selectedOptionRef.current === "target-line") {
      console.log("its a target line");
      lineColor = 'rgba(128, 0, 128, 1)'; // Purple line
  } else if (selectedOptionRef.current === "stop-watch") {
      console.log("its a stop-watch line");
      lineColor = 'rgba(255, 255, 0, 1)'; // Yellow line
  } else {
      console.log("its a line without any tag");
      lineColor = 'rgba(255, 255, 255, 1)'; // Default (white) line
  }

  // Apply the determined line color
  tvWidgetRef.current.applyOverrides({ linecolor: lineColor });
};


      // Function to handle drawing event
      const handleDrawingEvent = (event) => {
       // setLineColor();
       
      
        console.log(obj1.getAllShapes());
        if (event.value === "LineToolTrendLine") {
        
          tvWidgetRef.current.activeChart().crossHairMoved().subscribe(null, handleCrossHairMoved);
        }
      };

      // Subscribe to drawing events
      tvWidgetRef.current.subscribe('drawing', handleDrawingEvent);
     
      const handleMouseDown=()=>{
        setLineColor();
       
      }
    


      // Function to handle mouseup event
      const handleMouseUp = () => {
        console.log("Mouse up detected, unsubscribing from crossHairMoved event");
        all_data.push(timePriceStore);
     
        stock_type_status=false;
        all_coordinates.push(coordinates);
        let filtered_coordinates=all_coordinates.filter(item=>item.length>0);
       // last_offsetX=all_coordinates[all_coordinates.length-1].offsetX;
        //last_offsetY=all_coordinates[all_coordinates.length-1].offsetY;
        //are the last coordinates of current line
        let filtered_data = all_data.filter(item => item.length > 0);
       
        console.log("LINEID-ARR , LINEDATA-ARR , LINETYPE-ARR");
        console.log(current_line_ids);
        console.log(filtered_data);
        console.log(linetype_data);

       
          if(current_line_ids.length && filtered_data.length ){
            for (let i = 0; i < current_line_ids.length; i++) {
              all_stock_data[current_line_ids[i]] ={linedata:filtered_data[i],linestocktype:linetype_data[i]}
            }
            
            console.log("now the data after is ....");
            console.log(all_stock_data);
  
          }     
    
        timePriceStore=[];
        timePriceStoreUnix=[];
        coordinates=[];
        current_dropdown_option=null; // if not selected any option and made the next line do give label as null
        // Unsubscribe from crossHairMoved event
       tvWidgetRef.current.activeChart().crossHairMoved().unsubscribe(null, handleCrossHairMoved);
      };

      // Subscribe to mouse_up event to unsubscribe from crossHairMoved
       tvWidgetRef.current.subscribe('mouse_up', handleMouseUp);
       tvWidgetRef.current.subscribe('mouse_down', handleMouseDown);

      // Cleanup function
      return () => {
        if (tvWidgetRef.current) {
          tvWidgetRef.current.remove();
        }
      };
    });
  }, []); // Include relevant dependencies
  const handleDropdownChange = (event) => {
   // setSelectedValue(event.target.value);
   selectedOptionRef.current=event.target.value;
   current_dropdown_option=selectedOptionRef.current;
  };
  return (
    <>
    <div style={{ marginTop: '20px', marginLeft: '20px' }}>
      {/* UI elements (buttons, inputs, etc.) can be added here if needed */}
      <div ref={chartContainerRef} className={'TVChartContainer w-full h-full'}></div>
      <div>
  
  <select id="action-select" value={selectedOptionRef.current || ''} onChange={handleDropdownChange} style={{position: 'relative',backgroundColor:'black',zIndex:'11',top:'-9pc',width:'55px',color:'white'}}>
   
    <option disabled selected value="">select Line Type</option>
    <option value="buy-line">Buy-line</option>
    <option value="sell-line">Sell-line</option>
    <option value="stop-watch">Stop-watch</option>
    <option value="target-line">Target-line</option>
  </select>
</div>
     
    </div>
    
   </>
  );
};

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default BacktestChart;