import { CanvasShape, ResizeDirection } from "../canvasTypes";

export const lineResize = ({
  r_e,
  shape,
  mouseX,
  mouseY,
  direction,
}: {
  mouseX: number;
  mouseY: number;
  r_e: CanvasShape;
  shape: CanvasShape;
  direction: ResizeDirection | boolean;
}) => {
  const originalWidth = r_e.props.w;
  const originalHeight = r_e.props.h;
  const initialMinY = r_e.props.y;
  const initialMinX = r_e.props.x;
  const initialMaxY = r_e.props.y + r_e.props.h;
  const initialMaxX = r_e.props.x + r_e.props.w;

  if (direction == "left-edge") {
    // Determine new boundaries based on the mouse position
    const newMinX = mouseX > initialMaxX ? initialMaxX : mouseX;
    const newMaxX = mouseX > initialMaxX ? mouseX : initialMaxX;

    // Calculate the original dimensions and new width
    const newWidth = newMaxX - newMinX;

    if (originalWidth === 0) {
      return;
    }

    // Calculate the width scale factor
    const widthScaleFactor = newWidth / originalWidth;

    // Adjust the points based on the offsetX and width scale factor
    shape.props.points?.forEach((point) => {
      if (!point.offsetX) return;
      point.x = newMinX + point.offsetX * widthScaleFactor;
    });

    // Update the resized shape
    shape.props.x = newMinX;
    shape.props.w = newMaxX - newMinX;
  } else if (direction == "right-edge") {
    // Determine new boundaries based on the mouse position
    const newMinX = mouseX > initialMinX ? initialMinX : mouseX;
    const newMaxX = mouseX > initialMinX ? mouseX : initialMinX;

    // Calculate the original dimensions and new width
    const newWidth = newMaxX - newMinX;

    if (originalWidth === 0) {
      return;
    }

    // Calculate the width scale factor
    const widthScaleFactor = newWidth / originalWidth;

    // Adjust the points based on the offsetX and width scale factor
    shape.props.points?.forEach((point) => {
      if (!point.offsetX) return;
      point.x = newMaxX + point.offsetX * widthScaleFactor;
    });

    // Update the resized shape
    shape.props.x = newMinX;
    shape.props.w = newMaxX - newMinX;
  } else if (direction == "top-edge") {
    // Determine new boundaries based on the mouse position
    const newMinY = mouseY > initialMaxY ? initialMaxY : mouseY;
    const newMaxY = mouseY > initialMaxY ? mouseY : initialMaxY;

    // Calculate the original dimensions and new height
    const newHeight = newMaxY - newMinY;

    if (originalHeight === 0) {
      return;
    }

    // Calculate the height scale factor
    const heightScaleFactor = newHeight / originalHeight;

    // Adjust the points based on the offsetY and height scale factor
    shape.props.points?.forEach((point) => {
      if (point.offsetY) point.y = newMinY + point.offsetY * heightScaleFactor;
    });

    // Update the resized shape
    shape.props.y = newMinY;
    shape.props.h = newMaxY - newMinY;
  } else if (direction == "bottom-edge") {
    // Determine new boundaries based on the mouse position
    const newMinY = mouseY > initialMinY ? initialMinY : mouseY;
    const newMaxY = mouseY > initialMinY ? mouseY : initialMinY;

    // Calculate the original dimensions and new height
    const newHeight = newMaxY - newMinY;

    if (originalHeight === 0) {
      return;
    }

    // Calculate the height scale factor
    const heightScaleFactor = newHeight / originalHeight;

    // Adjust the points based on the offsetY and height scale factor
    shape.props.points?.forEach((point) => {
      point.y = newMaxY + point.offsetY * heightScaleFactor;
    });

    // Update the resized shape
    shape.props.y = newMinY;
    shape.props.h = newMaxY - newMinY;
  } else {
    let newMinX: number = 0,
      newMaxX: number = 0,
      newMinY: number = 0,
      newMaxY: number = 0;
    let newWidth,
      newHeight,
      heightScaleFactor: number,
      widthScalingFactor: number;
    switch (direction) {
      case "top-left":
        newMinX = Math.min(r_e.props.x + r_e.props.w, mouseX);
        newMinY = Math.min(r_e.props.y + r_e.props.h, mouseY);
        newMaxX = Math.max(r_e.props.x + r_e.props.w, mouseX);
        newMaxY = Math.max(r_e.props.y + r_e.props.h, mouseY);

        newWidth = newMaxX - newMinX;
        newHeight = newMaxY - newMinY;

        if (originalHeight === 0 && originalWidth === 0) {
          return;
        }
        widthScalingFactor = newWidth / originalWidth;
        heightScaleFactor = newHeight / originalHeight;
        if (shape.props.points)
          shape.props.points.forEach((point) => {
            if (!point.offsetX || !point.offsetY) return;

            point.x = newMinX + point?.offsetX * widthScalingFactor;
            point.y = newMinY + point?.offsetY * heightScaleFactor;
          });
        break;
      case "top-right":
        newMinX = Math.min(r_e.props.x, mouseX);
        newMaxX = Math.max(r_e.props.x, mouseX);
        newMinY = Math.min(r_e.props.y + r_e.props.h, mouseY);
        newMaxY = Math.max(r_e.props.y + r_e.props.h, mouseY);

        newWidth = newMaxX - newMinX;
        newHeight = newMaxY - newMinY;

        if (originalHeight === 0 && originalWidth === 0) {
          return;
        }
        widthScalingFactor = newWidth / originalWidth;
        heightScaleFactor = newHeight / originalHeight;

        if (shape.props.points)
          shape.props.points.forEach((point) => {
            if (!point.offsetX || !point.offsetY) return;
            point.y = newMinY + point.offsetY * heightScaleFactor;
            point.x = newMaxX + point.offsetX * widthScalingFactor;
          });
        break;
      case "bottom-left":
        newMinX = Math.min(r_e.props.x + r_e.props.w, mouseX);
        newMaxX = Math.max(r_e.props.x + r_e.props.w, mouseX);
        newMinY = Math.min(r_e.props.y, mouseY);
        newMaxY = Math.max(r_e.props.x, mouseY);

        newWidth = newMaxX - newMinX;
        newHeight = newMaxY - newMinY;

        if (originalHeight === 0 && originalWidth === 0) {
          return;
        }
        widthScalingFactor = newWidth / originalWidth;
        heightScaleFactor = newHeight / originalHeight;

        if (shape.props.points)
          shape.props.points.forEach((point) => {
            if (!point.offsetX || !point.offsetY) return;
            point.y = newMaxY + point.offsetY * heightScaleFactor;
            point.x = newMinX + point.offsetX * widthScalingFactor;
          });
        break;
      case "bottom-right":
        newMinX = Math.min(r_e.props.x, mouseX);
        newMaxX = Math.max(r_e.props.x, mouseX);
        newMinY = Math.min(r_e.props.y, mouseY);
        newMaxY = Math.max(r_e.props.y, mouseY);

        newWidth = newMaxX - newMinX;
        newHeight = newMaxY - newMinY;

        if (originalHeight === 0 && originalWidth === 0) {
          return;
        }
        widthScalingFactor = newWidth / originalWidth;
        heightScaleFactor = newHeight / originalHeight;

        if (shape.props.points)
          shape.props.points.forEach((point) => {
            if (!point.offsetX || !point.offsetY) return;
            point.y = newMaxY + point.offsetY * heightScaleFactor;
            point.x = newMaxX + point.offsetX * widthScalingFactor;
          });
        break;
    }
    // Update the resized shape
    shape.props.y = newMinY;
    shape.props.h = newMaxY - newMinY;
    shape.props.x = newMinX;
    shape.props.w = newMaxX - newMinX;
  }
};
