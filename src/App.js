import React, { useEffect } from "react";
import * as d3 from "d3";
import './App.css';
import top20GDP from "./data/top_20_countries_gdp.csv"

function App() {
  console.log(top20GDP)

  useEffect(() => {
    drawChart();
  });

  const drawChart = () => {
    const svg = d3.select("#barChart")

    const width = +svg.attr("width")
    const height = +svg.attr("height")
    const margin = { top: 40, right: 40, bottom: 165, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const renderBarChart = (data) => {
      console.log(data)

      const xScale = d3
        .scaleLinear()
        .domain([0, 21433226000000])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleBand()
        .domain(data.map(function(d) {return d.country}))
        .range([0, innerHeight])
        .padding(0.1);

      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("display", "inline-block")
        .style("background-color", "#FFFFFF")
        .style("padding", "10px")
        .style("border", "1px #000000 solid")
        .style("border-radius", "5px")
        .attr("fill-opacity", 100);

      const g = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left}, ${margin.top})`
        )
        .attr("class", "axis");

      const xAxisTickFormat = (number) =>
        d3.format(".3s")(number).replace("G", "B");

      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);

      g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll(".domain, .tick line")
        .remove();

      const xAxisG = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

      xAxisG.select(".domain").remove();

      xAxisG
        .append("text")
        .attr("class", "axis-label")
        .attr("y", 50)
        .attr("x", innerHeight / 2)
        .attr("fill", "black")
        .style("font-size", "18px")

      g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d) {return yScale(d.country)})
        .attr("width", function(d) {return xScale(d.gdp)})
        .attr("height", yScale.bandwidth() / 2)
        .on("mouseenter", function (event, d) {
          d3.select(this).attr("opacity", 0.5);
        })
        .on("mouseleave", function (event, d) {
          d3.select(this).attr("opacity", 1);
        })
        .on("mouseover", function () {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (event, d) {
          return tooltip
            .style("top", event.pageY + 30 + "px")
            .style("left", event.pageX + 20 + "px")
            .html(
              d.country +
                "<br> $" +
              d.gdp
            );
        })
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden");
        });
      };
    d3.csv(top20GDP, function(data) {
      console.log(top20GDP)
      renderBarChart(data)
    })
  }


  return (
    <div className="App">
      <h1>Hello</h1>
      <svg id="barChart" width="1290" height="850"></svg>
    </div>
  );
}

export default App;

