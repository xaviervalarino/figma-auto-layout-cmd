type LayoutMode = "fill" | "hug" | "fixed";

type LayoutChild = (
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | EllipseNode
  | FrameNode
  | GroupNode
  | HighlightNode
  | InstanceNode
  | LineNode
  | PolygonNode
  | RectangleNode
  | SliceNode
  | StampNode
  | StarNode
  | TextNode
  | VectorNode
  | WashiTapeNode
) & { parent: FrameNode | ComponentNode | InstanceNode };
