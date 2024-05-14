import Big from 'big.js';
import { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import {
  DataZoomComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { renderToString } from 'react-dom/server';
import { Panel } from 'roku-ui';
import { timeConverter } from '../../utils';
import Chart from './Chart';
import { BarSeriesDataType } from '../../types';
import { ComposeOption } from 'echarts/core';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared.js';
import { CallbackDataParams } from 'echarts/types/dist/shared.js';

type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | ToolboxComponentOption
  | DataZoomComponentOption
>;

export default function StackedHorizontalChart({
  seriesData,
  xAxisData,
  showLoading = false,
  title,
}: {
  seriesData: BarSeriesDataType[];
  xAxisData: string[];
  showLoading?: boolean;
  title: string;
}) {
  return (
    <Panel
      border
      className="flex rounded-lg overflow-hidden"
      style={{ minHeight: '350px', width: '100%' }}
    >
      <Chart
        option={getOption(seriesData, xAxisData, title)}
        showLoading={showLoading}
      />
    </Panel>
  );
}

function getOption(
  barSeriesData: BarSeriesDataType[],
  xAxisData: string[],
  title: string
): EChartsOption {
  return {
    title: {
      left: 'center',
      text: title,
    },
    dataZoom: [
      {
        type: 'slider',
      },
    ],
    toolbox: {
      show: true,
      showTitle: false,
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (param: TopLevelFormatterParams) => {
        const params = param as CallbackDataParams[];
        const tooltipItems = TooltipItems(params);
        const html = (
          <>
            <span>{params[0].name}</span>
            <br />
            {tooltipItems.length === 0 ? 'There is nothing here' : tooltipItems}
          </>
        );

        return renderToString(html);
      },
    },
    legend: {
      type: 'scroll',
      top: '8%',
    },
    grid: {
      left: '4%',
      right: '6%',
      containLabel: true,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => {
          return `${Big(value).div(3600).toFixed(0)} h`;
        },
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    series: barSeriesData,
  };
}

function TooltipItems(params: CallbackDataParams[]) {
  return params
    .filter(({ value }) => typeof value === 'number' && Math.floor(value) > 0)
    .map(({ color, seriesName, value, seriesId }) => {
      return (
        <div
          key={seriesId}
          style={{
            margin: '0 0 0',
            lineHeight: 1,
          }}
        >
          <div style={{ margin: '0 0 0', lineHeight: 1 }}>
            <span
              style={{
                display: 'inline-block',
                marginRight: '4px',
                borderRadius: '10px',
                width: '10px',
                height: '10px',
                backgroundColor: color === undefined ? '' : color.toString(),
              }}
            ></span>
            <span
              style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: 400,
                marginLeft: '2px',
              }}
            >
              {seriesName}
            </span>
            <span
              style={{
                float: 'right',
                marginLeft: '20px',
                fontSize: '14px',
                color: '#666',
                fontWeight: 900,
              }}
            >
              {timeConverter(typeof value === 'number' ? value : 0)}
            </span>
            <div style={{ clear: 'both' }}></div>
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>
      );
    });
}
