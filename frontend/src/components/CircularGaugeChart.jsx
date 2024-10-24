// CircularGaugeChart.jsx
import React, { useEffect, useRef } from 'react';
import anychart from 'anychart';

const CircularGaugeChart = ({ data, labels, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Charger AnyChart depuis le CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.anychart.com/releases/v8/js/anychart-base.min.js';
    script.async = true;
    script.onload = () => initializeChart();
    document.body.appendChild(script);

    const initializeChart = () => {
      const chart = anychart.gauges.circular();
      chart.data(data);

      // Configurer la palette de couleurs
      const palette = anychart.palettes.distinctColors().items([
        '#64b5f6', '#1976d2', '#ef6c00', '#ffd54f', '#455a64',
        '#96a6a6', '#dd2c00', '#00838f', '#00bfa5', '#ffa000'
      ]);

      // Initialiser le graphique
      chart
        .fill('#fff')
        .stroke(null)
        .padding(0)
        .margin(100)
        .startAngle(0)
        .sweepAngle(270);

      const axis = chart.axis().radius(100).width(1).fill(null);
      axis
        .scale()
        .minimum(0)
        .maximum(100)
        .ticks({ interval: 1 })
        .minorTicks({ interval: 1 });
      axis.labels().enabled(false);
      axis.ticks().enabled(false);
      axis.minorTicks().enabled(false);

      const makeBarWithBar = (radius, i, width) => {
        chart
          .label(i)
          .text(labels[i] + ', <span style="">' + data[i] + '%</span>')
          .useHtml(true);
        chart
          .label(i)
          .hAlign('center')
          .vAlign('middle')
          .anchor('right-center')
          .padding(0, 10)
          .height(width / 2 + '%')
          .offsetY(radius + '%')
          .offsetX(0);

        chart
          .bar(i)
          .dataIndex(i)
          .radius(radius)
          .width(width)
          .fill(palette.itemAt(i))
          .stroke(null)
          .zIndex(5);
        chart
          .bar(i + 100)
          .dataIndex(i)
          .radius(radius)
          .width(width)
          .fill('#F5F4F4')
          .stroke(null)
          .zIndex(4);
      };

      // Ajouter des barres
      for (let i = 0; i < data.length; i++) {
        makeBarWithBar(100 - i * 20, i, 17);
      }

      // Ajouter un titre
      chart.title(title)
        .useHtml(true)
        .hAlign('center')
        .padding(0)
        .margin([0, 0, 20, 0]);

      chart.container(chartRef.current);
      chart.draw();
    };
  }, [data, labels, title]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default CircularGaugeChart;
