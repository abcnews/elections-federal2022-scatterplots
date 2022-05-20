// https://www.stator-afm.com/tutorial/plotting-stock-correlations-in-stator-and-d3-js/
export function calcPearsonsCorrelation(data: any[]) {
  const xy: number[] = [];
  const x2: number[] = [];
  const y2: number[] = [];

  for (let i = 0; i < data.length; i++) {
    xy.push(data[i].x * data[i].y);
    x2.push(data[i].x * data[i].x);
    y2.push(data[i].y * data[i].y);
  }

  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_x2 = 0;
  let sum_y2 = 0;

  for (let i = 0; i < data.length; i++) {
    sum_x += data[i].x;
    sum_y += data[i].y;
    sum_xy += xy[i];
    sum_x2 += x2[i];
    sum_y2 += y2[i];
  }

  const step1 = data.length * sum_xy - sum_x * sum_y;
  const step2 = data.length * sum_x2 - sum_x * sum_x;
  const step3 = data.length * sum_y2 - sum_y * sum_y;
  const step4 = Math.sqrt(step2 * step3);
  const answer = step1 / step4;
  return answer.toFixed(3);
}
