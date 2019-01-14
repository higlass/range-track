# HiGlass Range Track

> A track for plotting ranges in HiGlass

[![HiGlass](https://img.shields.io/badge/higlass-👍-red.svg?colorB=000000)](http://higlass.io)
[![Demo](https://img.shields.io/badge/demo-🙈-red.svg?colorB=000000)](https://higlass.github.io/range-track)
[![Build Status](https://img.shields.io/travis/higlass/range-track/master.svg?colorB=000000)](https://travis-ci.org/higlass/range-track)
[![code style prettier](https://img.shields.io/badge/code_style-prettier-80a1ff.svg)](https://github.com/prettier/prettier)

![HiGlass](/teaser.jpg?raw=true 'A beautiful set of ranges')

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

_Note:_ We assume that you have created and ingested a SQLite-based image tileset database. If you're asking yourself "what the fu\*! are they talking about" please check out our [image tiles to SQLite converter](https://github.com/flekschas/image-tiles-to-sqlite).

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
      uid: 'my-fancy-ranges',
      type: 'range',
      server: 'http://localhost:8001/api/v1/',
      tilesetUid: 'my-fancy-ranges',
      options: {
        name: 'My fancy tiled image'
      }
    },
  ],
  ...
}
```

Take a look at [`example/index.html`](example/index.html) for an example.

3. You did it! We're so proud of you 🎉. You are truly the best!

## Development

### Installation

```bash
$ git clone https://github.com/higlass/range-track && range-track
$ npm install
```

### Commands

**Developmental server**: `npm start`
**Production build**: `npm run build`
