import YouTube from 'react-youtube';

const opts = {
    playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
    },
};

export const extractVideoId = (url) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        }
    } catch (e) {
        return null;
    }
    return null;
};

const YTPlayer = ({ currentVideoId, videoTracks, onVideoEnd, playerRef, autoplay }) => {
    const videoId = videoTracks.find(video => video.id === currentVideoId)?.url ? extractVideoId(videoTracks.find(video => video.id === currentVideoId).url) : '';

    const playerOpts = {
        ...opts,
        playerVars: {
            ...opts.playerVars,
            autoplay: autoplay ? 1 : 0,
        },
    };

    return (
        <div>
            <YouTube
                key={videoId}
                videoId={videoId}
                opts={playerOpts}
                onEnd={onVideoEnd}
                ref={playerRef}
            />
        </div>
    );
};

export default YTPlayer;
