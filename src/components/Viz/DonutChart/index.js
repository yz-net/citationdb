//@ts-nocheck
import React from "react";
import { OrdinalFrame } from "semiotic";

import preprocess from "../../../utils/preprocess";

export default class DonutChart extends React.Component {
  render() {
    const data = preprocess(this.props.data, this.props.maxItems);

    const frameProps = {
      /* --- data --- */
      // data: [{ user: "Jason", tweets: 40, retweets: 5, favorites: 15 },
      // { user: "Susie", tweets: 5, retweets: 25, favorites: 100 }],
      data: data,
      /* --- Size --- */
      size: [300, 300],
      margin: 70,

      /* --- Layout --- */
      type: { type: "bar", innerRadius: 50 },
      projection: "radial",
      dynamicColumnWidth: this.props.valueField,

      /* --- Process --- */
      oAccessor: "label",

      /* --- Customize --- */
      style: { fill: "#ac58e5", stroke: "white" },
      title: this.props.title,

      /* --- Annotate --- */
      oLabel: false,
      hoverAnnotation: true,
    };
    return (
      <div className="Viz">
        <OrdinalFrame {...frameProps} />
      </div>
    );
  }
}
