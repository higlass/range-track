import { scaleLinear } from 'd3-scale';

const RangeTrack = function RangeTrack(HGC, ...args) {
  if (!new.target) {
    throw new Error(
      'Uncaught TypeError: Class constructor cannot be invoked without "new"'
    );
  }

  const PIXI = HGC.libraries.PIXI;
  const { colorToHex } = HGC.utils;

  class RangeTrackClass extends HGC.tracks.BarTrack {
    constructor(context, options) {
      super(context, options);

      this.maxAndMin = {
        max: null,
        min: null
      };

      this.mode = options.mode === 'whisker' ? 'whisker' : 'minMax';
    }

    rerender(options, force) {
      this.mode = options.mode === 'whisker' ? 'whisker' : 'minMax';
      super.rerender(options, force);
    }

    /**
     * Draws exactly one tile.
     * @param tile
     */
    renderTile(tile) {
      if (!tile.graphics) return;

      const { graphics } = tile;

      const { tileX, tileWidth } = this.getTilePosAndDimensions(
        tile.tileData.zoomLevel,
        tile.tileData.tilePos,
        this.tilesetInfo.bins_per_dimension || this.tilesetInfo.tile_size
      );
      const tileValues = tile.tileData.dense;

      if (tileValues.length === 0) return;

      // equal to the smallest non-zero value
      const [valueScale] = this.makeValueScale(
        this.minVisibleValue(),
        this.medianVisibleValue,
        this.maxValue(),
        0
      );

      this.valueScale = valueScale;

      const colorScale = valueScale.copy();
      colorScale.range([254, 0]).clamp(true);

      graphics.clear();

      this.drawAxis(this.valueScale);

      if (
        this.options.valueScaling === 'log' &&
        this.valueScale.domain()[1] < 0
      ) {
        console.warn(
          'Negative values present when using a log scale',
          this.valueScale.domain()
        );
        return;
      }

      // this scale should go from an index in the data array to
      // a position in the genome coordinates
      const tileXScale = scaleLinear()
        .domain([
          0,
          this.tilesetInfo.tile_size || this.tilesetInfo.bins_per_dimension
        ])
        .range([tileX, tileX + tileWidth]);

      tile.drawnAtScale = this._xScale.copy();

      switch (this.mode) {
        case 'whisker':
          this.renderWhisker(tile, tileXScale);
          break;

        case 'minMax':
        default:
          graphics.children.forEach(child => {
            graphics.removeChild(child);
          });
          this.renderMinMax(tile, tileXScale);
          break;
      }
    }

    renderMinMax(tile, tileXScale) {
      const tileValues = tile.tileData.dense;
      const stepSize = tile.tileData.size;

      const color = this.options.minMaxColor || 'grey';
      const colorHex = colorToHex(color);
      const opacity = +this.options.minMaxOpacity || 1;

      tile.graphics.beginFill(colorHex, opacity);

      let xPos;
      let width;
      let yStartPos;
      let yEndPos;
      let height;

      const numVals = tileValues.length / stepSize;
      for (let i = 0; i < numVals; i++) {
        xPos = this._xScale(tileXScale(i));
        yStartPos = this.valueScale(tileValues[i * stepSize]);
        yEndPos = this.valueScale(tileValues[i * stepSize + 1]);
        width = this._xScale(tileXScale(i + 1)) - xPos;
        height = Math.max(1, yStartPos - yEndPos) || 1;

        this.addSVGInfo(tile, xPos, yEndPos, width, height, color);

        // this data is in the last tile and extends beyond the length
        // of the coordinate system
        if (tileXScale(i) > this.tilesetInfo.max_pos[0]) break;

        tile.graphics.drawRect(xPos, yEndPos, width, height);
      }
    }

    renderWhisker(tile, tileXScale) {
      const tileValues = tile.tileData.dense;
      const stepSize = tile.tileData.size;

      const minMaxG = new PIXI.Graphics();
      const stdG = new PIXI.Graphics();
      const meanG = new PIXI.Graphics();

      tile.graphics.addChild(minMaxG);
      tile.graphics.addChild(stdG);
      tile.graphics.addChild(meanG);

      const stdColor = this.options.stdColor || 'black';
      const stdColorHex = colorToHex(stdColor);
      const stdOpacity =
        +this.options.stdOpacity >= 0 ? +this.options.stdOpacity : 0.2;
      stdG.beginFill(stdColorHex, stdOpacity);

      const minMaxColor = this.options.minMaxColor || 'red';
      const minMaxColorHex = colorToHex(minMaxColor);
      const minMaxOpacity =
        +this.options.minMaxOpacity >= 0 ? +this.options.minMaxOpacity : 0.66;
      minMaxG.beginFill(minMaxColorHex, minMaxOpacity);

      const meanColor = this.options.meanColor || 'black';
      const meanColorHex = colorToHex(meanColor);
      const meanOpacity =
        +this.options.meanOpacity >= 0 ? +this.options.meanOpacity : 1;
      meanG.beginFill(meanColorHex, meanOpacity);

      let xPos;
      let width;
      let yMax;
      let yMin;
      let yMean;
      let std;

      const numVals = tileValues.length / stepSize;
      for (let i = 0; i < numVals; i++) {
        xPos = this._xScale(tileXScale(i));
        width = this._xScale(tileXScale(i + 1)) - xPos;

        yMin = this.valueScale(tileValues[i * stepSize]);
        yMax = this.valueScale(tileValues[i * stepSize + 1]);
        yMean = this.valueScale(tileValues[i * stepSize + 2]);
        std = Math.abs(
          this.dimensions[1] - this.valueScale(tileValues[i * stepSize + 3])
        );

        // this data is in the last tile and extends beyond the length
        // of the coordinate system
        if (tileXScale(i) > this.tilesetInfo.max_pos[0]) break;

        minMaxG.drawRect(xPos, yMin, width, 1);
        minMaxG.drawRect(xPos, yMax, width, 1);

        stdG.drawRect(xPos, yMean - std, width, std * 10);

        meanG.drawRect(xPos, yMean, width, 1);
      }
    }

    tileToLocalId(tile) {
      return `${tile.join('.')}.${this.mode}`;
    }

    tileToRemoteId(tile) {
      return this.tileToLocalId(tile);
    }

    /**
     * Here, rerender all tiles every time track size is changed
     *
     * @param newDimensions
     */
    setDimensions(newDimensions) {
      super.setDimensions(newDimensions);
      const visibleAndFetched = this.visibleAndFetchedTiles();
      visibleAndFetched.map(a => this.initTile(a));
    }
  }
  return new RangeTrackClass(...args);
};

const icon =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="598px" height="568px" viewBox="0 0 5980 5680" preserveAspectRatio="xMidYMid meet"> <g id="layer101" fill="#000000" stroke="none"> <path d="M0 2840 l0 -2840 2990 0 2990 0 0 2840 0 2840 -2990 0 -2990 0 0 -2840z"/> </g> <g id="layer102" fill="#ff1388" stroke="none"> <path d="M180 4780 l0 -740 630 0 630 0 0 740 0 740 -630 0 -630 0 0 -740z"/> <path d="M1700 4050 l0 -1470 550 0 550 0 0 1470 0 1470 -550 0 -550 0 0 -1470z"/> <path d="M3100 2990 l0 -2530 610 0 610 0 0 2530 0 2530 -610 0 -610 0 0 -2530z"/> <path d="M4580 3670 l0 -1850 610 0 610 0 0 1850 0 1850 -610 0 -610 0 0 -1850z"/> <path d="M0 1920 l0 -1920 2990 0 2990 0 0 810 0 810 -730 0 -730 0 0 -680 0 -680 -810 0 -810 0 0 1060 0 1060 -700 0 -700 0 0 730 0 730 -750 0 -750 0 0 -1920z"/> </g> <g id="layer103" fill="#ffffff" stroke="none"> <path d="M0 1920 l0 -1920 2990 0 2990 0 0 810 0 810 -730 0 -730 0 0 -680 0 -680 -810 0 -810 0 0 1060 0 1060 -700 0 -700 0 0 730 0 730 -750 0 -750 0 0 -1920z"/> </g> </svg>';

// default
RangeTrack.config = {
  type: 'range',
  datatype: ['vector'],
  orientation: '1d-horizontal',
  thumbnail: new DOMParser().parseFromString(icon, 'text/xml').documentElement,
  availableOptions: [
    'mode',
    'minMaxColor',
    'minMaxOpacity',
    'meanColor',
    'meanOpacity',
    'stdColor',
    'stdOpacity'
  ],
  defaultOptions: {
    mode: 'minMax',
    minMaxColor: '#000000',
    minMaxOpacity: 0.66,
    meanColor: '#ff0000',
    meanOpacity: 1,
    stdColor: '#000000',
    stdOpacit: 0.2
  }
};

export default RangeTrack;