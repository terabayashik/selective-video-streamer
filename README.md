# selective-video-streamer

Selective video streamer.

## Get started

### Prerequisite

To stream, make sure [SRS](https://ossrs.io/lts/en-us/) is running on your
machine. For more information, please refer to
[this document](https://ossrs.io/lts/en-us/docs/v4/doc/sample-hls-cluster/).

### Build and Start

```sh
# Clone this repo
git clone https://github.com/terabayashik/selective-video-streamer.git
cd selective-video-streamer

# Install dependencies
npm i

# Build
npm run build

# Start
npm run start
```

## How to control stream

### Start stream

Access `/start` to start stream. Query `dirpath` and `filename` are required.

```sh
curl "localhost:3000/start?dirpath=/path/to/vid&filename=video.mp4"
```

Now, you can play stream from "http://localhost:8080/live/video.m3u8"

### Stop stream

Access `/stop` to stop stream. Query `dirpath` and `filename` for existing
stream are required.

```sh
curl "localhost:3000/stop?dirpath=/path/to/vid&filename=video.mp4"
```

### Get stream info

Access `/info` to get stream info.

```sh
curl "localhost:3000/info"
```
