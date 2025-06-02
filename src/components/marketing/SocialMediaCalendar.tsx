
import React, { useState } from 'react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Calendar, Instagram, Twitter, Youtube, Facebook, Plus, Edit, Trash2, Clock, Eye } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'twitter' | 'youtube' | 'facebook' | 'tiktok';
  content: string;
  media_url?: string;
  scheduled_date: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  posts: SocialPost[];
  status: 'active' | 'completed' | 'draft';
}

export const SocialMediaCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');

  // Mock data
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      content: 'Discover the art of luxury fragrance with our latest Eau de Parfum collection ✨ #MiNNewYork #LuxuryFragrance',
      media_url: '/api/placeholder/400/400',
      scheduled_date: '2024-06-03T10:00:00',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: '2',
      platform: 'twitter',
      content: 'Behind the scenes: The craftsmanship that goes into every bottle of MiN NEW YORK',
      scheduled_date: '2024-06-03T14:00:00',
      status: 'scheduled'
    },
    {
      id: '3',
      platform: 'facebook',
      content: 'New arrivals now available! Experience the essence of luxury with our curated collection.',
      scheduled_date: '2024-06-04T09:00:00',
      status: 'draft'
    }
  ];

  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Collection Launch',
      start_date: '2024-06-01',
      end_date: '2024-06-30',
      posts: mockPosts,
      status: 'active'
    },
    {
      id: '2',
      name: 'Father\'s Day Promotion',
      start_date: '2024-06-10',
      end_date: '2024-06-16',
      posts: [],
      status: 'draft'
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'twitter': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'youtube': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'facebook': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPostsForDate = (date: string) => {
    return mockPosts.filter(post => 
      post.scheduled_date.startsWith(date)
    );
  };

  const handleCreatePost = () => {
    toast.success('Post created successfully!');
    setShowNewPostModal(false);
  };

  const handleSchedulePost = (postId: string) => {
    toast.success('Post scheduled successfully!');
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">Scheduled Posts</p>
              <p className="text-2xl font-bold text-blue-400">{mockPosts.filter(p => p.status === 'scheduled').length}</p>
            </div>
            <Clock className="h-6 w-6 text-blue-400/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">Draft Posts</p>
              <p className="text-2xl font-bold text-yellow-400">{mockPosts.filter(p => p.status === 'draft').length}</p>
            </div>
            <Edit className="h-6 w-6 text-yellow-400/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">Active Campaigns</p>
              <p className="text-2xl font-bold text-green-400">{mockCampaigns.filter(c => c.status === 'active').length}</p>
            </div>
            <Calendar className="h-6 w-6 text-green-400/60" />
          </div>
        </LuxuryCard>

        <LuxuryCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-cream/60 text-sm">This Week</p>
              <p className="text-2xl font-bold text-purple-400">{getWeekDates().reduce((count, date) => count + getPostsForDate(date).length, 0)}</p>
            </div>
            <Eye className="h-6 w-6 text-purple-400/60" />
          </div>
        </LuxuryCard>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="bg-luxury-black/50 border border-luxury-gold/20">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            All Posts
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <LuxuryCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display text-luxury-gold">Content Calendar</h3>
              <LuxuryButton 
                onClick={() => setShowNewPostModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </LuxuryButton>
            </div>

            {/* Week View */}
            <div className="grid grid-cols-7 gap-4">
              {getWeekDates().map((date) => {
                const dayPosts = getPostsForDate(date);
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                const dayNumber = new Date(date).getDate();
                
                return (
                  <div key={date} className="border border-luxury-gold/20 rounded-lg p-3 min-h-[200px]">
                    <div className="text-center mb-3">
                      <div className="text-xs text-luxury-cream/60">{dayName}</div>
                      <div className="text-lg font-medium text-luxury-cream">{dayNumber}</div>
                    </div>
                    
                    <div className="space-y-2">
                      {dayPosts.map((post) => (
                        <div key={post.id} className={`p-2 rounded border text-xs ${getPlatformColor(post.platform)}`}>
                          <div className="flex items-center space-x-1 mb-1">
                            {getPlatformIcon(post.platform)}
                            <span className="text-xs">
                              {new Date(post.scheduled_date).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="text-xs line-clamp-2">
                            {post.content.substring(0, 50)}...
                          </div>
                          <span className={`inline-block px-1 py-0.5 rounded text-xs mt-1 ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <LuxuryCard className="p-6">
            <h3 className="text-lg font-display text-luxury-gold mb-4">All Posts</h3>
            
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="border border-luxury-gold/20 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded border text-sm ${getPlatformColor(post.platform)}`}>
                          {getPlatformIcon(post.platform)}
                          <span className="capitalize">{post.platform}</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-luxury-cream">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-luxury-cream/60">
                        <span>Scheduled: {new Date(post.scheduled_date).toLocaleString()}</span>
                        {post.engagement && (
                          <span>Engagement: {post.engagement.likes + post.engagement.comments + post.engagement.shares}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <LuxuryButton variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </LuxuryButton>
                      <LuxuryButton variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </LuxuryButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <LuxuryCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display text-luxury-gold">Marketing Campaigns</h3>
              <LuxuryButton className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Campaign</span>
              </LuxuryButton>
            </div>

            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <div key={campaign.id} className="border border-luxury-gold/20 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium text-luxury-cream">{campaign.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-luxury-cream/60">
                        <span>{campaign.start_date} - {campaign.end_date}</span>
                        <span>{campaign.posts.length} posts</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                          campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    <LuxuryButton variant="outline" size="sm">
                      View Details
                    </LuxuryButton>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <LuxuryCard className="p-6">
            <h3 className="text-lg font-display text-luxury-gold mb-4">Social Media Analytics</h3>
            <div className="text-center py-8 text-luxury-cream/60">
              <Eye className="h-12 w-12 mx-auto mb-4 text-luxury-gold/40" />
              <p>Analytics dashboard coming soon...</p>
              <p className="text-sm mt-2">Track engagement, reach, and campaign performance across all platforms</p>
            </div>
          </LuxuryCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
