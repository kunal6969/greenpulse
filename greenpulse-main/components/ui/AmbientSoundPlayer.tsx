import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AmbientSoundPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = isMuted;

        if (!isMuted) {
            // Attempt to play audio, catching potential browser restrictions
            audio.play().catch(error => {
                console.warn("Audio autoplay was prevented by the browser. User interaction is required to start the sound.", error);
                // In case play fails, revert the state to reflect that audio is not playing.
                setIsMuted(true);
            });
        }
    }, [isMuted]);

    return (
        <>
            {/* The audio element is not visible to the user */}
            <audio ref={audioRef} loop preload="auto">
                <source src="https://assets.mixkit.co/sfx/preview/mixkit-wind-chimes-in-the-breeze-1158.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* The control button */}
            <button
                onClick={toggleMute}
                className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-card-bg/50 backdrop-blur-lg border border-glass-border text-text-secondary hover:text-primary hover:border-primary/50 transition-all duration-300 shadow-lg"
                aria-label={isMuted ? 'Unmute background sound' : 'Mute background sound'}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </>
    );
};

export default AmbientSoundPlayer;