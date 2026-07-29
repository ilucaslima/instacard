export class text {
  static generate(width: number, height: number, tspans: string) {
    return Buffer.from(`
  <svg width="${width}" height="${height}">
    <style>
      .title {
        fill: black;
        font-size: 40px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        text-align: left;
      }
    </style>

    <text 
      text-anchor="start"
      class="title"
    >
      ${tspans}
    </text>
  </svg>
`);
  }
}
