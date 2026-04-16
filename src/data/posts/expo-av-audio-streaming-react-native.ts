import type { BlogPost } from '@/types/blog';

export const expoAvAudioStreamingReactNative: BlogPost = {
  slug: 'expo-av-audio-streaming-react-native',
  title: 'Streaming Audio in React Native: expo-av with Public Domain Sources',
  date: '2026-04-05',
  excerpt: 'A practical guide to building a streaming audio player in React Native with expo-av — background playback, progress tracking, and global player state with zero backend cost.',
  readingTime: '7 min read',
  keywords: ['expo-av audio streaming', 'react native audio player', 'expo audio background playback', 'react native music player', 'expo-av tutorial'],
  relatedProject: 'sanatanapp',
  sections: [
    {
      heading: 'Why expo-av Over react-native-track-player',
      content: `To stream audio in React Native with Expo, use expo-av with a global AudioContext provider, enable background playback via \`staysActiveInBackground: true\`, persist playback progress to SQLite, and source audio from public domain URLs like Archive.org for zero hosting costs. This approach keeps you in the Expo managed workflow without ejecting, while delivering a Spotify-like persistent MiniPlayer experience across all screens.

When I needed audio streaming for SanatanApp, the two main options were:

1. **react-native-track-player** — Feature-rich, supports notification controls, queue management. But it's a native module — requires custom dev client, adds build complexity, and is overkill for streaming from static URLs.

2. **expo-av** — Built into Expo managed workflow. Simpler API, supports background playback, works with \`expo prebuild\`. Less features, but fewer headaches.

I chose expo-av because SanatanApp uses Expo managed workflow. Adding a native module would have meant ejecting or setting up a custom dev client — complexity I didn't need for what is essentially "play audio from URL."

The trade-off: no lock-screen controls or notification media controls in v1. For a devotional app where most users play audio while on the app, this was acceptable.

**When to choose react-native-track-player instead:** If your app is primarily a music player or podcast client where lock-screen controls, notification media widgets, and queue management are core features, react-native-track-player is worth the added complexity. It provides native notification controls on both iOS and Android, supports gapless playback, and handles audio focus management automatically. The cost is requiring a custom dev client or ejecting from Expo managed workflow, plus significantly more native build configuration. For apps where audio is a secondary feature — like SanatanApp where users primarily read text and occasionally listen — expo-av is the pragmatic choice.`
    },
    {
      heading: 'How Do You Manage Global Audio State Across Screens?',
      content: `Audio state needs to be global — the user might start playing Ramayan on the Home screen, then navigate to Library, then to Settings. The player must persist across all screens.

I use a React Context that wraps the entire app:

\`\`\`typescript
interface AudioState {
sound: Audio.Sound | null;
currentTrack: Track | null;
isPlaying: boolean;
position: number;
duration: number;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
const [state, setState] = useState<AudioState>(initialState);

const play = async (track: Track) => {
  // Unload previous sound
  if (state.sound) await state.sound.unloadAsync();

  // Configure audio mode for background playback
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
  });

  const { sound } = await Audio.Sound.createAsync(
    { uri: track.sourceUrl },
    { shouldPlay: true },
    onPlaybackStatusUpdate
  );

  setState(prev => ({ ...prev, sound, currentTrack: track, isPlaying: true }));
};

const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  if (!status.isLoaded) return;
  setState(prev => ({
    ...prev,
    position: status.positionMillis,
    duration: status.durationMillis ?? 0,
    isPlaying: status.isPlaying,
  }));
};

// ... pause, seek, cleanup methods
}
\`\`\`

The key line is \`staysActiveInBackground: true\`. Without this, audio stops when the app goes to background — which is the default behavior on both iOS and Android.`
    },
    {
      heading: 'The MiniPlayer Pattern',
      content: `Every screen in SanatanApp has a persistent MiniPlayer bar at the bottom — showing the current track, a progress bar, and play/pause controls. This is rendered outside the navigation stack, above the bottom tab bar.

\`\`\`typescript
function MiniPlayer() {
const { currentTrack, isPlaying, position, duration, togglePlay } = useAudio();

if (!currentTrack) return null;

const progress = duration > 0 ? position / duration : 0;

return (
  <View style={styles.miniPlayer}>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: progress * 100 + '%' }]} />
    </View>
    <View style={styles.controls}>
      <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
      <TouchableOpacity onPress={togglePlay}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </TouchableOpacity>
    </View>
  </View>
);
}
\`\`\`

This pattern is identical to how Spotify, Apple Music, and YouTube Music handle persistent playback — and users already understand it instinctively.

**Implementation details worth noting:** The MiniPlayer should be rendered at the root layout level, outside the React Navigation stack but inside the AudioProvider context. This ensures it persists across tab switches and stack navigations without unmounting. I use \`position: absolute\` with a fixed height (60px) and position it above the bottom tab bar. The progress bar updates via the \`onPlaybackStatusUpdate\` callback, which fires roughly every 500ms — frequent enough for smooth visual progress without excessive re-renders. For the play/pause toggle, I debounce the press handler by 300ms to prevent double-tap issues on slower Android devices.`
    },
    {
      heading: 'How Do You Persist Audio Progress Across App Restarts?',
      content: `When a user is 45 minutes into a 2-hour Ramayan katha and closes the app, they expect to resume from that point tomorrow. I save playback position to SQLite on every status update (throttled to once per 5 seconds):

\`\`\`typescript
const saveProgress = throttle(async (contentId: string, position: number, duration: number) => {
await db.runAsync(
  'INSERT OR REPLACE INTO progress (content_id, position, total, updated_at) VALUES (?, ?, ?, ?)',
  [contentId, Math.floor(position / 1000), Math.floor(duration / 1000), Date.now()]
);
}, 5000);
\`\`\`

When loading a track, I check for saved progress and seek to it:

\`\`\`typescript
const saved = await db.getFirstAsync('SELECT position FROM progress WHERE content_id = ?', [track.id]);
if (saved) await sound.setPositionAsync(saved.position * 1000);
\`\`\`

This is a much better UX than most competing apps, which restart audio from the beginning every time.`
    },
    {
      heading: 'Public Domain Audio: Zero Cost CDN',
      content: `SanatanApp streams all audio from **Archive.org** and other public domain sources. This means:

- **$0/month hosting cost** — no S3 buckets, no CDN bills, no bandwidth charges
- **Legal clarity** — public domain recordings have no licensing restrictions
- **Reliable infrastructure** — Archive.org has been serving files since 1996

The audio source mapping is a simple JSON file:

\`\`\`json
[
{
  "id": "ramayan-bal-kand",
  "title": "Bal Kand — Ramcharitmanas",
  "sourceUrl": "https://archive.org/download/...",
  "duration": 3600,
  "category": "ramayan",
  "kand": "bal"
}
]
\`\`\`

Adding new audio content is a one-line JSON addition — no code changes, no redeployment needed. The app reads this file at startup and builds the Library screen from it.

The total infrastructure cost for SanatanApp is **$0/month**. No servers. No databases. No CDN. The only cost is the $25 one-time Google Play developer fee.

**A note on reliability:** Archive.org has occasional downtime and slower response times compared to commercial CDNs like CloudFront or Cloudflare R2. For a devotional app with patient users, this is acceptable. For a commercial music streaming app, you would want to host audio on a proper CDN with edge caching. The trade-off is cost: even a modest S3 + CloudFront setup for audio streaming would add $20-$100/month depending on volume, which eliminates the zero-cost advantage of this architecture.`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: Does expo-av support background audio playback on both iOS and Android?**

Yes, expo-av supports background audio on both platforms when you set \`staysActiveInBackground: true\` in the \`Audio.setAudioModeAsync\` configuration. On iOS, you also need to enable the "Audio, AirPlay, and Picture in Picture" background mode in your app capabilities, which Expo handles automatically in managed workflow. On Android, background audio works out of the box. The audio continues playing when the user switches to another app or locks the screen, though you will not get notification media controls without react-native-track-player.

**Q: How do you handle audio focus when other apps play sound?**

expo-av respects the system audio focus by default. When another app starts playing audio (like a phone call or music app), your audio will duck or pause depending on the platform. You can configure this behavior through \`Audio.setAudioModeAsync\` with options like \`shouldDuckAndroid\` and \`interruptionModeAndroid\`. For SanatanApp, I use the default behavior which pauses playback during phone calls and ducks volume when notification sounds play. This is the expected behavior users are accustomed to.

**Q: What is the maximum audio file size expo-av can stream reliably?**

expo-av can stream audio files of any size since it uses progressive streaming rather than loading the entire file into memory. I have successfully streamed 2-hour Ramayan katha recordings (approximately 120MB MP3 files) without issues. The key factor is not file size but network conditions — on slow 3G connections, longer audio files may experience more buffering interruptions. To improve the experience, ensure your source files are encoded at reasonable bitrates (128kbps is sufficient for spoken word content) and consider providing multiple quality options if your audience has varying connectivity.

**Q: Can you download audio for offline playback with expo-av?**

expo-av itself does not provide a download manager, but you can combine it with expo-file-system to download audio files to the device's local storage and then play them locally using a file URI instead of a remote URL. This adds complexity around storage management (users need to know how much space audio takes), download progress UI, and cleanup of old downloads. I chose not to implement offline audio in SanatanApp v1 to keep the APK small and avoid storage management complexity, but it is a planned feature for v2.

**Q: How does expo-av compare to expo-audio (the newer Expo audio API)?**

Expo introduced expo-audio as a more modern alternative to expo-av starting around SDK 51. expo-audio has a simpler API surface, better TypeScript types, and is designed specifically for audio playback (expo-av also handles video). However, as of Expo SDK 52, expo-audio is still evolving and has fewer community examples. I chose expo-av because it is battle-tested, has extensive documentation, and handles all the audio features SanatanApp needs. If you are starting a new project today, evaluate both options — expo-audio may be the better long-term choice.`
    }
  ],
  cta: {
    text: 'Building a mobile app with audio or media features? I can help.',
    href: '/contact'
  }
};
