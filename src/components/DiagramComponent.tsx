
import React from 'react';

interface BoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color?: string;
}

interface ArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label?: string;
  color?: string;
}

interface DiagramProps {
  width?: number;
  height?: number;
  boxes: BoxProps[];
  arrows: ArrowProps[];
  title?: string;
}

const DiagramComponent: React.FC<DiagramProps> = ({
  width = 800,
  height = 400,
  boxes,
  arrows,
  title
}) => {
  const renderBox = (box: BoxProps, index: number) => {
    const { x, y, width, height, label, color = 'currentColor' } = box;
    
    return (
      <g key={`box-${index}`}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          className="diagram-box"
          style={{ stroke: color }}
          rx={8}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="diagram-text"
          fill={color}
        >
          {label}
        </text>
      </g>
    );
  };

  const renderArrow = (arrow: ArrowProps, index: number) => {
    const { startX, startY, endX, endY, label, color = 'currentColor' } = arrow;
    
    // Calculate the direction vector
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize the direction vector
    const nx = dx / length;
    const ny = dy / length;
    
    // Calculate the arrow head points
    const arrowLength = 10;
    const arrowWidth = 6;
    
    // Calculate the point where the arrow stops (slightly before the end to account for the box)
    const stopX = endX - nx * 15;
    const stopY = endY - ny * 15;
    
    // Calculate arrowhead points
    const arrowPoint1X = stopX - arrowLength * nx + arrowWidth * ny;
    const arrowPoint1Y = stopY - arrowLength * ny - arrowWidth * nx;
    const arrowPoint2X = stopX - arrowLength * nx - arrowWidth * ny;
    const arrowPoint2Y = stopY - arrowLength * ny + arrowWidth * nx;
    
    // Calculate the position for the label (midpoint of the arrow)
    const labelX = (startX + endX) / 2;
    const labelY = (startY + endY) / 2 - 10;
    
    return (
      <g key={`arrow-${index}`}>
        <path
          d={`M${startX},${startY} L${stopX},${stopY}`}
          className="diagram-arrow"
          style={{ stroke: color }}
        />
        <polygon
          points={`${stopX},${stopY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
          fill={color}
        />
        {label && (
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            className="diagram-text text-xs"
            fill={color}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="diagram w-full overflow-auto">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
        {arrows.map(renderArrow)}
        {boxes.map(renderBox)}
      </svg>
    </div>
  );
};

export default DiagramComponent;
