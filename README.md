# HiGlass Range Track

> A track for plotting ranges in HiGlass

[![HiGlass](https://img.shields.io/badge/higlass-👍-red.svg?colorB=000000)](http://higlass.io)
[![Demo](https://img.shields.io/badge/demo-🙈-red.svg?colorB=fa0460)](https://higlass.github.io/range-track)
[![npm version](https://img.shields.io/npm/v/higlass-range.svg?colorB=fa04ac)](https://www.npmjs.com/package/higlass-range)
[![Build Status](https://img.shields.io/travis/higlass/range-track/master.svg?colorB=c304fa)](https://travis-ci.org/higlass/range-track)
[![code style prettier](https://img.shields.io/badge/code_style-prettier-9a04fa.svg)](https://github.com/prettier/prettier)

![HiGlass](/teaser.png?raw=true 'A beautiful set of ranges')

**Live Demo:** [https://higlass.github.io/range-track](higlass.github.io/range-track)

**Note**: This is the source code for range track only! You might want to check out the following repositories as well:

- HiGlass viewer: https://github.com/higlass/higlass
- HiGlass server: https://github.com/higlass/higlass-server
- HiGlass docker: https://github.com/higlass/higlass-docker

## Installation

```
npm install higlass-range
```

## Usage

1. Make sure you load the range track prior to `hglib.js`. E.g.:

```
<script src="higlass-range.js"></script>
<script src="hglib.js"></script>
<script>
  ...
</script>
```

2. Configure the track in the view config.

```
{
  top: [
    {
      server: 'http://higlass.io/api/v1',
      tilesetUid: 'PjIJKXGbSNCalUZO21e_HQ',
      uid: 'range',
      type: 'range',
      options: {
        mode: 'whisker',
        resolution: 10
      }
    }
  ],
  ...
}
```

Take a look at [`example/index.html`](example/index.html) for an example.

3. You did it! We're so proud of you 🎉. You are truly the best!

4. If you are curious about all the available options, please see the table below:

| Name             | Description                                               | Default  | Type   |
|------------------|-----------------------------------------------------------|----------|--------|
| mode             | Range mode. Can either be `minMax` or `whisker`           | `minMax` | string |
| resolution       | Number of data point to aggregate into one bar            | `1`      | number |
| minMaxColor      | Color of the min-max range bar                            | `black`  | string |
| minMaxOpacity    | Opacity of the min-max range bar                          | `0.66`   | number |
| minColor         | Color of the min whisker line                             | `black`  | string |
| minOpacity       | Opacity of the min whisker line                           | `1`      | number |
| maxColor         | Color of the max whisker line                             | `black`  | string |
| maxOpacity       | Opacity of the max whisker line                           | `1`      | number |
| meanColor        | Color of the mean whisker line                            | `black`  | string |
| meanOpacity      | Opacity of the mean whisker line                          | `1`      | number |
| stdFillColor     | Fill color of the std body of the whisker plot            | `white`  | string |
| stdFillOpacity   | Opacity of the fill color of std body of the whisker plot | `1`      | number |
| stdStrokeColor   | Color of the std border of the whisker plot               | `black`  | string |
| stdStrokeOpacity | Opacity of the std border of the whisker plot             | `1`      | number |
| vLineColor       | Color of the vertical line of the whisker plot            | `black`  | string |
| vLineOpacity     | Opacity of the vertical line of the whisker plot          | `1`      | number |

## Development

### Installation

```bash
$ git clone https://github.com/higlass/range-track && range-track
$ npm install
```

### Commands

**Developmental server**: `npm start`
**Production build**: `npm run build`
