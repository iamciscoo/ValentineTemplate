"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   PARTICLES COMPONENT
   ───────────────────────────────────────────── */
function Particles() {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const count = window.innerWidth < 768 ? 10 : 40;
        const generated = Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 20,
            opacity: Math.random() * 0.4 + 0.1,
        }));
        setParticles(generated);
    }, []);

    return (
        <div className="particles">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND
   ───────────────────────────────────────────── */
function AmbientCanvas() {
    return (
        <div className="ambient-canvas">
            <div className="ambient-orb ambient-orb--1" />
            <div className="ambient-orb ambient-orb--2" />
            <div className="ambient-orb ambient-orb--3" />
        </div>
    );
}

/* ─────────────────────────────────────────────
   REVEAL WRAPPER — appears on scroll
   ───────────────────────────────────────────── */
function Reveal({
    children,
    delay = 0,
    direction = "up",
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: isMobile ? 0.05 : 0.15, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const dirMap = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { y: 0, x: 40 },
        right: { y: 0, x: -40 },
        none: { y: 0, x: 0 },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{
                opacity: 0,
                y: dirMap[direction].y,
                x: dirMap[direction].x,
            }}
            animate={
                isVisible
                    ? { opacity: 1, y: 0, x: 0 }
                    : { opacity: 0, y: dirMap[direction].y, x: dirMap[direction].x }
            }
            transition={{
                duration: 1.2,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   PROGRESSIVE TEXT — reveals letter by letter
   ───────────────────────────────────────────── */
function ProgressiveText({
    text,
    className = "",
    stagger = 0.03,
    delay = 0,
}: {
    text: string;
    className?: string;
    stagger?: number;
    delay?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <span ref={ref} className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{
                        duration: 0.6,
                        delay: delay + i * stagger,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

/* ─────────────────────────────────────────────
   BLUR FRAGMENT — reveals through scroll
   ───────────────────────────────────────────── */
function BlurFragment({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                    setRevealed(true);
                }
            },
            { threshold: [0, 0.4] }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`ineffable__fragment ${revealed ? "revealed" : ""} ${className}`}
        >
            {children}
            <div className="ineffable__blur-overlay" />
        </div>
    );
}

/* ─────────────────────────────────────────────
   TIMELINE NODE
   ───────────────────────────────────────────── */
function TimelineNode({
    children,
    label,
}: {
    children: React.ReactNode;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={ref}
            className={`serendipity__node ${visible ? "visible" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="serendipity__label">{label}</div>
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   CELEBRATION CONFETTI
   ───────────────────────────────────────────── */
function CelebrationParticles() {
    const [particles, setParticles] = useState<any[]>([]);

    const colors = [
        "#f472b6",
        "#fda4af",
        "#c4b5fd",
        "#93c5fd",
        "#fcd34d",
        "#fb923c",
        "#a78bfa",
        "#f9a8d4",
    ];

    useEffect(() => {
        const generated = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * -10}%`,
            size: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
        }));
        setParticles(generated);
    }, []);

    return (
        <>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="celebration__particle"
                    style={{
                        left: p.left,
                        bottom: p.bottom,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </>
    );
}

/* ═════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═════════════════════════════════════════════ */
export default function Home() {
    const [showCelebration, setShowCelebration] = useState(false);
    const [expandedArtifact, setExpandedArtifact] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioInitialized = useRef(false);

    const { scrollYProgress } = useScroll({ target: containerRef });

    // Handle music initialization and browser autoplay policies
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.07;
        audio.preload = "none"; // Don't preload until requested or interacted with

        const startMusic = () => {
            if (audioInitialized.current) return;

            audio.play().then(() => {
                audio.volume = 0.07; // Set volume AFTER play starts for mobile compatibility
                setIsPlaying(true);
                audioInitialized.current = true;
                // Clean up ALL listeners
                ["click", "touchstart", "mousedown", "keydown", "scroll"].forEach(e => {
                    window.removeEventListener(e, startMusic);
                });
            }).catch(err => {
                // Keep listeners if it failed somehow
                console.log("Audio unlock failed, waiting for next interaction.");
            });
        };

        // NEVER call audio.play() automatically on mount, it triggers the NotAllowedError.
        // Instead, we wait for the very first interaction.
        ["click", "touchstart", "mousedown", "keydown", "scroll"].forEach(e => {
            window.addEventListener(e, startMusic, { passive: false });
        });

        return () => {
            ["click", "touchstart", "mousedown", "keydown", "scroll"].forEach(e => {
                window.removeEventListener(e, startMusic);
            });
        };
    }, []);

    const toggleMusic = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!audioRef.current) return;

        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.volume = 0.03;
            audio.play().then(() => {
                audio.volume = 0.03;
                setIsPlaying(true);
            }).catch(err => console.error("Toggle failed:", err));
        }
    };

    /* Parallax values for presence act */
    const presenceY = useTransform(scrollYProgress, [0, 0.1], [0, -80]);
    const presenceOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

    const handleYes = useCallback(() => {
        setShowCelebration(true);
        document.body.style.overflow = "hidden";
    }, []);

    return (
        <>
            <AmbientCanvas />
            <Particles />

            <audio
                ref={audioRef}
                src="/Beyoncé- All Night(Official Instrumental) [6gf_cPNKkOw] (1).mp3"
                loop
                playsInline
                preload="none"
            />

            {/* Subtle Music Toggle */}
            <motion.button
                className="music-toggle"
                onClick={toggleMusic}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 1000,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    backdropFilter: "blur(4px)",
                }}
            >
                {isPlaying ? "♪" : "×"}
            </motion.button>

            <div className="journey" ref={containerRef}>
                {/* ═══════════════════════════════════════
                    INTRODUCTION (PRESENCE)
                    ═══════════════════════════════════════ */}
                <section className="act act--presence" id="act-presence">
                    <div className="presence__breath-ring" />
                    <div className="presence__breath-ring presence__breath-ring--2" />
                    <div className="presence__breath-ring presence__breath-ring--3" />

                    <motion.div
                        className="presence__text-container"
                        style={{ y: presenceY, opacity: presenceOpacity }}
                    >
                        <motion.h1
                            className="display-text display-text--sub"
                            style={{ color: "var(--full)", marginBottom: "10px" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 3, delay: 0.5 }}
                        >
                            ♡ For Oprah
                        </motion.h1>

                        <motion.p
                            className="body-text"
                            style={{ color: "rgba(255,255,255,0.45)", textAlign: "center" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 3, delay: 1.5 }}
                        >
                            This is a journey through words.
                        </motion.p>

                        <motion.p
                            className="body-text"
                            style={{ color: "rgba(255,255,255,0.35)", textAlign: "center" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 3, delay: 3 }}
                        >
                            Words that, to me, are the only way to describe you.
                        </motion.p>

                        <motion.p
                            className="body-text"
                            style={{ color: "rgba(255,255,255,0.15)", textAlign: "center", fontSize: "14px" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 4, delay: 5 }}
                        >
                            scroll slowly
                        </motion.p>
                    </motion.div>

                    <div className="presence__scroll-hint">
                        <div className="scroll-line" />
                        <span className="scroll-label">begin</span>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT I: ETHEREAL
                    ═══════════════════════════════════════ */}
                <section className="act act--ethereal" id="act-ethereal">
                    <div className="act__inner">
                        <Reveal>
                            <p className="chapter-label">Act I</p>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="ethereal__definition">
                                <h2 className="display-text display-text--section">
                                    <span className="ethereal__glow-word">Ethereal</span>
                                </h2>
                                <p className="ethereal__phonetic">/ɪˈθɪəriəl/</p>
                                <p className="ethereal__meaning">
                                    adjective, extremely delicate and light, in a way that seems
                                    too perfect for this world.
                                </p>
                            </div>
                        </Reveal>

                        <div className="ethereal__moments">
                            <Reveal delay={0.1}>
                                <div className="ethereal__moment">
                                    <p className="poetic-text">
                                        There is a kind of beauty<br />
                                        that doesn&apos;t demand to be seen.
                                    </p>
                                    <div className="ethereal__divider" />
                                    <p className="body-text">
                                        It doesn&apos;t shout. It doesn&apos;t compete. It simply exists, and
                                        somehow, that&apos;s enough to re-arrange every room it enters.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.1} direction="right">
                                <div className="ethereal__moment ethereal__moment--right">
                                    <p className="poetic-text">
                                        She moves through the world<br />
                                        like light moves through water.
                                    </p>
                                    <div className="ethereal__divider" />
                                    <p className="body-text" style={{ marginLeft: "auto" }}>
                                        Softly. Without force. Bending everything around her effortlessly,
                                        and making the ordinary feel impossibly beautiful.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.1}>
                                <div className="ethereal__moment ethereal__moment--center">
                                    <p className="poetic-text">
                                        Some people remind you<br />
                                        <span className="ethereal__glow-word">that gentleness is not weakness.</span>
                                    </p>
                                    <div className="ethereal__divider" />
                                    <p className="body-text" style={{ textAlign: "center", margin: "0 auto" }}>
                                        That the softest voice in the room can carry the most weight.
                                        That kindness, in a world this loud, is an act of quiet rebellion.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.15} direction="left">
                                <div className="ethereal__moment">
                                    <p className="poetic-text">
                                        You are that person.
                                    </p>
                                    <p className="body-text">
                                        Every smile, every glance, every unspoken understanding. It all feels
                                        like it was lifted from somewhere beyond here. Somewhere softer.
                                        Somewhere <span className="ethereal__glow-word">ethereal</span>.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT II: INEFFABLE
                    ═══════════════════════════════════════ */}
                <section className="act act--ineffable" id="act-ineffable">
                    <div className="act__inner">
                        <Reveal>
                            <p className="chapter-label">Act II</p>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <h2 className="display-text display-text--section" style={{ marginBottom: "20px" }}>
                                <span className="ineffable__rose-accent">Ineffable</span>
                            </h2>
                            <p className="body-text" style={{ marginBottom: "60px" }}>
                                <em>/ɪnˈɛfəb(ə)l/</em>, too great or extreme to be expressed in words.
                            </p>
                        </Reveal>

                        <div className="ineffable__fragments">
                            <BlurFragment>
                                <Reveal delay={0.1}>
                                    <p className="poetic-text">
                                        How do you describe something<br />
                                        that refuses to fit inside language?
                                    </p>
                                    <p className="body-text" style={{ marginTop: "20px" }}>
                                        I&apos;ve tried. I&apos;ve searched for the right word. The exact combination of
                                        letters that captures what it feels like to be near you. But every word
                                        I find feels too small. Too flat. Too <em>human</em>.
                                    </p>
                                </Reveal>
                            </BlurFragment>

                            <BlurFragment>
                                <Reveal delay={0.1}>
                                    <p className="poetic-text">
                                        It&apos;s the feeling<br />
                                        <span className="ineffable__rose-accent">between the last note</span><br />
                                        and the silence after.
                                    </p>
                                    <p className="body-text" style={{ marginTop: "20px" }}>
                                        That pause where your chest tightens and the world holds its breath.
                                        That&apos;s the closest I can get. That tiny, infinite moment. That&apos;s
                                        what you feel like.
                                    </p>
                                </Reveal>
                            </BlurFragment>

                            <BlurFragment>
                                <Reveal delay={0.1}>
                                    <p className="poetic-text">
                                        You are the word<br />
                                        I keep trying to invent.
                                    </p>
                                    <p className="body-text" style={{ marginTop: "20px" }}>
                                        A word that means <em>&quot;safe&quot;</em> and <em>&quot;thrilling&quot;</em> at the same time.
                                        That means <em>&quot;home&quot;</em> even when we&apos;re nowhere near one. That means
                                        <span className="ineffable__rose-accent"> &quot;everything I didn&apos;t know I was looking for.&quot;</span>
                                    </p>
                                </Reveal>
                            </BlurFragment>

                            <BlurFragment>
                                <Reveal delay={0.1}>
                                    <div className="ethereal__moment ethereal__moment--center">
                                        <p className="poetic-text" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                                            Some things are too real for words.
                                        </p>
                                        <p className="body-text" style={{ textAlign: "center", margin: "20px auto 0" }}>
                                            So I won&apos;t try to contain this in a sentence.<br />
                                            I&apos;ll just let you feel it, the way I do.
                                        </p>
                                    </div>
                                </Reveal>
                            </BlurFragment>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT III: SERENDIPITY
                    ═══════════════════════════════════════ */}
                <section className="act act--serendipity" id="act-serendipity">
                    <div className="act__inner">
                        <Reveal>
                            <p className="chapter-label">Act III</p>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <h2 className="display-text display-text--section" style={{ marginBottom: "16px" }}>
                                <span className="serendipity__amber">Serendipity</span>
                            </h2>
                            <p className="body-text" style={{ marginBottom: "60px" }}>
                                <em>/ˌsɛr.ənˈdɪp.ɪ.ti/</em>. The occurrence of events by chance in a happy way.
                            </p>
                        </Reveal>

                        <div className="serendipity__timeline">
                            <TimelineNode label="The Probability">
                                <p className="poetic-text">
                                    Of all the lives being lived right now,
                                </p>
                                <p className="body-text" style={{ marginTop: "12px" }}>
                                    in all the cities, on all the streets, in all the rooms where someone is
                                    staring at the ceiling wondering if the universe ever gets these things
                                    right, somehow, inexplicably, our timelines intersected.
                                </p>
                            </TimelineNode>

                            <TimelineNode label="The Coincidence">
                                <p className="poetic-text">
                                    There wasn&apos;t supposed to be <span className="serendipity__amber">a moment.</span>
                                </p>
                                <p className="body-text" style={{ marginTop: "12px" }}>
                                    Not a grand entrance, not a movie scene. Just ordinary circumstance
                                    doing extraordinary things. A conversation that lasted too long, a laugh
                                    that rang too clear, a silence that felt too comfortable for two people who
                                    barely knew each other.
                                </p>
                            </TimelineNode>

                            <TimelineNode label="The Recognition">
                                <p className="poetic-text">
                                    And then something clicked.
                                </p>
                                <p className="body-text" style={{ marginTop: "12px" }}>
                                    Not like a switch. More like a sunrise. Gradual, undeniable, and
                                    impossible to look away from once you noticed it was happening.
                                    The recognition that this wasn&apos;t chance anymore. This was
                                    <span className="serendipity__amber"> something.</span>
                                </p>
                            </TimelineNode>

                            <TimelineNode label="The Certainty">
                                <p className="poetic-text">
                                    I don&apos;t believe in coincidences<br /> that feel this deliberate.
                                </p>
                                <p className="body-text" style={{ marginTop: "12px" }}>
                                    The universe isn&apos;t that random. Not when every &quot;accident&quot; keeps leading
                                    back to the same person. Not when every road I wasn&apos;t supposed to take
                                    led me closer to <span className="serendipity__amber">you.</span>
                                </p>
                            </TimelineNode>

                            <TimelineNode label="The Truth">
                                <p className="poetic-text" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                                    This wasn&apos;t planned.<br />
                                    <span className="serendipity__amber">But it was right.</span>
                                </p>
                            </TimelineNode>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT IV: RADIANCE
                    ═══════════════════════════════════════ */}
                <section className="act act--radiance" id="act-radiance">
                    <div className="radiance__warm-glow" />
                    <div className="act__inner">
                        <Reveal>
                            <p className="chapter-label">Act IV</p>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <h2 className="display-text display-text--section" style={{ marginBottom: "16px" }}>
                                <span className="radiance__gold-text">Radiance</span>
                            </h2>
                            <p className="body-text" style={{ marginBottom: "60px" }}>
                                <em>/ˈreɪ.di.əns/</em>. Light or heat as emitted or reflected; warm joy.
                            </p>
                        </Reveal>

                        <div className="radiance__layers">
                            <Reveal delay={0.1}>
                                <div className="ethereal__moment">
                                    <p className="poetic-text">
                                        Before you,<br />
                                        I didn&apos;t know light could be <span className="radiance__gold-text">warm.</span>
                                    </p>
                                    <div className="ethereal__divider" style={{ background: "linear-gradient(to right, transparent, var(--radiance-gold), transparent)" }} />
                                    <p className="body-text">
                                        I saw the world in clear, cold detail. Everything was visible but
                                        nothing glowed. Nothing pulsed. Nothing made the ordinary feel like
                                        it belonged in a memory worth keeping.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.1} direction="right">
                                <div className="ethereal__moment ethereal__moment--right">
                                    <p className="poetic-text">
                                        You changed the temperature<br />
                                        of <span className="radiance__warm-text">everything.</span>
                                    </p>
                                    <div className="ethereal__divider" style={{ background: "linear-gradient(to right, transparent, var(--radiance-warm), transparent)", marginLeft: "auto" }} />
                                    <p className="body-text" style={{ marginLeft: "auto" }}>
                                        Mornings feel different. Sounds land softer. Even the air tastes
                                        different when I know I&apos;m going to hear your voice. You didn&apos;t just
                                        brighten my world. You <em>warmed</em> it.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.1}>
                                <div className="ethereal__moment ethereal__moment--center">
                                    <p className="poetic-text" style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}>
                                        You don&apos;t shine<br />
                                        <span className="radiance__gold-text">to be seen.</span>
                                    </p>
                                    <p className="body-text" style={{ textAlign: "center", margin: "20px auto 0" }}>
                                        You shine because you can&apos;t help it. It comes from somewhere deep.
                                        A steadiness, a kindness, a radiance that isn&apos;t performed but
                                        <em> lived</em>. And I watch it light up every room, every conversation,
                                        every silence we share.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.15}>
                                <div className="ethereal__moment">
                                    <p className="poetic-text">
                                        I want to spend my life<br />
                                        in that glow.
                                    </p>
                                    <p className="body-text">
                                        Not standing in the spotlight. Standing beside you. In the quiet warmth.
                                        In the golden edge of your <span className="radiance__gold-text">radiance.</span>
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT V: ONE-WORD EMOTIONAL ARTIFACT
                    ═══════════════════════════════════════ */}
                <section className="act act--artifact" id="act-artifact">
                    <div className="act__inner">
                        <Reveal>
                            <p className="chapter-label">Act V</p>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <h2
                                className="display-text display-text--sub"
                                style={{ textAlign: "center", marginBottom: "20px", color: "var(--light)" }}
                            >
                                A Devotion Without Spaces
                            </h2>
                            <p className="body-text" style={{ textAlign: "center", marginBottom: "40px", opacity: 0.6 }}>
                                This is the final made up word that I would describe you with.
                            </p>
                        </Reveal>

                        <Reveal delay={0.3}>
                            <div className="artifact__container" style={{ paddingTop: "0" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
                                    <p className="artifact__button-hint">
                                        If it gets too much, press this to help out.
                                    </p>
                                    <button
                                        className="artifact__toggle-btn"
                                        onClick={() => setExpandedArtifact(!expandedArtifact)}
                                    >
                                        {expandedArtifact ? "hide spaces" : "add spaces"}
                                    </button>
                                </div>

                                <motion.p
                                    className="artifact__word"
                                    animate={{ letterSpacing: expandedArtifact ? "0.05em" : "0em" }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {expandedArtifact
                                        ? "she is just like a time machine to me everytime i am with her i travel back to my childhood her arms are so comfortable it feels like sleeping is much harder her smile is brighter than the sun that illuminates my dark life with her everything is ease without her even breathing is harder she is more precious to me than any other valuables her laugh holds a smooth soothing sense which calms my mind and makes me glance at her because how cute and pretty she look while laughing her eyes are like a black dark night that sucks up all my pain and suffering and give a look that is so soft that is so hypnotising her sense of humour is unmatchable she knows when and where to speak and about how to make up someone sad she lends ear to me she is my audience she is my biggest supporter she is my judge she is my autocorrect or who corrects me everytime she might be my all time bestfriend she is my one and only one who understands me the most the one who know how to turn that pain into laughter her beauty is not an earthly thing but she herself is a heavenly being with her heavenly beauty she is so captivating none can take eyes off her she is my comfort she is love"
                                        : "sheisjustlikeatimemachinetomeeverytimeiamwithheritravelbacktomychildhoodherarmsaresocomfortableitfeelslikesleepingismuchharderhersmileisbrighterthanthesunthatilluminatesmydarklifewithherverythingiseasewithoutherevenbreathingishardersheismoreprecioustomethananyothervaluablesherlaughholdsasmoothsoothingsensewhichcalmsmymindandmakesmeglanceatherbecausehowcuteandprettyshelookwhilelaughinghereyesarelikeablackdarknightthatsucksupallmypainandsufferingandgivealookthatissosoftthatissohypnotisinghersenseofhumourisunmatchablesheknowswhenandwheretospeakandabouthowtomakeupsomeonesadshelendseartomesheismyaudiencesheismybiggestsupportersheismyjudgesheismyautocorrectorwhocorrectsmeeverytimshemightbemyalltimebestfriendsheismyoneandonleonewhounderstandsmethemosttheonewhoknowhowtoturnthatpainintolaughterherbeautyisnotanearthlythingbutsheherselfisaheavenlybeingwithherheavenlybeautysheissocaptivatingnonecantakeeyesoffhersheismycomfortsheislove"
                                    }
                                </motion.p>

                                <p className="artifact__instruction">
                                    read slowly, this is not a paragraph, it&apos;s a promise
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT VII: STILLNESS BEFORE THE QUESTION
                    ═══════════════════════════════════════ */}
                <section className="act act--stillness" id="act-stillness">
                    <div className="act__inner">
                        <div className="stillness__center">
                            <Reveal>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <div className="stillness__dot" />
                                </div>
                            </Reveal>
                            <Reveal delay={0.5}>
                                <p className="stillness__text">
                                    Take a breath.
                                </p>
                            </Reveal>
                            <Reveal delay={1.5}>
                                <p className="stillness__text" style={{ opacity: 0.5 }}>
                                    What comes next is everything.
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    ACT VI: THE QUESTION
                    ═══════════════════════════════════════ */}
                <section className="act act--question" id="act-question">
                    <div className="act__inner">
                        <div className="question__container">
                            <Reveal>
                                <p className="chapter-label" style={{ textAlign: "center" }}>ACT VI — LOVE</p>
                            </Reveal>

                            <div className="question__letter" style={{ textAlign: "center", marginBottom: "80px" }}>
                                <Reveal delay={0.2}>
                                    <p className="body-text" style={{ margin: "0 auto 32px", maxWidth: "520px" }}>
                                        I don&apos;t believe much in labels. Not because they don&apos;t matter, but because they&apos;re too small for what I feel.
                                    </p>
                                </Reveal>

                                <Reveal delay={0.4}>
                                    <p className="body-text" style={{ margin: "0 auto 32px", maxWidth: "520px" }}>
                                        Words like boyfriend and girlfriend try to simplify something that, to me, is anything but simple.
                                    </p>
                                </Reveal>

                                <Reveal delay={0.6}>
                                    <p className="body-text" style={{ margin: "0 auto 20px", maxWidth: "520px" }}>
                                        What I believe in is choosing someone.
                                    </p>
                                    <p className="body-text" style={{ margin: "0 auto 20px", maxWidth: "520px" }}>
                                        Showing up.
                                    </p>
                                    <p className="body-text" style={{ margin: "0 auto 20px", maxWidth: "520px" }}>
                                        Listening.
                                    </p>
                                    <p className="body-text" style={{ margin: "0 auto 20px", maxWidth: "520px" }}>
                                        Caring, even when it&apos;s inconvenient.
                                    </p>
                                    <p className="body-text" style={{ margin: "0 auto 32px", maxWidth: "520px" }}>
                                        Staying, even when it&apos;s hard.
                                    </p>
                                </Reveal>

                                <Reveal delay={0.8}>
                                    <p className="body-text" style={{ margin: "0 auto 32px", maxWidth: "520px" }}>
                                        I believe in love that feels safe. Love that feels honest. Love that doesn&apos;t need a name to be real, but chooses one anyway, because it wants to mean something.
                                    </p>
                                </Reveal>

                                <Reveal delay={1.0}>
                                    <p className="body-text" style={{ margin: "0 auto 32px", maxWidth: "520px" }}>
                                        I&apos;ve poured everything I feel into this. Every word, every breath, every quiet thought I never knew how to say out loud.
                                    </p>
                                </Reveal>

                                <Reveal delay={1.2}>
                                    <p className="body-text" style={{ margin: "0 auto", maxWidth: "520px" }}>
                                        And after all of it, there&apos;s one thing I know with certainty.
                                    </p>
                                </Reveal>
                            </div>

                            <Reveal delay={0.5}>
                                <h2 className="question__main" style={{ marginTop: "40px" }}>
                                    Will you be my{" "}
                                    <span className="question__highlight">love</span>?
                                </h2>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="question__response">
                                    <button
                                        className="question__btn question__btn--yes"
                                        onClick={handleYes}
                                    >
                                        Yes ♡
                                    </button>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>
            </div>

            {/* ═══════════════════════════════════════
              CELEBRATION OVERLAY
              ═══════════════════════════════════════ */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        className="celebration"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CelebrationParticles />
                        <motion.div
                            className="celebration__content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            <h2 className="display-text" style={{ color: "#fff", fontSize: "clamp(40px, 8vw, 80px)" }}>
                                I love you.
                            </h2>
                            <p className="body-text" style={{ color: "rgba(255,255,255,0.7)", marginTop: "20px" }}>
                                Always.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
