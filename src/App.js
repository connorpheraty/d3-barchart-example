import React, { useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/connorpheraty/d3-barchart-example/main/src/data.csv"
    ).then(function (data) {
      data.forEach(function (d) {
        d.gdp = +d.gdp;
      });
      drawChart(data);
    });
  });

  const drawChart = (data) => {
    const svg = d3.select("#chartId");

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = { top: 50, right: 40, bottom: 75, left: 100 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const chartTitle = "Countries ranked by GDP";
    const barChartXAxisLabel = "GDP";

    const xValue = (d) => +d.gdp;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.country;
        })
      )
      .range([0, innerHeight])
      .padding(0.1);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "axis");

    g.append("text")
      .attr("x", innerWidth / 2 - 125)
      .attr("y", 0 - margin.top / 2)
      .attr("class", "chart-title")
      .text(chartTitle);

    const xAxisTickFormat = (number) =>
      d3.format(".3s")(number).replace("G", "B");

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);

    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`);

    xAxisG.select(".domain").remove();

    xAxisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", 50)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .text(barChartXAxisLabel);

    const yAxis = d3.axisLeft(yScale);

    const yAxisG = g.append("g").call(yAxis);

    yAxisG.selectAll(".tick text").attr("class", "y-axis-ticks");

    yAxisG.select(".domain").remove();

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr("y", function (d) {
        return yScale(d.country) + 5;
      })
      .attr("width", function (d) {
        return xScale(d.gdp);
      })
      .attr("height", yScale.bandwidth() / 2)
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("opacity", 0.5);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).attr("opacity", 1);
      })
      // Make div appear
      .on("mouseover", function () {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function (event, d) {
        return tooltip
          .style("top", event.pageY + 30 + "px")
          .style("left", event.pageX + 20 + "px")
          .html("GDP: $" + d3.format(".3s")(d.gdp).replace("G", "B"));
      })
      // Make div disappear
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });
  };

  return (
    <div className="App">
      <div className="container">
        <svg id="chartId" height="750" width="1200" className="svg-chart"></svg>
      </div>
    </div>
  );
}

export default App;
