export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  profilePicture?: string;
  website?: string;
  verified: boolean;
  private: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  lastSeen?: Date;
  accountType: 'personal' | 'creator' | 'business';
  businessCategory?: string;
  contactButtons?: ContactButton[];
  twoFactorEnabled: boolean;
  subscriptionTier?: SubscriptionTier;
  closeFriends: string[];
  restrictedUsers: string[];
  mutedUsers: string[];
  blockedUsers: string[];
  nameTag?: string;
  qrCode?: string;
}

export interface ContactButton {
  type: 'email' | 'phone' | 'address' | 'website';
  label: string;
  value: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  benefits: string[];
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  caption: string;
  imageUrl: string;
  imageUrls?: string[]; // For carousel posts (up to 10)
  videoUrl?: string;
  videoDuration?: number; // For videos (up to 60 seconds for posts)
  location?: Location;
  tags: string[];
  mentionedUsers: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount?: number; // For videos
  isLiked: boolean;
  isSaved: boolean;
  commentsEnabled: boolean;
  likesVisible: boolean;
  isCarousel: boolean;
  currentSlide?: number;
  filters?: PostFilter;
  isCollab?: boolean;
  collabUsers?: User[];
  musicTrack?: MusicTrack;
  productTags?: ProductTag[];
  isSponsored?: boolean;
  sponsorInfo?: SponsorInfo;
  insights?: PostInsights;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  postCount: number;
}

export interface ProductTag {
  id: string;
  product: Product;
  position: {
    x: number;
    y: number;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  merchant: string;
  description?: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
}

export interface SponsorInfo {
  brandName: string;
  campaignType: 'sponsored' | 'partnership' | 'paid_partnership';
  disclosureText: string;
}

export interface PostInsights {
  reach: number;
  impressions: number;
  engagement: number;
  saves: number;
  shares: number;
  profileVisits: number;
  websiteClicks: number;
  emailContacts: number;
  callContacts: number;
  textContacts: number;
  getDirectionClicks: number;
}

export interface PostFilter {
  name: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  vignette?: number;
  blur?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverImage?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  content?: string; // For compatibility with components
  mentionedUsers: string[];
  likesCount: number;
  isLiked: boolean;
  parentCommentId?: string; // For replies
  repliesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration?: number; // For videos
  text?: string;
  backgroundColor?: string;
  viewsCount: number;
  isViewed: boolean;
  stickers?: StorySticker[];
  musicTrack?: MusicTrack;
  isCloseFriends?: boolean;
  reactions?: StoryReaction[];
  viewers?: StoryViewer[];
  createdAt: Date;
  expiresAt: Date;
}

export interface StorySticker {
  id: string;
  type: 'poll' | 'question' | 'music' | 'location' | 'hashtag' | 'mention' | 'gif' | 'emoji';
  position: { x: number; y: number };
  data: any; // Flexible data for different sticker types
}

export interface StoryReaction {
  id: string;
  userId: string;
  user: User;
  emoji: string;
  createdAt: Date;
}

export interface StoryViewer {
  id: string;
  userId: string;
  user: User;
  viewedAt: Date;
}

export interface StoryHighlight {
  id: string;
  userId: string;
  title: string;
  coverImage: string;
  stories: Story[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  message?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  postId?: string; // For shared posts
  storyId?: string; // For shared stories
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: DirectMessage;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  adminIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  isVanishMode?: boolean;
  mutedUntil?: Date;
  isArchived?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  fromUser: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_mention' | 'post_share' | 'live_video';
  postId?: string;
  commentId?: string;
  storyId?: string;
  text?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followeeId: string;
  createdAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  storyId?: string;
  createdAt: Date;
}

export interface Save {
  id: string;
  userId: string;
  postId: string;
  collectionId?: string;
  createdAt: Date;
}

export interface SaveCollection {
  id: string;
  userId: string;
  name: string;
  coverImage?: string;
  private: boolean;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveStream {
  id: string;
  userId: string;
  user: User;
  title: string;
  isActive: boolean;
  viewersCount: number;
  viewers: User[];
  startedAt: Date;
  endedAt?: Date;
}

export interface SearchResult {
  users: User[];
  posts: Post[];
  tags: { name: string; postsCount: number }[];
  locations: { name: string; postsCount: number }[];
}

export interface Activity {
  following: Post[];
  you: Notification[];
}

export interface AuthUser extends User {
  emailVerified: boolean;
  phoneNumber?: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    directMessages: boolean;
    liveVideos: boolean;
  };
  privacy: {
    private: boolean;
    showActivity: boolean;
    allowMessageRequests: boolean;
    allowTagging: boolean;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

// Reels Types
export interface Reel {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  mentionedUsers: string[];
  musicTrack: MusicTrack;
  duration: number; // up to 90 seconds, some accounts 10 minutes
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  playsCount: number;
  viewsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  effects?: Effect[];
  isRemix?: boolean;
  originalReelId?: string;
  remixType?: 'duet' | 'react' | 'green_screen';
  insights?: ReelInsights;
  template?: ReelTemplate;
  createdAt: Date;
}

export interface Effect {
  id: string;
  name: string;
  category: 'face' | 'world' | 'background' | 'ar';
  creator: string;
  thumbnail: string;
  usageCount: number;
}

export interface ReelInsights {
  plays: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  averageWatchTime: number;
  completion: number;
  profileVisits: number;
  follows: number;
}

export interface ReelTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  transitions: string[];
  musicSuggestions: MusicTrack[];
  thumbnail: string;
  usageCount: number;
}

// Enhanced Music Track
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverImage?: string;
  isOriginal?: boolean;
  usageCount?: number;
  category?: string;
  trending?: boolean;
}

// Notes Types
export interface Note {
  id: string;
  userId: string;
  user: User;
  content: string;
  musicTrack?: MusicTrack;
  prompt?: string;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface NoteReply {
  id: string;
  noteId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
}

// Broadcast Channels
export interface BroadcastChannel {
  id: string;
  creatorId: string;
  creator: User;
  name: string;
  description: string;
  subscribersCount: number;
  messagesCount: number;
  isSubscribed: boolean;
  messages: BroadcastMessage[];
  createdAt: Date;
}

export interface BroadcastMessage {
  id: string;
  channelId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll';
  mediaUrl?: string;
  reactions: MessageReaction[];
  poll?: Poll;
  createdAt: Date;
}

export interface MessageReaction {
  id: string;
  userId: string;
  user: User;
  emoji: string;
  createdAt: Date;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  expiresAt?: Date;
  hasVoted: boolean;
  userVote?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

// Enhanced Analytics
export interface Analytics {
  period: 'day' | 'week' | 'month' | 'year';
  overview: AnalyticsOverview;
  content: ContentAnalytics;
  audience: AudienceAnalytics;
  discovery: DiscoveryAnalytics;
}

export interface AnalyticsOverview {
  accountsReached: number;
  contentInteractions: number;
  totalFollowers: number;
  websiteClicks: number;
  emailContacts: number;
  phoneContacts: number;
  textContacts: number;
  getDirectionsClicks: number;
}

export interface ContentAnalytics {
  postsShared: number;
  storiesShared: number;
  reelsShared: number;
  topPosts: Post[];
  topReels: Reel[];
  topStories: Story[];
}

export interface AudienceAnalytics {
  totalFollowers: number;
  followersGrowth: number;
  demographics: {
    ageGroups: { [key: string]: number };
    genders: { [key: string]: number };
    topLocations: { [key: string]: number };
  };
  activity: {
    mostActiveHours: { [key: string]: number };
    mostActiveDays: { [key: string]: number };
  };
}

export interface DiscoveryAnalytics {
  reach: number;
  impressions: number;
  sources: {
    home: number;
    hashtags: number;
    explore: number;
    profile: number;
    other: number;
  };
}

// Shopping Types
export interface ShopSection {
  id: string;
  userId: string;
  name: string;
  products: Product[];
  isActive: boolean;
  createdAt: Date;
}

export interface ShoppingBag {
  id: string;
  userId: string;
  items: ShoppingItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface ShoppingItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  attributes: { [key: string]: string };
}

// Monetization Types
export interface CreatorBonus {
  id: string;
  type: 'reel_play' | 'story_view' | 'live_view';
  amount: number;
  currency: string;
  period: string;
  earned: number;
  threshold: number;
  isActive: boolean;
}

export interface Badge {
  id: string;
  name: string;
  price: number;
  currency: string;
  icon: string;
  color: string;
}

export interface LiveStreamBadge {
  id: string;
  streamId: string;
  userId: string;
  user: User;
  badge: Badge;
  count: number;
  totalAmount: number;
  sentAt: Date;
}

// AI Features
export interface AIFeature {
  type: 'caption_suggestion' | 'hashtag_suggestion' | 'translation' | 'sticker_generation';
  input: string;
  output: string;
  confidence: number;
  language?: string;
}

export interface Translation {
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  confidence: number;
}