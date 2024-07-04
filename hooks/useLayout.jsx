const useLayout = ({ width_legend }) => {
  const layout = new (function () {
      this.margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 60,
      };
      this.w = 1450;
      this.h = 520;
    })(),
    layout_top_line = new (function () {
      this.margin = {
        right: 50,
        bottom: 10,
      };
      this.x = 0;
      this.y = 6;
      this.w = layout.w - this.margin.right - width_legend;
      this.h = 10;
    })(),
    layout_main_chart = new (function () {
      this.margin = {
        right: 40,
        bottom: 30,
      };
      this.x = 0;
      this.y = layout_top_line.h + layout_top_line.margin.bottom;
      this.w = layout_top_line.w;
      this.h = layout.h - 95;
    })(),
    layout_minimap = new (function () {
      this.w = layout_main_chart.w;
      this.h = 50;
      this.x = 0;
      this.y = layout.h - this.h;
    })(),
    layout_legends = {
      x: layout_main_chart.w + layout_main_chart.margin.right,
      y: 5,
      w: width_legend,
      h: layout.h,
    };

  return {
    layout,
    layout_top_line,
    layout_main_chart,
    layout_minimap,
    layout_legends,
  };
};

export default useLayout;
