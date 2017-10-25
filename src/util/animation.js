import { svg, path } from '../map-settings';
import { transition } from 'd3-transition';
import { LineString } from 'd3-geo';
import { drawArcs } from './map';

const delta = path => {
  const length = path.getTotalLength();

  return i => t => {
    const point = path.getPointAtLength(t * length);
    const _t = Math.min(t + 0.05, 1);
    const _point = path.getPointAtLength(_t * length);
    const scale = Math.min(Math.sin(Math.PI * t) * 0.7, 0.3);

    return `translate(${point.x},${point.y}) scale(${scale})`;
  }
}

export const itemTransition = (item, route) => {
  const length = route.node().getTotalLength();
  item.transition()
    .duration(length * 50)
    .attrTween('transform', delta(route.node()))
    .on('end', _ => route.remove())
    .remove();
    // todo remove
}

/**
 * coordinates: [[x1, y1], [x2, y2]]
 * path: related path
 * svg: related svg
 */
export const moveItemAlongPath = (coordinates) => {
  const route = svg.append('path')
    .datum(coordinates)
    .attr('class', 'route')
    .attr('d', drawArcs);

  const item = svg.append('circle')
    .attr('class', 'moving-item')
    .attr('r', 20);

    itemTransition(item, route);
}
