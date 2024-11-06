// src/components/YT.js
import React from 'react';
import YouTube from 'react-youtube';

// Default playlist (Jasur's list)
export const jasursList = [

    /* { title: 'NAME', url: 'LINK' }, */

    { title: 'Charlie Puth - Attention', url: 'https://youtu.be/Oz5JDtkf1as' },
    { title: 'Something Just Like This', url: 'https://youtu.be/FM7MFYoylVs?si=TrbAGj-JAUeEJ4bd' },
    { title: 'Bruno Mars - Grenade', url: 'https://youtu.be/4YrzJ9RZ9qY' },
    { title: 'Let Me Love You', url: 'https://youtu.be/SMs0GnYze34?si=T-UORWGqJCoitcOM' },
    { title: 'Sweet But Psycho', url: 'https://youtu.be/2KBFD0aoZy8' },
    { title: 'Who`s laughing now', url: 'https://youtu.be/4JYSgIiSZSA?si=3v9kDuzvYJvWaOsO' },
    { title: 'Girls Like You', url: 'https://youtu.be/aJOTlE1K90k' },
    { title: 'Camila Cabello - Havana', url: 'https://youtu.be/HCjNJDNzw8Y?si=QjZAi7GPIc4ParOQ' },
    { title: 'Maroon 5 - Memories', url: 'https://www.youtube.com/watch?v=SlPhMPnQ58k&pp=ygUPbWFyb29uIG1lbW9yaWVz' },
    { title: 'post malone - rockstar (feat. 21 savage)', url: 'https://www.youtube.com/watch?v=9lQP9-F8kIQ' },
    { title: 'Drake - God`s plan', url: 'https://www.youtube.com/watch?v=ScfgOVJiu_I' },
    { title: 'Dua Lipa - Levitating', url: 'https://www.youtube.com/watch?v=j2c3tR_qfiQ' },
    { title: 'Justin Bieber - Baby', url: 'https://www.youtube.com/watch?v=khOFw2f4bQY' },

    { title: 'State of Grace', url: 'https://www.youtube.com/watch?v=gr4cqcqnAN0' },
    { title: 'Taylor Swift - Back To December', url: 'https://youtu.be/QUwxKWT6m7U?si=LNPBWKl0DqXIfOP2' },
    { title: 'As it was', url: 'https://youtu.be/Qfm6nfz1QNQ?si=3mMjYFpALij7GELl' },
    { title: 'Taylor Swift - Begin Again', url: 'https://youtu.be/cMPEd8m79Hw?si=9zE5-51p0xGyEgSO' },
    { title: 'Sofia', url: 'https://youtu.be/ftI_Lp7LAuU?si=aOFT5Ral2-A_2PxG' },
    { title: 'Numb (lyrics|rock)', url: 'https://youtu.be/8P0vKLHbtMg?si=HhXMHjE8vD2yeC_B' },
    { title: 'For The Rest Of My Life', url: 'https://youtu.be/PHbZ9SXHJwA?si=_7a2Gaka2oPEWrCQ' },
    { title: 'Insha Allah', url: 'https://youtu.be/8xXJyFNfiy8?si=XkqgGm4hEyZoqJe1' },
    { title: 'Hunger Games | Atlas', url: 'https://youtu.be/Lh3TokLzzmw?si=I5CcdBNIEuwDZvVT' },
    { title: 'Hard To Say I`m Sorry', url: 'https://youtu.be/XCmOdVia9DE?si=60M6i15UUakuL7DH' },
    { title: 'Sasha Sloan - Lie', url: 'https://youtu.be/AzjTJpzfB8U?si=PHYxAGETm1P1opd0' },
    { title: 'Solo Para Ti', url: 'https://youtu.be/5D_A4IBWSv4?si=pgNinSqUyLBks6po' },
    { title: 'Баста - Выпускной', url: 'https://youtu.be/t1-yL-xvklc?si=YZ1rS5hZtleOFOy1' },
    { title: 'La Cintura', url: 'https://youtu.be/Eg4LUvUjUWI?si=YqeuNfTh_iTuj-dP' },
    { title: 'Diamond Heart', url: 'https://youtu.be/bcHoBDw4G10?si=auASu-G_c9NkS48Z' },
    { title: 'Halsey - Sorry', url: 'https://youtu.be/CPAoMCo7tNw?si=2rEiXXCn6UcySUVZ' },
    { title: 'Relax, Take it Easy', url: 'https://youtu.be/EVDYmBrl02Q?si=ODB07HFZCtTtg4F4' },
    { title: 'Thank you Allah', url: 'https://youtu.be/RBrdl0v_anc?si=cu3qNsVyUIIzZGvv' },
    { title: 'Let me down slowly', url: 'https://youtu.be/50VNCymT-Cs?si=sEwBTlJCeuqL9LTD' },
    { title: 'Lonely (acoustic)', url: 'https://youtu.be/Cu5hhxP_prE?si=VRZVlVcLWqk8Dasg' },
    { title: 'Selfish love', url: 'https://youtu.be/9gqAq6kq5Ek?si=Gro32XWDuPLWzyIv' },
    { title: 'twenty one pilots: Heathens', url: 'https://youtu.be/UprcpdwuwCg?si=O6_fwxx8TOkfjIXi' },
    { title: 'Don`t Let Me Down', url: 'https://youtu.be/Io0fBr1XBUA?si=SUp9MdCXlOU_Vf5s' },
    { title: 'Someone you loved', url: 'https://youtu.be/zABLecsR5UE?si=k3rryaA0P3O8JBhY' },
    { title: 'Lucid Dreams', url: 'https://youtu.be/IfBLD0ATrQA?si=YS-eU-zZX-5dbISw' },
    { title: 'Fed up with us', url: 'https://youtu.be/n1NTv6Y4pxs?si=76WA3JI0TGILBHm7' },
    { title: 'Skyfall', url: 'https://youtu.be/DeumyOzKqgI?si=Cok0dR7byK6pN682' },
    { title: 'Story of my life', url: 'https://youtu.be/W-TE_Ys4iwM?si=RViOxRuaXxdz3pmm' },
    { title: 'Reamonn - Tonight', url: 'https://youtu.be/jtoncUzV6nA?si=yULSO1-MxnAVV13i' },
    { title: 'Hymn For The Weekend', url: 'https://www.youtube.com/watch?v=YykjpeuMNEk' },
    { title: 'Hell Or High Water', url: 'https://youtu.be/zgDbp5C74sU?si=R8Q5HZq2vzhGL57g' },
    { title: 'Lonely', url: 'https://youtu.be/M4hvSgnsnog?si=TtDhe_NUHM1NZaY9' },
    { title: 'Everything I Need', url: 'https://www.youtube.com/watch?v=9bCp7j3nC30' },
    { title: 'Love the way you lie', url: 'https://youtu.be/h_-JFUci0BM?si=SHiuHs1NdIjpN0WP' },
    { title: 'Moving Mountains', url: 'https://youtu.be/S_0r3hYg78o?si=Be6GShy7mgRcl9Ha' },
    { title: 'Numb (cover)', url: 'https://youtu.be/gHp-OjLOG5A?si=0abUDswbKz6rhQeX' },
    { title: 'Until I found you', url: 'https://youtu.be/oIKuyj2GQtY' },
    { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
    { title: 'Holes', url: 'https://youtu.be/DeFWClW7skQ?si=hkIGl-CTTw-FbnLz' },
    { title: 'Survivors', url: 'https://www.youtube.com/watch?v=vN0gaXS8dQE' },
    { title: 'Irakliy - Ya s toboy(cover)', url: 'https://youtu.be/3WmdZOF5bKk?si=LcXY8Gohxxx4cZSA' },
    { title: 'Vetrom stat` (cover)', url: 'https://youtu.be/kkzEs0gdvZI?si=Z456wgKuJd0aE_PA' },
    { title: 'Reamonn - Supergirl', url: 'https://youtu.be/ctmS5XX67Ek?si=NGZGPw0bcpfZciyi' },
    { title: 'Another Love', url: 'https://youtu.be/Jkj36B1YuDU?si=Yku5tRPe7avRNr2R' },
    { title: 'All the little lights', url: 'https://youtu.be/OkxVxox--Io?si=AE4wj_c_uqTWGrbB' },
    { title: 'Arcade', url: 'https://youtu.be/Qau6mObfSGM?si=RsrcZ0VUCOHaEwE4' },
    { title: 'Burito - Po volnam', url: 'https://youtu.be/jqyJ4xW2gb0?si=VgrA4JKMWkeWDIA5' },
    { title: 'To Be Free', url: 'https://youtu.be/hNd5pILkpSw?si=qiwZxiuS0yeiuOPs' },
    { title: 'Castle of Glass', url: 'https://www.youtube.com/watch?v=PPkJeWPP2nM' },
    { title: 'Ava Max - Alone', url: 'https://youtu.be/omvW1cI-3xg?si=zHiFadZaUUpddcgu' },
    { title: 'Let Her Go (ft Ed Sheeran)', url: 'https://youtu.be/HTcL9WkB_wg?si=ILXw9EaPM4GJyx29' },
    { title: 'In the end (rmx)', url: 'https://youtu.be/WNeLUngb-Xg?si=V95nGOt0sMvhQG7c' },
    { title: 'No Time To Die', url: 'https://youtu.be/GB_S2qFh5lU?si=XDH6CdXhqJq-g321' },
    { title: 'Tired Of Being Sorry', url: 'https://youtu.be/gzFmctgW0s8?si=JfvG_0Sj-IdPWoBY' },
    { title: 'Wonderful Life', url: 'https://youtu.be/qzn_6bXdgeE?si=BgnimyD5Frnn_-o-' },
    { title: 'Shape of My Heart', url: 'https://youtu.be/pm3rDbXbZRI?si=7TxDuViBxhHGeZoU' },
    { title: 'Today is a Good Day', url: 'https://youtu.be/qfv0j1FyjWw?si=djHeR7tPQQALeLoq' },






];

// YouTube player options with 16:9 ratio
const opts = {
    playerVars: {
        autoplay: 1,              // Disable autoplay by default
        controls: 0,              // Show player controls
        modestbranding: 1,        // Minimize YouTube branding
        rel: 0,
    },
};

// Extract YouTube video ID
export const extractVideoId = (url) => {
    // eslint-disable-next-line
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// YTPlayer component
const YTPlayer = ({ currentVideoIndex, videoTracks, onVideoEnd, playerRef, autoplay }) => {
    // Handle out-of-bounds index gracefully
    const videoId = videoTracks[currentVideoIndex]?.url ? extractVideoId(videoTracks[currentVideoIndex].url) : '';

    const playerOpts = {
        ...opts,
        playerVars: {
            ...opts.playerVars,
            autoplay: autoplay ? 1 : 0, // Set autoplay based on the prop
        },
    };

    return (
        <YouTube
            videoId={videoId}
            opts={playerOpts}
            onEnd={onVideoEnd}
            ref={playerRef}
        />
    );
};

export default YTPlayer;
