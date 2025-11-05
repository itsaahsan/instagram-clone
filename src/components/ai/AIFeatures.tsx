import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  AutoAwesome,
  Translate,
  Psychology,
  TextFields,
  Tag,
  TrendingUp,
  Lightbulb,
} from '@mui/icons-material';
import { Translation } from '@/types';

interface AIFeaturesProps {
  userId: string;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  // Mock AI-generated suggestions
  const mockHashtagSuggestions = [
    '#photography', '#sunset', '#nature', '#beautiful', '#instagood',
    '#photooftheday', '#landscape', '#travel', '#wanderlust', '#adventure'
  ];

  const mockCaptionSuggestions = [
    "Chasing sunsets and capturing moments 🌅",
    "Every sunset brings the promise of a new dawn",
    "Nature's canvas painted with golden hues",
    "Lost in the beauty of this moment",
    "When the sky becomes art"
  ];

  const mockProfileSuggestions = [
    "✨ Capturing life's beautiful moments",
    "🌍 Adventure seeker & storyteller",
    "📸 Creating memories one shot at a time",
    "🎨 Visual storyteller & dreamer",
    "🌟 Living life in full color"
  ];

  const generateCaptions = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setCaptions(mockCaptionSuggestions);
      setIsLoading(false);
    }, 2000);
  };

  const generateHashtags = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setHashtags(mockHashtagSuggestions);
      setIsLoading(false);
    }, 1500);
  };

  const translateText = async (text: string, targetLanguage: string) => {
    setIsLoading(true);
    
    // Simulate translation
    setTimeout(() => {
      const mockTranslation: Translation = {
        originalText: text,
        translatedText: `[${targetLanguage.toUpperCase()}] ${text}`, // Mock translation
        fromLanguage: 'en',
        toLanguage: targetLanguage,
        confidence: 0.95,
      };
      
      setTranslations([mockTranslation, ...translations]);
      setIsLoading(false);
      setShowTranslationDialog(false);
    }, 1000);
  };

  const generateProfileSuggestions = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setProfileSuggestions(mockProfileSuggestions);
      setIsLoading(false);
    }, 1500);
  };

  const CaptionGeneratorTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Caption Generator
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Describe your photo or video, and AI will generate engaging captions for you.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Describe your content (e.g., 'sunset at the beach', 'coffee shop vibes', 'workout session')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="contained"
            onClick={generateCaptions}
            disabled={!inputText.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <AutoAwesome />}
            fullWidth
          >
            {isLoading ? 'Generating...' : 'Generate Captions'}
          </Button>
        </CardContent>
      </Card>

      {captions.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generated Captions
            </Typography>
            {captions.map((caption, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {caption}
                  </Typography>
                  <Button size="small" variant="outlined">
                    Copy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const HashtagGeneratorTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Smart Hashtag Suggestions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get trending and relevant hashtags to boost your post's discoverability.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Describe your content or paste your caption"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="contained"
            onClick={generateHashtags}
            disabled={!inputText.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Tag />}
            fullWidth
          >
            {isLoading ? 'Finding hashtags...' : 'Generate Hashtags'}
          </Button>
        </CardContent>
      </Card>

      {hashtags.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Hashtags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {hashtags.map((hashtag, index) => (
                <Chip
                  key={index}
                  label={hashtag}
                  onClick={() => {
                    // Copy to clipboard or add to post
                  }}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
            <Button variant="outlined" size="small">
              Copy All Hashtags
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const TranslationTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Auto Translation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Translate your content to reach a global audience.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enter text to translate"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Target Language</InputLabel>
            <Select
              value={selectedLanguage}
              label="Target Language"
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            onClick={() => translateText(inputText, selectedLanguage)}
            disabled={!inputText.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Translate />}
            fullWidth
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </Button>
        </CardContent>
      </Card>

      {translations.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Translation History
            </Typography>
            {translations.map((translation, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Original ({translation.fromLanguage.toUpperCase()}):
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {translation.originalText}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Translation ({translation.toLanguage.toUpperCase()}):
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {translation.translatedText}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Confidence: {Math.round(translation.confidence * 100)}%
                    </Typography>
                    <Button size="small" variant="outlined">
                      Copy Translation
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const ProfileOptimizationTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Profile Optimization
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get AI-powered suggestions to optimize your profile and bio.
          </Typography>
          
          <Button
            variant="contained"
            onClick={generateProfileSuggestions}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Psychology />}
            fullWidth
          >
            {isLoading ? 'Analyzing...' : 'Get Profile Suggestions'}
          </Button>
        </CardContent>
      </Card>

      {profileSuggestions.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bio Suggestions
            </Typography>
            {profileSuggestions.map((suggestion, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {suggestion}
                  </Typography>
                  <Button size="small" variant="outlined">
                    Use This Bio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Insights
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Engagement Rate"
                secondary="Your posts get 15% more engagement than average"
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Lightbulb />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Best Posting Time"
                secondary="Post between 6-8 PM for maximum reach"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        AI-Powered Features
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Caption Generator" icon={<TextFields />} />
        <Tab label="Hashtag Suggestions" icon={<Tag />} />
        <Tab label="Translation" icon={<Translate />} />
        <Tab label="Profile Optimization" icon={<Psychology />} />
      </Tabs>

      {selectedTab === 0 && <CaptionGeneratorTab />}
      {selectedTab === 1 && <HashtagGeneratorTab />}
      {selectedTab === 2 && <TranslationTab />}
      {selectedTab === 3 && <ProfileOptimizationTab />}
    </Box>
  );
};

export default AIFeatures;