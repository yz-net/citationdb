//@ts-nocheck
"use client";

import { PureComponent, createRef } from "react";

export default class D3Component extends PureComponent {
  constructor(props) {
    super(props);

    this.svg = createRef();
    this.initializeChart = this.initializeChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.redrawChart = this.redrawChart.bind(this);
    this.setMargin = this.setMargin.bind(this);

    this.state = {
      currentWidth: -1,
      margin: props.margin ?? {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };

    this.margin = props.margin ?? {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  }

  setMargin(newMargin) {
    const margin = { ...this.state.margin, ...newMargin };
    this.setState({ margin });
  }

  componentDidUpdate() {
    this.updateChart(this.props.data);
  }

  componentDidMount() {
    this.initializeChart();
    this.updateChart();

    if (typeof ResizeObserver !== "undefined" && this.svg?.parentElement) {
      this.resizeObserver = new ResizeObserver(() => this.redrawChart());
      this.resizeObserver.observe(this.svg.parentElement);
    }
  }

  componentWillUnmount() {
    this.resizeObserver?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  render() {
    return (
      <svg
        className="w-full"
        style={{ overflow: "visible" }}
        ref={(el) => {
          this.svg = el;
        }}
      />
    );
  }

  redrawChart() {
    const newWidth = this.svg?.getBoundingClientRect().width ?? 0;
    if (newWidth === this.state.currentWidth) return;
    this.state.currentWidth = newWidth;

    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.isResizing = true;
      this.updateChart();
      this.isResizing = false;
    });
  }

  // Override this
  initializeChart() {}

  // Override this
  updateChart(_data) {}
}
