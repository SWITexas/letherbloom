// "use client";

// import { useEffect, useState, useRef } from "react";

// interface ZoomSessionProps {
//     meetingNumber: string;
//     userName: string;
//     onLeave: () => void;
//     userEmail?: string;
//     passWord?: string;
// }

// export default function ZoomSession({
//     meetingNumber,
//     userName,
//     onLeave,
//     userEmail = "",
//     passWord = "",
// }: ZoomSessionProps) {
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [containerSize, setContainerSize] = useState({ width: 1200, height: 750 });
//     const [isPortrait, setIsPortrait] = useState(false);
//     const [showAudioTip, setShowAudioTip] = useState(false);

//     const isInitializing = useRef(false);

//     useEffect(() => {
//         const updateSize = () => {
//             if (typeof window === "undefined") return;
//             const isMobile = window.innerWidth <= 768;
//             setContainerSize({
//                 width: isFullScreen ? window.innerWidth : Math.min(window.innerWidth - 40, 1200),
//                 height: isFullScreen ? window.innerHeight : (isMobile ? Math.min(window.innerHeight - 100, 600) : 750)
//             });
//         };

//         updateSize();
//         window.addEventListener('resize', updateSize);
//         return () => window.removeEventListener('resize', updateSize);
//     }, [isFullScreen]);

//     useEffect(() => {
//         const checkOrientation = () => {
//             if (typeof window === "undefined") return;
//             // Only flag portrait on mobile-ish screens
//             setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth <= 768);
//         };
//         checkOrientation();
//         window.addEventListener('resize', checkOrientation);
//         return () => window.removeEventListener('resize', checkOrientation);
//     }, []);

//     useEffect(() => {
//         if (isInitializing.current) {
//             console.log("Zoom already initializing");
//             return;
//         }

//         isInitializing.current = true;

//         let client: any = null;
//         let hasJoined = false;

//         const initZoom = async () => {
//             try {
//                 // Ensure DOM is ready
//                 const root = document.getElementById("meetingSDKElement");
//                 if (!root) {
//                     // Quick retry
//                     await new Promise(r => setTimeout(r, 300));
//                     if (!document.getElementById("meetingSDKElement")) return;
//                 }

//                 setIsLoading(true);
//                 setError(null);

//                 const ZoomMtgModule = await import("@zoom/meetingsdk/embedded");
//                 const ZoomMtgEmbedded = ZoomMtgModule.default || ZoomMtgModule;

//                 client = ZoomMtgEmbedded.createClient();

//                 // 1. Signature
//                 const signatureRes = await fetch("/api/zoom-signature", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ meetingNumber, role: 0 }),
//                 });

//                 const { signature, sdkKey, error: sigError } = await signatureRes.json();

//                 if (sigError || !signature || !sdkKey) {
//                     throw new Error(sigError || "Signature failed");
//                 }

//                 await client.init({
//                     zoomAppRoot: document.getElementById("meetingSDKElement")!,
//                     language: "en-US",
//                     customize: {
//                         video: {
//                             isResizable: true,
//                             viewSizes: {
//                                 default: {
//                                     width: containerSize.width,
//                                     height: containerSize.height
//                                 },
//                                 ribbon: {
//                                     width: containerSize.width,
//                                     height: containerSize.height
//                                 }
//                             },
//                             defaultViewType: "speaker",
//                             popper: {
//                                 disableDraggable: true
//                             }
//                         },

//                         meetingInfo: ['topic', 'host', 'participant', 'mn', 'pwd'],
//                     }
//                 });

//                 await client.join({
//                     sdkKey,
//                     signature,
//                     meetingNumber,
//                     password: passWord,
//                     userName,
//                     userEmail,
//                 });

//                 hasJoined = true;
//                 setIsLoading(false);
//                 // Show audio tip after a short delay
//                 setTimeout(() => setShowAudioTip(true), 2000);
//                 // Hide audio tip after 8 seconds
//                 setTimeout(() => setShowAudioTip(false), 10000);

//             } catch (err: any) {
//                 console.error("Zoom Error:", err);

//                 await cleanupZoom(client);

//                 hasJoined = false;
//                 isInitializing.current = false;

//                 // Force DOM cleanup
//                 const root = document.getElementById("meetingSDKElement");
//                 if (root) {
//                     root.innerHTML = "";
//                 }

//                 // Mobile SDK reconnect issue
//                 if (
//                     err.errorCode === 200 ||
//                     err.errorCode === 1 ||
//                     err.errorCode === 4000 ||
//                     err.errorCode === 4001 ||
//                     err.errorCode === 5012
//                 ) {
//                     setError("Connection interrupted. Please rejoin the session.");
//                 } else {
//                     setError(err.message || "Could not join session");
//                 }

//                 setIsLoading(false);
//             }
//         };

//         isInitializing.current = true;
//         initZoom();

//         return () => {
//             isInitializing.current = false;
//             if (client && hasJoined) {
//                 cleanupZoom(client);
//             }
//         };
//     }, [meetingNumber, userName, userEmail, passWord]);

//     const toggleFullScreen = () => {
//         setIsFullScreen(!isFullScreen);
//     };

//     if (error) {
//         return (
//             <div className="flex bg-black text-white p-8 rounded-2xl items-center justify-center min-h-[500px]">
//                 <div className="text-center">
//                     <p className="text-rose-500 text-xl font-bold mb-2">Notice</p>
//                     <p className="text-zinc-400 mb-6">{error}</p>
//                     <button onClick={onLeave} className="bg-white text-black px-8 py-2 rounded-full font-bold">
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const cleanupZoom = async (client: any) => {
//         try {
//             if (client) {
//                 try {
//                     await client.leaveMeeting();
//                 } catch { }

//                 try {
//                     await client.destroyClient();
//                 } catch { }
//             }
//         } catch { }
//     };

//     return (
//         <div className={`${isFullScreen ? 'fixed inset-0 z-[9999]' : 'relative w-full h-[500px] sm:h-[750px] rounded-2xl border border-zinc-800'} bg-zinc-950 overflow-hidden shadow-2xl`}>
//             <style dangerouslySetInnerHTML={{
//                 __html: `
//                 #meetingSDKElement {
//                     width: 100% !important;
//                     height: 100% !important;
//                     background: #09090b !important;
//                 }
//                 #meetingSDKElement iframe {
//                     width: 100% !important;
//                     height: 100% !important;
//                     border: none !important;
//                 }
//                 .zm-meeting-load-screen {
//                     background-color: #09090b !important;
//                 }
//                 @keyframes rotate-device {
//                     0% { transform: rotate(0deg); }
//                     25% { transform: rotate(90deg); }
//                     75% { transform: rotate(90deg); }
//                     100% { transform: rotate(0deg); }
//                 }
//                 .animate-rotate-device {
//                     animation: rotate-device 2s infinite ease-in-out;
//                 }
//                 /* Ensure Zoom toolbar is visible */
//                 .meeting-app {
//                     width: 100% !important;
//                     height: 100% !important;
//                     position: relative !important;
//                 }
//             `}} />

//             {isPortrait && (
//                 <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-zinc-950/95 text-white p-6 text-center backdrop-blur-xl">
//                     <div className="mb-6 text-rose-500">
//                         <div className="w-20 h-20 border-2 border-zinc-700 rounded-xl flex items-center justify-center animate-rotate-device">
//                             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                             </svg>
//                         </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
//                         Landscape Mode Required
//                     </h3>
//                     <p className="text-zinc-400 text-sm max-w-[280px] leading-relaxed">
//                         Please rotate your device to landscape for the best training experience and full feature access.
//                     </p>
//                 </div>
//             )}

//             {isLoading && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-950 z-[100] gap-4">
//                     <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
//                     <p className="text-zinc-400 animate-pulse">Entering Secure Session...</p>
//                 </div>
//             )}

//             {showAudioTip && !isPortrait && !isLoading && (
//                 <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-500">
//                     <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-500/50 backdrop-blur-sm">
//                         <div className="bg-white/20 p-2 rounded-full">
//                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m8 0h-3m4-8a3 3 0 01-3 3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                             </svg>
//                         </div>
//                         <div className="flex flex-col">
//                             <p className="text-sm font-bold">Join Audio to Talk</p>
//                             <p className="text-[10px] opacity-90">Tap the 'Join Audio' icon in the bottom toolbar</p>
//                         </div>
//                         <button onClick={() => setShowAudioTip(false)} className="ml-2 hover:opacity-70">
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     {/* Little arrow */}
//                     <div className="w-3 h-3 bg-rose-600 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
//                 </div>
//             )}

//             <div id="meetingSDKElement" className="w-full h-full"></div>

//             <div className="absolute top-4 right-4 z-[100] flex gap-2">
//                 <button onClick={toggleFullScreen} className="bg-zinc-900/90 px-4 py-2 rounded-lg text-white text-sm border border-zinc-700 hover:bg-zinc-800">
//                     {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
//                 </button>
//                 <button onClick={onLeave} className="bg-rose-600 px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-rose-700">
//                     Leave
//                 </button>
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useRef, useState } from "react";

interface ZoomSessionProps {
    meetingNumber: string;
    userName: string;
    onLeave: () => void;
    userEmail?: string;
    passWord?: string;
}

export default function ZoomSession({
    meetingNumber,
    userName,
    onLeave,
    userEmail = "",
    passWord = "",
}: ZoomSessionProps) {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showAudioTip, setShowAudioTip] = useState(false);

    const clientRef = useRef<any>(null);
    const isInitializing = useRef(false);

    const cleanupZoom = async () => {
        try {
            if (clientRef.current) {
                try {
                    await clientRef.current.leaveMeeting();
                } catch { }

                try {
                    await clientRef.current.destroyClient();
                } catch { }
            }
        } catch { }

        const root = document.getElementById("meetingSDKElement");

        if (root) {
            root.innerHTML = "";
        }

        clientRef.current = null;
        isInitializing.current = false;
    };

    useEffect(() => {

        if (isInitializing.current) {
            return;
        }

        isInitializing.current = true;

        let mounted = true;

        const initZoom = async () => {

            try {

                setIsLoading(true);
                setError(null);

                await cleanupZoom();

                const root = document.getElementById("meetingSDKElement");

                if (!root) {
                    throw new Error("Zoom container not found");
                }

                // Allow mobile browsers release previous session
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const ZoomMtgModule = await import("@zoom/meetingsdk/embedded");

                const ZoomMtgEmbedded =
                    ZoomMtgModule.default || ZoomMtgModule;

                const client = ZoomMtgEmbedded.createClient();

                clientRef.current = client;

                // Get signature
                const signatureRes = await fetch("/api/zoom-signature", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        meetingNumber,
                        role: 0,
                    }),
                });

                const {
                    signature,
                    sdkKey,
                    error: sigError,
                } = await signatureRes.json();

                if (sigError || !signature || !sdkKey) {
                    throw new Error(sigError || "Failed to generate signature");
                }

                await client.init({
                    zoomAppRoot: root,
                    language: "en-US",

                    customize: {
                        video: {
                            isResizable: true,

                            defaultViewType: "speaker",

                            viewSizes: {
                                default: {
                                    width: window.innerWidth <= 768
                                        ? window.innerWidth
                                        : 1200,

                                    height: window.innerWidth <= 768
                                        ? window.innerHeight - 100
                                        : 750,
                                },

                                ribbon: {
                                    width: window.innerWidth <= 768
                                        ? window.innerWidth
                                        : 1200,

                                    height: window.innerWidth <= 768
                                        ? window.innerHeight - 100
                                        : 750,
                                },
                            },
                        },

                        meetingInfo: [
                            "topic",
                            "host",
                            "participant",
                        ],
                    },
                });

                await client.join({
                    sdkKey,
                    signature,
                    meetingNumber,
                    password: passWord,
                    userName,
                    userEmail,
                });

                // Auto pin host
                try {

                    const participants = client.getAllUser();

                    const host = participants.find(
                        (p: any) => p.isHost
                    );

                    if (host) {
                        client.pinVideo(host.userId);
                    }

                } catch { }

                if (!mounted) return;

                isInitializing.current = false;

                setIsLoading(false);

                setTimeout(() => {
                    setShowAudioTip(true);
                }, 2000);

                setTimeout(() => {
                    setShowAudioTip(false);
                }, 10000);

            } catch (err: any) {

                console.error("Zoom Error:", err);

                await cleanupZoom();

                if (!mounted) return;

                let message = "Could not join session";

                if (
                    err?.errorCode === 200 ||
                    err?.errorCode === 1 ||
                    err?.errorCode === 4000 ||
                    err?.errorCode === 4001 ||
                    err?.errorCode === 5012
                ) {
                    message =
                        "Connection interrupted. Please refresh and rejoin.";
                } else if (err?.message) {
                    message = err.message;
                }

                setError(message);

                setIsLoading(false);
            }
        };

        initZoom();

        // Handle app backgrounding on mobile
        const handleVisibility = async () => {

            if (
                document.visibilityState === "hidden"
            ) {
                await cleanupZoom();
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );

        return () => {

            mounted = false;

            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );

            cleanupZoom();
        };

    }, []);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    if (error) {

        return (
            <div className="flex bg-black text-white p-8 rounded-2xl items-center justify-center min-h-[500px]">
                <div className="text-center">

                    <p className="text-rose-500 text-xl font-bold mb-2">
                        Notice
                    </p>

                    <p className="text-zinc-400 mb-6">
                        {error}
                    </p>

                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="bg-white text-black px-8 py-2 rounded-full font-bold"
                    >
                        Rejoin Session
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div
            className={`${isFullScreen
                    ? "fixed inset-0 z-[9999]"
                    : "relative w-full h-[500px] sm:h-[750px] rounded-2xl border border-zinc-800"
                } bg-zinc-950 shadow-2xl`}
        >

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    
                    #meetingSDKElement {
                        width: 100% !important;
                        height: 100% !important;
                        background: #09090b !important;
                    }

                    #meetingSDKElement iframe {
                        width: 100% !important;
                        height: 100% !important;
                        border: none !important;
                    }

                    .zm-meeting-load-screen {
                        background-color: #09090b !important;
                    }

                    .meeting-app {
                        width: 100% !important;
                        height: 100% !important;
                    }

                    `,
                }}
            />

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-950 z-[100] gap-4">

                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-zinc-400 animate-pulse">
                        Entering Secure Session...
                    </p>

                </div>
            )}

            {showAudioTip && !isLoading && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000]">

                    <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">

                        <div>
                            🎤
                        </div>

                        <div className="flex flex-col">

                            <p className="text-sm font-bold">
                                Join Audio to Talk
                            </p>

                            <p className="text-[10px] opacity-90">
                                Tap the microphone button below
                            </p>

                        </div>

                    </div>

                </div>
            )}

            <div
                id="meetingSDKElement"
                className="w-full h-full"
            />

            <div className="absolute top-4 right-4 z-[100] flex gap-2">

                <button
                    onClick={toggleFullScreen}
                    className="bg-zinc-900/90 px-4 py-2 rounded-lg text-white text-sm border border-zinc-700 hover:bg-zinc-800"
                >
                    {isFullScreen
                        ? "Exit Full Screen"
                        : "Full Screen"}
                </button>

                <button
                    onClick={onLeave}
                    className="bg-rose-600 px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-rose-700"
                >
                    Leave
                </button>

            </div>

        </div>
    );
}