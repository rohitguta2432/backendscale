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
      content: `When I needed audio streaming for SanatanApp, the two main options were:

1. **react-native-track-player** — Feature-rich, supports notification controls, queue management. But it's a native module — requires custom dev client, adds build complexity, and is overkill for streaming from static URLs.

2. **expo-av** — Built into Expo managed workflow. Simpler API, supports background playback, works with \`expo prebuild\`. Less features, but fewer headaches.

I chose expo-av because SanatanApp uses Expo managed workflow. Adding a native module would have meant ejecting or setting up a custom dev client — complexity I didn't need for what is essentially "play audio from URL."

The trade-off: no lock-screen controls or notification media controls in v1. For a devotional app where most users play audio while on the app, this was acceptable.`
    },
    {
      heading: 'Global Audio Context',
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

This pattern is identical to how Spotify, Apple Music, and YouTube Music handle persistent playback — and users already understand it instinctively.`
    },
    {
      heading: 'Progress Persistence with expo-sqlite',
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

The total infrastructure cost for SanatanApp is **$0/month**. No servers. No databases. No CDN. The only cost is the $25 one-time Google Play developer fee.`
    }
  ],
  cta: {
    text: 'Building a mobile app with audio or media features? I can help.',
    href: '/contact'
  }
};
