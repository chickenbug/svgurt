import { getFractalDispacementForPoint } from './fractal';
import {
  getPixelColorAtXY,
  isInColorThreshhold,
  getPixelColorIntensity
} from './color';

export function renderCircles(svgSettings, circles) {
  const {
    outputScale
  } = svgSettings;

  let renderString = '';
  let i = 0;
  for (i = 0; i < circles.length; i++) {
    const { x, y, r, strokeWidth, strokeColor } = circles[i];
    renderString += `<circle cx="${x * outputScale}" cy="${y * outputScale}" r="${r * outputScale}" style="stroke: ${strokeColor}; stroke-width: ${strokeWidth}; fill: none;" />`;
  }

  return renderString;
}

function createCircleAtPoint(baseX, baseY, settings, pixelColor) {
  const {
    applyFractalDisplacement,
    radius,
    radiusOnColor,
    radiusRandomness,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness
  } = settings;

  const x = baseX;
  const y = baseY;

  let circleRadius = radius;
  if (radiusOnColor) {
    circleRadius = getPixelColorIntensity(pixelColor, settings) * radius;
  }

  circleRadius *= (1 - (Math.random() * radiusRandomness));

  const circle = { x, y,
    r: circleRadius,
    strokeColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  if (applyFractalDisplacement) {
    const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(circle.x, circle.y, settings);

    circle.x += xDisplacement;
    circle.y += yDisplacement;
  }

  return circle;
}

export function createCircles(settings, imageData, width, height) {
  const {
    renderEveryXPixels,
    renderEveryYPixels
  } = settings;

  const circles = [];

  for (let x = 0; x < width; x += renderEveryXPixels) {
    for (let y = 0; y < height; y += renderEveryYPixels) {
      const pixelColor = getPixelColorAtXY(imageData, x, y, width);
      if (!isInColorThreshhold(pixelColor, settings)) {
        continue;
      }

      circles.push(createCircleAtPoint(x, y, settings, pixelColor));
    }
  }

  return circles;
}

