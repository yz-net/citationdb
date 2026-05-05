// @ts-nocheck

import D3Component from "../D3Component";
import * as d3 from "d3";

import "./styles.css";

export default class Histogram extends D3Component {
  constructor(props) {
    super(props);

    this.initializeChart = this.initializeChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  initializeChart() {
    const svg = d3.select(this.svg).html("");
    svg.selectAll("*").remove();

    this.xAxisG = svg.append("g").classed("axis", true).classed("x", true);
    this.yAxisG = svg.append("g").classed("axis", true).classed("y", true);
    this.barG = svg.append("g");
    this.hoverG = svg.append("g").classed("hover-targets", true);
    this.noDataText = svg
      .append("text")
      .classed("no-data-text", true)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "#999")
      .style("opacity", 0)
      .text("No Data");

    this.hoverXLabelG = svg
      .append("g")
      .classed("hover-x-label", true)
      .style("display", "none")
      .style("pointer-events", "none");
    this.hoverXLabel = this.hoverXLabelG
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .style("font-variant-numeric", "tabular-nums")
      .attr("fill", "#6e6e6e");

    this.tooltipG = svg
      .append("g")
      .classed("histogram-tooltip", true)
      .style("display", "none")
      .style("pointer-events", "none");
    this.tooltipText = this.tooltipG
      .append("text")
      .attr("fill", "#6e6e6e")
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "alphabetic");
  }

  updateChart(data) {
    data = data ?? this.props.data;
    const svg = d3.select(this.svg);

    // get width and height
    const width = svg.node()?.getBoundingClientRect()?.width ?? 0;
    const height =
      this.props.height ?? svg.node().getBoundingClientRect().height;

    const yearRange = [this.props.minYear, this.props.maxYear];
    const countRange = [0, d3.max(data?.map((x) => x.count)) ?? 1];

    const margin = this.state.margin;

    // add axes
    const xScale = d3
      .scaleBand()
      .domain(d3.range(...yearRange))
      .padding(0.5)
      .rangeRound([margin.left, width - margin.right]);

    // Always show first and last data years;
    // fill in between with years landing on multiples of 5
    const dataYears =
      data && data.length > 0 ? data.map((d) => d.label) : [this.props.minYear];
    const firstDataYear = Math.min(...dataYears);
    const lastDataYear = Math.max(...dataYears);

    // Pick tick step based on available width to avoid overlapping labels
    const chartWidth = width - margin.left - margin.right;
    const tickStep = chartWidth > 400 ? 5 : chartWidth > 200 ? 10 : 20;

    // Generate intermediate ticks, dropping any too close to the endpoints
    const minGap = tickStep * 0.6;
    const firstMultiple = Math.ceil(firstDataYear / tickStep) * tickStep;
    const intermediateTicks = d3
      .range(firstMultiple, lastDataYear + 1, tickStep)
      .filter(
        (y) =>
          y !== firstDataYear &&
          y !== lastDataYear &&
          y - firstDataYear >= minGap &&
          lastDataYear - y >= minGap,
      );

    const tickValues = [firstDataYear, ...intermediateTicks, lastDataYear];

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((e) => Math.round(e).toString())
      .tickValues(tickValues);

    this.xAxisG
      .attr("transform", `translate(${0},${height - margin.bottom})`)
      .call(xAxis);

    const yScale = d3
      .scaleLinear()
      .domain(countRange)
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSizeOuter(0)
      .ticks(height / 20)
      .tickFormat((e) => (Math.floor(e) === e ? e : undefined));

    const dur = this.isResizing ? 0 : 1000;
    if (this.isResizing) {
      this.hoverXLabelG?.interrupt().style("display", "none");
      this.tooltipG?.interrupt().style("display", "none");
      this.xAxisG?.classed("hover-active", false);
      this.hoverActive = false;
    }
    const ty = d3.transition().duration(dur).ease(d3.easeQuadIn);

    this.yAxisG
      .attr("transform", `translate(${margin.left},${0})`)
      .transition(ty)
      .call(yAxis);

    const t = (_i) => svg.transition().duration(dur).ease(d3.easeCubic);

    this.barG
      .selectAll(".bar")
      .data(data)
      .join(
        (enter, _i) =>
          enter
            .append("rect")
            .attr("class", (d) => d.barClass)
            .classed("bar", true)
            .attr("data-enter-value", (d) => d.count)
            .attr("data-label", (d) => d.label)
            .attr("y", (_d) => yScale(0))
            .attr("width", xScale.bandwidth)
            .attr("x", (d) => xScale(d.label))
            .call((enter) =>
              enter
                .transition(null)
                .attr("y", (d) => yScale(d.count ?? 0))
                .attr("height", (d) => yScale(0) - yScale(d.count ?? 0))
                .attr("width", xScale.bandwidth),
            ),
        (update) =>
          update
            .attr("data-update-value", (d) => d.count)
            .attr("class", (d) => d.barClass)
            .classed("bar", true)
            .attr("x", (d) => xScale(d.label))
            .attr("width", xScale.bandwidth)
            .call((update) =>
              update
                .transition(t(1000))
                .attr("y", (d) => yScale(d.count ?? 0))
                .attr("height", (d) => yScale(0) - yScale(d.count ?? 0)),
            ),
        (exit) =>
          exit
            .attr("data-exit-value", (d) => d.count)
            .attr("x", (d) => xScale(d.label))
            .call((exit) =>
              exit
                .transition(t(100))
                .attr("height", 0)
                .attr("y", () => yScale(0)),
            ),
      );

    const step = xScale.step();
    const bandwidth = xScale.bandwidth();
    const MOVE = 140;
    const ease = d3.easeCubicOut;

    const dataByLabel = new Map((data ?? []).map((d) => [d.label, d]));
    const firstYear = yearRange[0];

    const positionFor = (d, animate) => {
      const cx = xScale(d.label) + bandwidth / 2;
      const barTop = yScale(d.count ?? 0);

      this.hoverXLabel.text(d.label).attr("y", height - margin.bottom + 9);
      this.tooltipText.text(`${d.count ?? 0}`);

      const tooltipY = barTop - 6;

      const xLabel = animate
        ? this.hoverXLabel.transition().duration(MOVE).ease(ease)
        : this.hoverXLabel.interrupt();
      xLabel.attr("x", cx);

      const tt = animate
        ? this.tooltipText.transition().duration(MOVE).ease(ease)
        : this.tooltipText.interrupt();
      tt.attr("x", cx).attr("y", tooltipY);
    };

    const onMove = (event) => {
      const [mx] = d3.pointer(event, this.svg);
      const idx = Math.floor((mx - margin.left) / step);
      const year = firstYear + idx;
      const d = dataByLabel.get(year);
      if (!d) {
        if (this.hoverActive) {
          this.hoverActive = false;
          this.hoverXLabelG.style("display", "none");
          this.tooltipG.style("display", "none");
          this.xAxisG.classed("hover-active", false);
        }
        return;
      }
      if (!this.hoverActive) {
        this.hoverActive = true;
        this.hoverXLabelG.style("display", null);
        this.tooltipG.style("display", null);
        this.xAxisG.classed("hover-active", true);
        positionFor(d, false);
      } else {
        positionFor(d, true);
      }
    };
    const onLeave = () => {
      this.hoverActive = false;
      this.hoverXLabelG.interrupt().style("display", "none");
      this.tooltipG.interrupt().style("display", "none");
      this.xAxisG.classed("hover-active", false);
    };

    this.hoverG
      .selectAll(".hover-overlay")
      .data([null])
      .join("rect")
      .attr("class", "hover-overlay")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", Math.max(0, width - margin.left - margin.right))
      .attr("height", Math.max(0, height - margin.top - margin.bottom))
      .attr("fill", "transparent")
      .on("mousemove", onMove)
      .on("mouseleave", onLeave);

    this.hoverXLabelG.raise();
    this.tooltipG.raise();

    // show/hide "No Data" text based on whether data is present
    const hasData = data && data.length > 0;
    this.noDataText
      .attr("x", width / 2)
      .attr("y", (height - margin.bottom + margin.top) / 2)
      .style("opacity", hasData ? 0 : 1);
  }
}
