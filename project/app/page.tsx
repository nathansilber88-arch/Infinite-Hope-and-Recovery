"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Calendar, 
  BookOpen, 
  Brain, 
  Star, 
  Shield, 
  Menu, 
  X,
  ChevronRight,
  Check,
  Plus,
  ArrowUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

interface JournalEntry {
  date: string;
  content: string;
  gratitudes: string[];
  mood?: string;
}

interface Milestone {
  days: number;
  title: string;
  achieved: boolean;
  date?: string;
}

interface ThoughtRecord {
  id: string;
  date: string;
  situation: string;
  thought: string;
  emotion: string;
  intensity: number;
  evidence: string;
  alternative: string;
}

export default function InfiniteHopeRecovery() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sobrietyStartDate, setSobrietyStartDate] = useState<string>('');
  const [journalContent, setJournalContent] = useState('');
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [currentMood, setCurrentMood] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const dailyPrompts = [
    "What emotions am I experiencing today, and what might be triggering them?",
    "What victories, no matter how small, have I achieved in my recovery today?",
    "What challenges did I face today, and how did I respond to them?",
    "What triggers did I encounter, and what healthy coping strategies did I use?",
    "How has my relationship with myself and others improved since beginning recovery?",
    "What does freedom from addiction mean to me today?",
    "What am I learning about my true identity beyond my past struggles?",
    "How can I show myself compassion and grace today?",
    "What healthy boundaries do I need to maintain or establish?",
    "What positive changes have I noticed in my physical and mental health?",
    "Who or what am I grateful for in my recovery journey?",
    "What does hope look like for me today?",
    "How am I growing stronger each day?",
    "What would I tell someone else struggling with what I'm facing?",
    "What purpose and meaning am I discovering in my life?",
    "How has faith supported me through difficult moments?",
    "What healthy habits am I building to replace old patterns?",
    "What does self-care look like for me today?",
    "How am I honoring my commitment to recovery?",
    "What dreams and goals am I working toward in my new life?"
  ];

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentPromptIndex(dayOfYear % dailyPrompts.length);

    const savedStartDate = localStorage.getItem('sobrietyStartDate');
    if (savedStartDate) {
      setSobrietyStartDate(savedStartDate);
    }

    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }

    const savedThoughts = localStorage.getItem('thoughtRecords');
    if (savedThoughts) {
      setThoughtRecords(JSON.parse(savedThoughts));
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateSobrietyStats = () => {
    if (!sobrietyStartDate) return { days: 0, weeks: 0, months: 0 };
    
    const start = new Date(sobrietyStartDate);
    const today = new Date();
    
    return {
      days: differenceInDays(today, start),
      weeks: differenceInWeeks(today, start),
      months: differenceInMonths(today, start)
    };
  };

  const stats = calculateSobrietyStats();

  const milestones: Milestone[] = [
    { days: 1, title: "First Day", achieved: stats.days >= 1 },
    { days: 7, title: "One Week", achieved: stats.days >= 7 },
    { days: 30, title: "One Month", achieved: stats.days >= 30 },
    { days: 90, title: "Three Months", achieved: stats.days >= 90 },
    { days: 180, title: "Six Months", achieved: stats.days >= 180 },
    { days: 365, title: "One Year", achieved: stats.days >= 365 },
    { days: 730, title: "Two Years", achieved: stats.days >= 730 },
  ];

  const nextMilestone = milestones.find(m => !m.achieved);
  const progress = nextMilestone 
    ? (stats.days / nextMilestone.days) * 100 
    : 100;

  const saveJournalEntry = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newEntry: JournalEntry = {
      date: today,
      content: journalContent,
      gratitudes: gratitudes.filter(g => g.trim() !== ''),
      mood: currentMood
    };

    const updatedEntries = journalEntries.filter(e => e.date !== today);
    updatedEntries.unshift(newEntry);
    
    setJournalEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setLastSaved(new Date());
  };

  const handleStartDateChange = (date: string) => {
    setSobrietyStartDate(date);
    localStorage.setItem('sobrietyStartDate', date);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowMobileMenu(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const moods = [
    { emoji: "😊", label: "Peaceful", color: "bg-green-100" },
    { emoji: "😌", label: "Hopeful", color: "bg-blue-100" },
    { emoji: "😐", label: "Neutral", color: "bg-gray-100" },
    { emoji: "😔", label: "Struggling", color: "bg-yellow-100" },
    { emoji: "😰", label: "Anxious", color: "bg-orange-100" },
  ];

  const cognitiveDistortions = [
    { name: "All-or-Nothing Thinking", description: "Seeing things in black and white categories" },
    { name: "Overgeneralization", description: "Seeing a single negative event as a never-ending pattern" },
    { name: "Mental Filter", description: "Focusing exclusively on negatives" },
    { name: "Catastrophizing", description: "Expecting the worst possible outcome" },
    { name: "Emotional Reasoning", description: "Assuming feelings reflect reality" },
  ];

  const groundingExercises = [
    {
      title: "5-4-3-2-1 Grounding",
      steps: [
        "Name 5 things you can see around you",
        "Name 4 things you can touch or feel",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
    },
    {
      title: "Box Breathing",
      steps: [
        "Breathe in slowly for 4 counts",
        "Hold your breath for 4 counts",
        "Breathe out slowly for 4 counts",
        "Hold for 4 counts",
        "Repeat 4 times"
      ]
    }
  ];

  const copingStrategies = [
    "Call your sponsor or a trusted friend",
    "Attend a meeting (in-person or virtual)",
    "Go for a walk or engage in physical activity",
    "Practice deep breathing or meditation",
    "Read recovery literature or scripture",
    "Write in your journal about what you're feeling",
    "Listen to calming or uplifting music",
    "Engage in a creative activity",
    "Help someone else in need",
    "Remember your reasons for staying sober"
  ];

  const affirmations = [
    "I am stronger than my cravings",
    "This feeling will pass",
    "I choose freedom over temporary relief",
    "I am worthy of a healthy, sober life",
    "I have the power to make healthy choices",
    "My recovery is worth fighting for",
    "I am not alone in this journey",
    "Each moment of resistance makes me stronger",
    "I am creating a better future for myself",
    "I am loved and supported"
  ];

  const devotionals = [
    {
      title: "Renewed Strength",
      verse: "Isaiah 40:31",
      text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
      reflection: "In recovery, we learn that our strength doesn't come from ourselves alone. When we feel weak, we can turn to a higher power for renewal. Each day of sobriety is evidence of this divine strength working in our lives."
    },
    {
      title: "New Creation",
      verse: "2 Corinthians 5:17",
      text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
      reflection: "Recovery is about becoming a new person. Your past does not define your future. You are being transformed day by day into the person you were created to be."
    },
    {
      title: "Peace in the Storm",
      verse: "Philippians 4:6-7",
      text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds.",
      reflection: "When cravings or anxiety threaten your peace, remember that you can bring these struggles to God. His peace is available to you, even in the most difficult moments."
    }
  ];

  const [currentDevotional] = useState(devotionals[new Date().getDate() % devotionals.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Infinite Hope & Recovery</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Your journey to transformation</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={activeSection === 'journal' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('journal')}
              >
                Journal
              </Button>
              <Button
                variant={activeSection === 'cbt' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('cbt')}
              >
                CBT Tools
              </Button>
              <Button
                variant={activeSection === 'faith' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('faith')}
              >
                Faith
              </Button>
              <Button
                variant={activeSection === 'progress' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('progress')}
              >
                Progress
              </Button>
            </nav>

            {/* Crisis Button */}
            <Button
              onClick={() => setShowCrisisModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              Need Support
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-2 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => scrollToSection('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => scrollToSection('journal')}
                >
                  Journal
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => scrollToSection('cbt')}
                >
                  CBT Tools
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => scrollToSection('faith')}
                >
                  Faith
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => scrollToSection('progress')}
                >
                  Progress
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Dashboard Section */}
          <section id="dashboard" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome to Your Recovery Journey
              </h2>
              <p className="text-lg text-gray-600">
                Every day is a new opportunity for growth and healing
              </p>
            </motion.div>

            {/* Sobriety Counter */}
            <Card className="mb-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Your Sobriety Journey</CardTitle>
                <CardDescription className="text-blue-100">
                  Celebrating your commitment to recovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!sobrietyStartDate ? (
                  <div className="space-y-4">
                    <p className="text-white/90">Set your sobriety start date to begin tracking</p>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="date"
                        value={sobrietyStartDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        max={format(new Date(), 'yyyy-MM-dd')}
                      />
                      <Button
                        onClick={() => handleStartDateChange(format(new Date(), 'yyyy-MM-dd'))}
                        className="bg-white text-blue-600 hover:bg-blue-50"
                      >
                        Start Today
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-7xl font-bold mb-2">{stats.days}</div>
                      <div className="text-2xl text-blue-100">Days Sober</div>
                      <div className="mt-4 flex justify-center space-x-8 text-sm">
                        <div>
                          <div className="text-3xl font-semibold">{stats.weeks}</div>
                          <div className="text-blue-100">Weeks</div>
                        </div>
                        <div>
                          <div className="text-3xl font-semibold">{stats.months}</div>
                          <div className="text-blue-100">Months</div>
                        </div>
                      </div>
                    </div>

                    {nextMilestone && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-blue-100">
                          <span>Next Milestone: {nextMilestone.title}</span>
                          <span>{nextMilestone.days - stats.days} days to go</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {milestones.slice(0, 4).map((milestone) => (
                        <div
                          key={milestone.days}
                          className={`p-3 rounded-lg text-center ${
                            milestone.achieved
                              ? 'bg-white/20 border-2 border-yellow-400'
                              : 'bg-white/10'
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {milestone.achieved ? '🏆' : '🔒'}
                          </div>
                          <div className="text-xs font-semibold">{milestone.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    Journal Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{journalEntries.length}</div>
                  <p className="text-sm text-gray-600 mt-1">Total reflections</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="w-5 h-5 mr-2 text-purple-600" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {milestones.filter(m => m.achieved).length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Achievements unlocked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.days}</div>
                  <p className="text-sm text-gray-600 mt-1">Consecutive days</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Journal Section */}
          <section id="journal" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Daily Journal</h2>
              
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Reflection</CardTitle>
                      <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
                    </div>
                    {lastSaved && (
                      <div className="text-sm text-gray-500">
                        Saved {format(lastSaved, 'h:mm a')}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Daily Prompt */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">💭</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Today's Prompt</h3>
                        <p className="text-gray-700">{dailyPrompts[currentPromptIndex]}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => setCurrentPromptIndex((currentPromptIndex + 1) % dailyPrompts.length)}
                        >
                          <ChevronRight className="w-4 h-4 mr-1" />
                          Different prompt
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Journal Entry */}
                  <div className="space-y-2">
                    <Label htmlFor="journal-entry">Your Reflection</Label>
                    <Textarea
                      id="journal-entry"
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                      placeholder="Take a moment to reflect on your day, your feelings, and your journey..."
                      className="min-h-[200px] resize-none"
                    />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{journalContent.length} characters</span>
                      <Button
                        onClick={saveJournalEntry}
                        disabled={!journalContent.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Entry
                      </Button>
                    </div>
                  </div>

                  {/* Gratitude Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-gray-900">Daily Gratitudes</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      List three things you're grateful for today. Gratitude strengthens recovery.
                    </p>
                    <div className="space-y-3">
                      {gratitudes.map((gratitude, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-gray-400">{index + 1}.</span>
                          <Input
                            value={gratitude}
                            onChange={(e) => {
                              const newGratitudes = [...gratitudes];
                              newGratitudes[index] = e.target.value;
                              setGratitudes(newGratitudes);
                            }}
                            placeholder={`I am grateful for...`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mood Check-in */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">How are you feeling today?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {moods.map((mood) => (
                        <button
                          key={mood.label}
                          onClick={() => setCurrentMood(mood.label)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            currentMood === mood.label
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{mood.emoji}</div>
                          <div className="text-sm font-medium text-gray-700">{mood.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* CBT Section */}
          <section id="cbt" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">CBT Tools</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thought Record */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      Thought Record
                    </CardTitle>
                    <CardDescription>
                      Challenge negative thoughts with evidence-based thinking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>What situation triggered this thought?</Label>
                      <Input placeholder="Describe the situation..." />
                    </div>
                    <div className="space-y-2">
                      <Label>What automatic thought came to mind?</Label>
                      <Textarea placeholder="What did you think?" className="min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>What emotion did you feel?</Label>
                      <Input placeholder="e.g., anxious, sad, angry..." />
                    </div>
                    <div className="space-y-2">
                      <Label>What evidence supports this thought?</Label>
                      <Textarea placeholder="List facts that support this thought..." className="min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>What's a more balanced perspective?</Label>
                      <Textarea placeholder="Reframe the thought with evidence..." className="min-h-[80px]" />
                    </div>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Save Thought Record
                    </Button>
                  </CardContent>
                </Card>

                {/* Cognitive Distortions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Common Cognitive Distortions</CardTitle>
                    <CardDescription>
                      Recognize unhelpful thinking patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cognitiveDistortions.map((distortion, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {distortion.name}
                          </h4>
                          <p className="text-sm text-gray-600">{distortion.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </section>

          {/* Faith Section */}
          <section id="faith" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Faith & Devotion</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Devotional */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Today's Devotional
                    </CardTitle>
                    <CardDescription>{currentDevotional.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm font-semibold text-blue-900 mb-2">
                        {currentDevotional.verse}
                      </div>
                      <p className="text-gray-700 italic">"{currentDevotional.text}"</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Reflection</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {currentDevotional.reflection}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Affirmations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Affirmations</CardTitle>
                    <CardDescription>Truths to remember</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {affirmations.slice(0, 5).map((affirmation, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                        >
                          <p className="text-sm text-gray-800 font-medium">{affirmation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Prayer Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Prayer Journal</CardTitle>
                  <CardDescription>
                    Share your heart and find peace in prayer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your prayers, concerns, and thanksgivings..."
                    className="min-h-[150px]"
                  />
                  <Button className="mt-4">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Prayer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Progress Section */}
          <section id="progress" className="scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Progress</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milestone Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Milestone Timeline</CardTitle>
                    <CardDescription>Celebrating your achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              milestone.achieved
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                : 'bg-gray-200'
                            }`}
                          >
                            <span className="text-2xl">
                              {milestone.achieved ? '🏆' : '🔒'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {milestone.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {milestone.achieved
                                ? `Achieved! ${milestone.days} days`
                                : `${milestone.days} days`}
                            </div>
                          </div>
                          {milestone.achieved && (
                            <Check className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Entries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Journal Entries</CardTitle>
                    <CardDescription>Your reflection history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {journalEntries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No journal entries yet</p>
                        <p className="text-sm">Start writing to track your journey</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {journalEntries.slice(0, 5).map((entry, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-semibold text-gray-900">
                                {format(new Date(entry.date), 'MMM d, yyyy')}
                              </div>
                              {entry.mood && (
                                <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                                  {entry.mood}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {entry.content}
                            </p>
                            {entry.gratitudes.length > 0 && (
                              <div className="mt-2 flex items-center text-xs text-gray-600">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {entry.gratitudes.length} gratitudes
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Crisis Support Tools</h2>
                      <p className="text-orange-100">You are not alone. Help is here.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCrisisModal(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Emergency Contacts */}
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-900">Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-semibold">National Suicide Prevention Lifeline</div>
                        <div className="text-sm text-gray-600">24/7 Crisis Support</div>
                      </div>
                      <a
                        href="tel:988"
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                      >
                        Call 988
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-semibold">SAMHSA National Helpline</div>
                        <div className="text-sm text-gray-600">Treatment Referral</div>
                      </div>
                      <a
                        href="tel:1-800-662-4357"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Call Now
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Grounding Exercises */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groundingExercises.map((exercise, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {exercise.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-2">
                              <span className="font-semibold text-blue-600 mt-0.5">
                                {stepIndex + 1}.
                              </span>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Coping Strategies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Immediate Coping Strategies</CardTitle>
                    <CardDescription>
                      Choose one or more strategies to help right now
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {copingStrategies.map((strategy, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start space-x-2">
                            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-800">{strategy}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Affirmations */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle>Remember These Truths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {affirmations.map((affirmation, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg shadow-sm"
                        >
                          <p className="text-sm font-medium text-gray-800 text-center">
                            {affirmation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-40"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
// END OF FILE