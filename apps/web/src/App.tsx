import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BellRing,
  Bike,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Flag,
  Gauge,
  HeartPulse,
  Home,
  Link2,
  Lock,
  Map,
  MessageCircle,
  Play,
  Plus,
  Radio,
  Route,
  Satellite,
  Send,
  Shield,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  Watch
} from "lucide-react";
import {
  connectIntegration,
  createActivity,
  createCheckout,
  joinChallenge,
  login,
  pushLivePosition,
  sendCheer,
  sendOtp,
  signup,
  startRace,
  verifyOtp
} from "./api";
import {
  challengesSeed,
  clubsSeed,
  demoStats,
  feedSeed,
  integrationProviders,
  plansSeed,
  racePositionsSeed,
  routesSeed,
  workoutsSeed
} from "./data";
import type { ActivityType, Challenge, FeedPost, RacePosition, RoutePlan, TrainingWorkout } from "./types";

type Screen = "home" | "record" | "feed" | "explore" | "races" | "training" | "pro" | "settings";
type AuthMode = "login" | "signup";
type TrackerStatus = "idle" | "recording" | "paused";

function initialScreen(): Screen {
  const hash = window.location.hash.replace("#", "");
  return navItems.some((item) => item.id === hash) ? (hash as Screen) : "home";
}

const navItems: Array<{ id: Screen; label: string; icon: typeof Home }> = [
  { id: "home", label: "Today", icon: Home },
  { id: "record", label: "Record", icon: Satellite },
  { id: "feed", label: "Feed", icon: MessageCircle },
  { id: "explore", label: "Explore", icon: Route },
  { id: "races", label: "Races", icon: Flag },
  { id: "training", label: "Coach", icon: Gauge },
  { id: "pro", label: "Pro", icon: CircleDollarSign },
  { id: "settings", label: "Settings", icon: UserRound }
];

const countries = [
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "AE", label: "UAE" },
  { code: "SG", label: "Singapore" },
  { code: "BR", label: "Brazil" }
];

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatDistance(meters: number) {
  return `${(meters / 1000).toFixed(2)} km`;
}

function pace(seconds: number, meters: number) {
  if (!meters) return "--";
  const secondsPerKm = seconds / (meters / 1000);
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  return `${mins}:${String(secs).padStart(2, "0")}/km`;
}

export function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>(initialScreen);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [authed, setAuthed] = useState(() => new URLSearchParams(window.location.search).get("demo") === "1");
  const [authStep, setAuthStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("runner@aevra.app");
  const [displayName, setDisplayName] = useState("Demo Runner");
  const [password, setPassword] = useState("runner-demo");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [toast, setToast] = useState("");
  const [feed, setFeed] = useState(feedSeed);
  const [challenges, setChallenges] = useState(challengesSeed);
  const [joinedChallenges, setJoinedChallenges] = useState(new Set(["challenge_april_100k"]));
  const [joinedClubs, setJoinedClubs] = useState(new Set(["club_mumbai_runners"]));
  const [routes, setRoutes] = useState(routesSeed);
  const [routeName, setRouteName] = useState("Evening progression loop");
  const [raceLive, setRaceLive] = useState(false);
  const [racePositions, setRacePositions] = useState(racePositionsSeed);
  const [cheerMessage, setCheerMessage] = useState("Hold pace. You are moving well.");
  const [selectedWorkout, setSelectedWorkout] = useState<TrainingWorkout>(workoutsSeed[1]);
  const [subscription, setSubscription] = useState("free");
  const [connectedProviders, setConnectedProviders] = useState(new Set(["health_connect"]));
  const [shareOpenFor, setShareOpenFor] = useState<string | null>(null);
  const [tracker, setTracker] = useState({
    status: "idle" as TrackerStatus,
    seconds: 0,
    distanceMeters: 0,
    heartRate: 142,
    beacon: true,
    type: "run" as ActivityType,
    laps: [] as string[]
  });

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (tracker.status !== "recording") return;
    const interval = window.setInterval(() => {
      setTracker((current) => ({
        ...current,
        seconds: current.seconds + 1,
        distanceMeters: current.distanceMeters + 3.1 + Math.random() * 1.2,
        heartRate: Math.max(118, Math.min(172, current.heartRate + Math.round(Math.random() * 4 - 1.8)))
      }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [tracker.status]);

  const currentProvider = useMemo(() => {
    if (countryCode === "IN") return "Razorpay";
    if (["US", "GB", "AE", "SG"].includes(countryCode)) return "Stripe";
    return "PayPal";
  }, [countryCode]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (authMode === "login") {
      await login(email, password);
      setAuthed(true);
      setToast("Signed in");
      return;
    }

    await signup(email, displayName, countryCode);
    const otpResult = await sendOtp(email);
    setOtp(otpResult?.demoCode ?? "246810");
    setAuthStep("otp");
    setToast("OTP sent");
  }

  async function handleOtpVerify() {
    const result = await verifyOtp(email, otp);
    if (result?.verified || otp === "246810") {
      setAuthed(true);
      setToast("Account verified");
      return;
    }

    setToast("OTP did not match");
  }

  function addLap() {
    setTracker((current) => ({
      ...current,
      laps: [`${formatTime(current.seconds)} - ${formatDistance(current.distanceMeters)}`, ...current.laps]
    }));
  }

  async function finishActivity() {
    const distanceMeters = Math.max(1200, tracker.distanceMeters);
    const movingTimeSeconds = Math.max(600, tracker.seconds);
    const title = tracker.type === "cycle" ? "Coastal endurance ride" : "Aevra verified run";

    await createActivity({
      title,
      type: tracker.type,
      distanceMeters,
      movingTimeSeconds,
      averageHeartRate: tracker.heartRate,
      visibility: "followers"
    });

    const post: FeedPost = {
      id: `feed-${Date.now()}`,
      athlete: displayName,
      avatar: displayName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
      title,
      type: tracker.type,
      distanceKm: Number((distanceMeters / 1000).toFixed(2)),
      duration: formatTime(movingTimeSeconds),
      pace: pace(movingTimeSeconds, distanceMeters),
      city: countries.find((country) => country.code === countryCode)?.label ?? "Local",
      kudos: 0,
      comments: [],
      photo: "linear-gradient(135deg, #15191c 0%, #3aa6ff 45%, #b9ff53 100%)",
      createdAt: "Now"
    };

    setFeed((current) => [post, ...current]);
    setTracker({
      status: "idle",
      seconds: 0,
      distanceMeters: 0,
      heartRate: 142,
      beacon: true,
      type: "run",
      laps: []
    });
    setActiveScreen("feed");
    setToast("Activity saved and posted");
  }

  function addKudos(postId: string) {
    setFeed((current) => current.map((post) => (post.id === postId ? { ...post, kudos: post.kudos + 1 } : post)));
  }

  function addComment(postId: string) {
    setFeed((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, comments: ["Locked in for the next one", ...post.comments] } : post
      )
    );
  }

  async function sharePost(post: FeedPost, target: "native" | "copy" | "whatsapp" | "x" | "linkedin" | "instagram") {
    const text = `${post.athlete} finished ${post.distanceKm} km on Aevra: ${post.title}`;
    const encoded = encodeURIComponent(text);

    if (target === "native") {
      if (navigator.share) {
        await navigator.share({ title: post.title, text, url: window.location.href });
        setToast("Shared");
        return;
      }

      await navigator.clipboard?.writeText(text);
      setToast("Share text copied");
      return;
    }

    if (target === "copy" || target === "instagram") {
      await navigator.clipboard?.writeText(text);
      if (target === "instagram") window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      setToast(target === "instagram" ? "Caption copied for Instagram" : "Share text copied");
      return;
    }

    const urls = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${encoded}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };
    window.open(urls[target], "_blank", "noopener,noreferrer");
    setToast("Share window opened");
  }

  async function handleJoinChallenge(challenge: Challenge) {
    await joinChallenge(challenge.id);
    setJoinedChallenges((current) => new Set(current).add(challenge.id));
    setToast("Challenge joined");
  }

  function handleJoinClub(clubId: string) {
    setJoinedClubs((current) => new Set(current).add(clubId));
    setToast("Club joined");
  }

  function createRoutePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const route: RoutePlan = {
      id: `route-${Date.now()}`,
      name: routeName,
      distanceKm: 9.6,
      elevationMeters: 92,
      popularity: 0,
      surface: "custom"
    };
    setRoutes((current) => [route, ...current]);
    setRouteName("Morning easy route");
    setToast("Route saved");
  }

  async function handleStartRace() {
    await startRace("event_mumbai_half_2026");
    setRaceLive(true);
    setToast("Race tracking live");
  }

  async function moveRace() {
    await pushLivePosition("event_mumbai_half_2026", "bib-107");
    setRacePositions((current) =>
      current.map((position, index) => ({
        ...position,
        checkpointCount: index === 0 ? Math.min(5, position.checkpointCount + 1) : position.checkpointCount,
        lat: position.lat + Math.random() / 1000,
        lng: position.lng - Math.random() / 1000
      }))
    );
    setToast("Live positions updated");
  }

  async function handleCheer() {
    await sendCheer("event_mumbai_half_2026", cheerMessage);
    setToast("Cheer sent");
  }

  async function handleCheckout(planId: string) {
    const checkout = await createCheckout(planId, countryCode);
    if (checkout && !checkout.demoMode) {
      window.open(checkout.checkoutUrl, "_blank", "noopener,noreferrer");
      setToast(`${checkout.provider} checkout opened`);
      return;
    }

    setSubscription(planId);
    setToast(`${planId} active in demo mode`);
  }

  async function handleConnect(provider: string, scopes: string[]) {
    await connectIntegration(provider, scopes);
    setConnectedProviders((current) => new Set(current).add(provider));
    setToast("Integration connected");
  }

  if (!authed) {
    return (
      <main className="auth-shell">
        <section className="auth-visual">
          <div className="brand-lockup">
            <div className="brand-mark">A</div>
            <span>Aevra</span>
          </div>
          <div className="auth-map" aria-hidden="true">
            <RouteMap />
          </div>
          <div className="auth-proof">
            <span>GPS</span>
            <span>Live races</span>
            <span>Clubs</span>
            <span>Plans</span>
          </div>
        </section>

        <section className="auth-panel">
          <div>
            <h1>Aevra</h1>
            <p>Training, routes, events, clubs, subscriptions, and live safety in one athlete app.</p>
          </div>

          <div className="segmented">
            <button className={authMode === "signup" ? "active" : ""} onClick={() => setAuthMode("signup")}>
              Sign up
            </button>
            <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
              Log in
            </button>
          </div>

          {authStep === "credentials" ? (
            <form className="form-stack" onSubmit={handleAuthSubmit}>
              {authMode === "signup" && (
                <label>
                  Name
                  <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
                </label>
              )}
              <label>
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <label>
                Country
                <select value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary-button" type="submit">
                <Lock size={18} />
                Continue
              </button>
            </form>
          ) : (
            <div className="form-stack">
              <label>
                Email OTP
                <input value={otp} onChange={(event) => setOtp(event.target.value)} />
              </label>
              <button className="primary-button" onClick={handleOtpVerify}>
                <Check size={18} />
                Verify account
              </button>
            </div>
          )}

          <div className="oauth-row">
            <button onClick={() => setAuthed(true)}>Google</button>
            <button onClick={() => setAuthed(true)}>Apple</button>
            <button onClick={() => setAuthed(true)}>Passkey</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">A</div>
          <span>Aevra</span>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={activeScreen === item.id ? "active" : ""} onClick={() => setActiveScreen(item.id)}>
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="workspace">
        <Topbar displayName={displayName} countryCode={countryCode} subscription={subscription} />
        {activeScreen === "home" && <HomeScreen onRecord={() => setActiveScreen("record")} />}
        {activeScreen === "record" && <RecordScreen />}
        {activeScreen === "feed" && <FeedScreen />}
        {activeScreen === "explore" && <ExploreScreen />}
        {activeScreen === "races" && <RaceScreen />}
        {activeScreen === "training" && <TrainingScreen />}
        {activeScreen === "pro" && <ProScreen />}
        {activeScreen === "settings" && <SettingsScreen />}
      </main>

      <nav className="mobile-nav">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={activeScreen === item.id ? "active" : ""} onClick={() => setActiveScreen(item.id)} aria-label={item.label}>
              <Icon size={20} />
            </button>
          );
        })}
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );

  function HomeScreen({ onRecord }: { onRecord: () => void }) {
    return (
      <section className="screen-grid">
        <div className="hero-band">
          <div>
            <h1>Move with the city.</h1>
            <p>Track clean efforts, compare fair leaderboards, follow live races, and share proof without leaving the app.</p>
            <div className="button-row">
              <button className="primary-button" onClick={onRecord}>
                <Play size={18} />
                Start activity
              </button>
              <button className="ghost-button" onClick={() => setActiveScreen("races")}>
                <Radio size={18} />
                Live race
              </button>
            </div>
          </div>
          <div className="phone-preview">
            <RouteMap />
            <div className="phone-metrics">
              <span>{demoStats.weeklyDistanceKm} km</span>
              <span>{demoStats.recovery}% ready</span>
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <MetricCard icon={Activity} label="Weekly distance" value={`${demoStats.weeklyDistanceKm} km`} trend="+12%" />
          <MetricCard icon={HeartPulse} label="Recovery" value={`${demoStats.recovery}%`} trend="green" />
          <MetricCard icon={Gauge} label="Training load" value={`${demoStats.trainingLoad}`} trend="steady" />
          <MetricCard icon={Trophy} label="Streak" value={`${demoStats.streakDays} days`} trend="active" />
        </div>

        <div className="two-column">
          <Panel title="Next workout" icon={Watch}>
            <div className="workout-card">
              <strong>{selectedWorkout.title}</strong>
              <span>{selectedWorkout.focus}</span>
              <div className="progress-track">
                <i style={{ width: "68%" }} />
              </div>
            </div>
          </Panel>
          <Panel title="Challenge pulse" icon={Sparkles}>
            {challenges.slice(0, 2).map((challenge) => (
              <CompactProgress key={challenge.id} label={challenge.title} value={challenge.progressPercent} />
            ))}
          </Panel>
        </div>
      </section>
    );
  }

  function RecordScreen() {
    return (
      <section className="record-layout">
        <div className="record-console">
          <div className="record-mode">
            {(["run", "cycle", "walk", "swim", "gym"] as ActivityType[]).map((type) => (
              <button key={type} className={tracker.type === type ? "active" : ""} onClick={() => setTracker((current) => ({ ...current, type }))}>
                {type === "cycle" ? <Bike size={18} /> : <Activity size={18} />}
                {type}
              </button>
            ))}
          </div>
          <div className="timer">{formatTime(tracker.seconds)}</div>
          <div className="record-stats">
            <strong>{formatDistance(tracker.distanceMeters)}</strong>
            <span>{pace(tracker.seconds, tracker.distanceMeters)}</span>
            <span>{tracker.heartRate} bpm</span>
          </div>
          <div className="button-row center">
            {tracker.status !== "recording" ? (
              <button className="primary-button" onClick={() => setTracker((current) => ({ ...current, status: "recording" }))}>
                <Play size={18} />
                Start
              </button>
            ) : (
              <button className="ghost-button" onClick={() => setTracker((current) => ({ ...current, status: "paused" }))}>
                Pause
              </button>
            )}
            <button className="ghost-button" onClick={addLap}>
              <Flag size={18} />
              Lap
            </button>
            <button className="danger-button" onClick={finishActivity}>
              Finish
            </button>
          </div>
        </div>

        <Panel title="Live route" icon={Map}>
          <RouteMap animated={tracker.status === "recording"} />
        </Panel>

        <Panel title="Safety beacon" icon={Shield}>
          <div className="toggle-row">
            <span>Live location</span>
            <button className={tracker.beacon ? "switch active" : "switch"} onClick={() => setTracker((current) => ({ ...current, beacon: !current.beacon }))}>
              <i />
            </button>
          </div>
          <div className="contact-list">
            <span>Priya</span>
            <span>Coach Arjun</span>
            <span>Race desk</span>
          </div>
        </Panel>

        <Panel title="Splits" icon={BarChart3}>
          {tracker.laps.length ? tracker.laps.map((lap) => <div className="list-row" key={lap}>{lap}</div>) : <div className="empty-state">No laps yet</div>}
        </Panel>
      </section>
    );
  }

  function FeedScreen() {
    return (
      <section className="feed-layout">
        {feed.map((post) => (
          <article className="post-card" key={post.id}>
            <div className="post-header">
              <div className="avatar">{post.avatar}</div>
              <div>
                <strong>{post.athlete}</strong>
                <span>{post.city} - {post.createdAt}</span>
              </div>
            </div>
            <div className="post-photo" style={{ background: post.photo }}>
              <RouteMap light />
            </div>
            <div className="post-body">
              <h2>{post.title}</h2>
              <div className="post-stats">
                <span>{post.distanceKm} km</span>
                <span>{post.duration}</span>
                <span>{post.pace}</span>
              </div>
              <div className="button-row">
                <button onClick={() => addKudos(post.id)}>
                  <HeartPulse size={17} />
                  {post.kudos}
                </button>
                <button onClick={() => addComment(post.id)}>
                  <MessageCircle size={17} />
                  {post.comments.length}
                </button>
                <button onClick={() => setShareOpenFor(shareOpenFor === post.id ? null : post.id)}>
                  <Send size={17} />
                  Share
                </button>
              </div>
              {shareOpenFor === post.id && (
                <div className="share-row">
                  <button onClick={() => sharePost(post, "native")}>Native</button>
                  <button onClick={() => sharePost(post, "whatsapp")}>WhatsApp</button>
                  <button onClick={() => sharePost(post, "x")}>X</button>
                  <button onClick={() => sharePost(post, "linkedin")}>LinkedIn</button>
                  <button onClick={() => sharePost(post, "instagram")}>Instagram</button>
                  <button onClick={() => sharePost(post, "copy")}>Copy</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    );
  }

  function ExploreScreen() {
    return (
      <section className="screen-grid">
        <div className="section-head">
          <div>
            <h1>Explore</h1>
            <p>Routes, clubs, segments, and challenges shaped for local training.</p>
          </div>
        </div>
        <div className="two-column">
          <Panel title="Route builder" icon={Route}>
            <form className="inline-form" onSubmit={createRoutePlan}>
              <input value={routeName} onChange={(event) => setRouteName(event.target.value)} />
              <button className="primary-button" type="submit">
                <Plus size={17} />
                Save
              </button>
            </form>
            <RouteMap />
          </Panel>
          <Panel title="Segments" icon={Trophy}>
            {routes.slice(0, 3).map((route) => (
              <div className="route-row" key={route.id}>
                <div>
                  <strong>{route.name}</strong>
                  <span>{route.distanceKm} km - {route.elevationMeters} m - {route.surface}</span>
                </div>
                <button onClick={() => setToast("Segment leaderboard opened")}>
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </Panel>
        </div>
        <div className="two-column">
          <Panel title="Clubs" icon={Users}>
            {clubsSeed.map((club) => (
              <div className="route-row" key={club.id}>
                <div>
                  <strong>{club.name}</strong>
                  <span>{club.city} - {club.memberCount} members</span>
                </div>
                <button className={joinedClubs.has(club.id) ? "small-success" : ""} onClick={() => handleJoinClub(club.id)}>
                  {joinedClubs.has(club.id) ? "Joined" : "Join"}
                </button>
              </div>
            ))}
          </Panel>
          <Panel title="Challenges" icon={Sparkles}>
            {challenges.map((challenge) => (
              <div className="challenge-row" key={challenge.id}>
                <div>
                  <strong>{challenge.title}</strong>
                  <span>{challenge.participantCount.toLocaleString()} athletes</span>
                  <CompactProgress label="" value={challenge.progressPercent} />
                </div>
                <button className={joinedChallenges.has(challenge.id) ? "small-success" : ""} onClick={() => handleJoinChallenge(challenge)}>
                  {joinedChallenges.has(challenge.id) ? "Joined" : "Join"}
                </button>
              </div>
            ))}
          </Panel>
        </div>
      </section>
    );
  }

  function RaceScreen() {
    const standings = [...racePositions].sort((a, b) => b.checkpointCount - a.checkpointCount);

    return (
      <section className="race-layout">
        <div className="race-hero">
          <div>
            <h1>Mumbai Half Marathon 2026</h1>
            <p>Live map, checkpoint ranking, cheers, and category results for spectators and organizers.</p>
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={handleStartRace}>
              <Radio size={18} />
              {raceLive ? "Live" : "Start race"}
            </button>
            <button className="ghost-button" onClick={moveRace}>
              <Satellite size={18} />
              Update positions
            </button>
          </div>
        </div>
        <Panel title="Spectator map" icon={Map}>
          <div className="race-map">
            <RouteMap animated={raceLive} />
            {racePositions.map((position, index) => (
              <span key={position.athleteId} className={`runner-dot dot-${index + 1}`} title={position.name} />
            ))}
          </div>
        </Panel>
        <Panel title="Live leaderboard" icon={Trophy}>
          {standings.map((position, index) => (
            <div className="leader-row" key={position.athleteId}>
              <span>{index + 1}</span>
              <strong>{position.name}</strong>
              <em>{position.checkpointCount} checkpoints</em>
              <small>{position.pace}</small>
            </div>
          ))}
        </Panel>
        <Panel title="Send a cheer" icon={BellRing}>
          <div className="inline-form">
            <input value={cheerMessage} onChange={(event) => setCheerMessage(event.target.value)} />
            <button className="primary-button" onClick={handleCheer}>
              <Send size={17} />
              Send
            </button>
          </div>
        </Panel>
      </section>
    );
  }

  function TrainingScreen() {
    return (
      <section className="screen-grid">
        <div className="section-head">
          <div>
            <h1>Coach</h1>
            <p>Adaptive training blocks, guided sessions, recovery, and performance history.</p>
          </div>
        </div>
        <div className="training-grid">
          {workoutsSeed.map((workout) => (
            <button key={workout.id} className={selectedWorkout.id === workout.id ? "training-card active" : "training-card"} onClick={() => setSelectedWorkout(workout)}>
              <strong>{workout.title}</strong>
              <span>{workout.duration}</span>
              <em>{workout.focus}</em>
            </button>
          ))}
        </div>
        <Panel title="Session player" icon={Watch}>
          <div className="coach-player">
            <div>
              <h2>{selectedWorkout.title}</h2>
              <p>{selectedWorkout.focus}</p>
            </div>
            <button className="primary-button" onClick={() => setToast("Guided workout started")}>
              <Play size={18} />
              Start audio
            </button>
          </div>
          <div className="timeline">
            <span style={{ width: "18%" }}>Warm up</span>
            <span style={{ width: "44%" }}>Main set</span>
            <span style={{ width: "26%" }}>Finish</span>
          </div>
        </Panel>
      </section>
    );
  }

  function ProScreen() {
    return (
      <section className="screen-grid">
        <div className="section-head">
          <div>
            <h1>Aevra Pro</h1>
            <p>Advanced analytics, adaptive coaching, route tools, and event organizer features.</p>
          </div>
          <label className="country-select">
            Country
            <select value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="billing-provider">
          <CircleDollarSign size={20} />
          {currentProvider} checkout for {countryCode}
        </div>
        <div className="plans-grid">
          {plansSeed.map((plan) => (
            <div className={subscription === plan.id ? "plan-card active" : "plan-card"} key={plan.id}>
              <h2>{plan.name}</h2>
              <strong>{plan.monthlyPrice}</strong>
              {plan.features.map((feature) => (
                <span key={feature}>
                  <Check size={16} />
                  {feature}
                </span>
              ))}
              <button className="primary-button" onClick={() => handleCheckout(plan.id)}>
                {subscription === plan.id ? "Current" : "Choose"}
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function SettingsScreen() {
    return (
      <section className="screen-grid">
        <div className="section-head">
          <div>
            <h1>Settings</h1>
            <p>Identity, integrations, privacy, exports, and launch readiness.</p>
          </div>
        </div>
        <div className="two-column">
          <Panel title="Profile" icon={UserRound}>
            <div className="form-stack compact">
              <label>
                Display name
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
              </label>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
            </div>
          </Panel>
          <Panel title="Privacy" icon={Shield}>
            {["Private activity default", "Hide start and end points", "Opt out of heatmaps"].map((label) => (
              <div className="toggle-row" key={label}>
                <span>{label}</span>
                <button className="switch active">
                  <i />
                </button>
              </div>
            ))}
          </Panel>
        </div>
        <Panel title="Connected apps" icon={Link2}>
          <div className="integration-grid">
            {integrationProviders.map((provider) => (
              <button key={provider.id} className={connectedProviders.has(provider.id) ? "integration-card active" : "integration-card"} onClick={() => handleConnect(provider.id, provider.scopes)}>
                <Watch size={19} />
                <strong>{provider.label}</strong>
                <span>{connectedProviders.has(provider.id) ? "Connected" : "Connect"}</span>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Launch ops" icon={Check}>
          <div className="readiness-grid">
            {[
              "responsive UI",
              "auth and OTP flow",
              "activity tracking",
              "feed sharing",
              "race live mode",
              "payment provider hook",
              "deployment config"
            ].map((item) => (
              <span key={item}>
                <Check size={15} />
                {item}
              </span>
            ))}
          </div>
        </Panel>
      </section>
    );
  }
}

function Topbar({ displayName, countryCode, subscription }: { displayName: string; countryCode: string; subscription: string }) {
  return (
    <header className="topbar">
      <div>
        <strong>{displayName}</strong>
        <span>{countryCode} - {subscription.toUpperCase()}</span>
      </div>
      <div className="topbar-actions">
        <button aria-label="Notifications">
          <BellRing size={18} />
        </button>
        <button aria-label="Safety">
          <Shield size={18} />
        </button>
      </div>
    </header>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Home; children: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, trend }: { icon: typeof Home; label: string; value: string; trend: string }) {
  return (
    <div className="metric-card">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{trend}</em>
    </div>
  );
}

function CompactProgress({ label, value }: { label: string; value: number }) {
  return (
    <div className="compact-progress">
      {label && <span>{label}</span>}
      <div className="progress-track">
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RouteMap({ animated = false, light = false }: { animated?: boolean; light?: boolean }) {
  return (
    <svg className={light ? "route-map light" : "route-map"} viewBox="0 0 520 320" role="img" aria-label="Route map">
      <defs>
        <linearGradient id="routeStroke" x1="0" x2="1">
          <stop offset="0%" stopColor="#b9ff53" />
          <stop offset="58%" stopColor="#4ab3ff" />
          <stop offset="100%" stopColor="#ff6b4a" />
        </linearGradient>
      </defs>
      <path className="map-grid" d="M15 95 H505 M15 160 H505 M15 225 H505 M105 20 V300 M245 20 V300 M390 20 V300" />
      <path className="map-road" d="M28 246 C93 206 113 115 188 125 C252 133 250 237 326 220 C407 202 402 77 492 72" />
      <path className={animated ? "route-line animated" : "route-line"} d="M44 238 C98 202 126 137 187 143 C251 150 250 229 320 210 C386 193 405 103 475 84" />
      <circle cx="44" cy="238" r="8" className="start-dot" />
      <circle cx="475" cy="84" r="8" className="finish-dot" />
    </svg>
  );
}
