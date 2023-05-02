// primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
// counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "BASELINE";
//

export default class LayoutAligner {
  node;
  verticalAxis: "primaryAxisAlignItems" | "counterAxisAlignItems";
  horizontalAxis: "primaryAxisAlignItems" | "counterAxisAlignItems";
  constructor(node: AutoLayoutNode) {
    this.node = node;
    if (node.layoutMode === "VERTICAL") {
      this.verticalAxis = "counterAxisAlignItems";
      this.horizontalAxis = "primaryAxisAlignItems";
    } else {
      this.verticalAxis = "primaryAxisAlignItems";
      this.horizontalAxis = "counterAxisAlignItems";
    }
  }
  // get leftColumn() {
  //   return;
  // }
  // set leftColumn(position) {}
  //
  // get centerColumn() {
  //   return;
  // }
  // set centerColumn(position) {}
  //
  // get rightColumn() {
  //   return;
  // }
  // set rightColumn(position) {}

  get position() {
    const position = [];
    if (this.node[this.verticalAxis] === "MIN") {
      position.push("left");
    } else if (this.node[this.verticalAxis] === "CENTER") {
      position.push("center");
    } else {
      position.push("right");
    }
    if (this.node[this.horizontalAxis] === "MIN") {
      position.push("top");
    } else if (this.node[this.horizontalAxis] === "CENTER") {
      position.push("middle");
    } else {
      position.push("bottom");
    }
    return <AlignmentPosition>position;
  }

  set position([column, row]: AlignmentPosition) {
    if (column === "left") {
      this.node[this.verticalAxis] = "MIN";
    } else if (column === "center") {
      this.node[this.verticalAxis] = "CENTER";
    } else {
      this.node[this.verticalAxis] = "MAX";
    }
    if (row === "top") {
      this.node[this.horizontalAxis] = "MIN";
    } else if (row === "middle") {
      this.node[this.horizontalAxis] = "CENTER";
    } else {
      this.node[this.horizontalAxis] = "MAX";
    }
  }
}
