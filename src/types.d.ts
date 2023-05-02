type LayoutMode = "fill" | "hug" | "fixed";
type Dimension = "HORIZONTAL" | "VERTICAL";

interface LayoutSizer {
  node: LayoutChild;
  horizontal: LayoutMode;
  vertical: LayoutMode;
}

type AutoLayoutNode = ComponentNode | ComponentSetNode | FrameNode | InstanceNode;
type AutoLayoutChild = AutoLayoutNode & { parent: AutoLayoutNode };

type TextFrameChild = TextNode & { parent: AutoLayoutNode };

type LayoutChild =
  | AutoLayoutChild
  | TextFrameChild
  | ((
      | BooleanOperationNode
      | EllipseNode
      | GroupNode
      | HighlightNode
      | LineNode
      | PolygonNode
      | RectangleNode
      | SliceNode
      | StampNode
      | StarNode
      | VectorNode
      | WashiTapeNode
    ) & { parent: AutoLayoutNode });

type AlignmentPosition = [column: "left" | "center" | "right", row: "top" | "middle" | "bottom"];
