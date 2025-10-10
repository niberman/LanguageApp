import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Admin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newLevel, setNewLevel] = useState({
    track: 'english',
    number: '',
    title: '',
    quizletId: '',
    youtubeId: '',
  });

  //todo: remove mock functionality
  const mockUsers = [
    { id: 1, name: 'John Doe', lastActivity: '2 hours ago', streak: 7 },
    { id: 2, name: 'Jane Smith', lastActivity: '1 day ago', streak: 3 },
  ];

  const handleAddLevel = () => {
    //todo: remove mock functionality
    toast({
      title: 'Level added',
      description: `${newLevel.title} has been created`,
    });
    console.log('New level:', newLevel);
    setNewLevel({ track: 'english', number: '', title: '', quizletId: '', youtubeId: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-admin-title">
            {t('admin.title')}
          </h1>

          <Tabs defaultValue="levels">
            <TabsList className="mb-6">
              <TabsTrigger value="levels" data-testid="tab-levels">
                {t('admin.levels')}
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                {t('admin.users')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="levels">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Level</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="track">Track</Label>
                      <select
                        id="track"
                        className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                        value={newLevel.track}
                        onChange={(e) => setNewLevel({ ...newLevel, track: e.target.value })}
                        data-testid="select-track"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="number">Level Number</Label>
                      <Input
                        id="number"
                        type="number"
                        value={newLevel.number}
                        onChange={(e) => setNewLevel({ ...newLevel, number: e.target.value })}
                        className="mt-2"
                        data-testid="input-level-number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newLevel.title}
                      onChange={(e) => setNewLevel({ ...newLevel, title: e.target.value })}
                      className="mt-2"
                      data-testid="input-level-title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quizlet">Quizlet Set ID</Label>
                    <Input
                      id="quizlet"
                      value={newLevel.quizletId}
                      onChange={(e) => setNewLevel({ ...newLevel, quizletId: e.target.value })}
                      className="mt-2"
                      data-testid="input-quizlet-id"
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtube">YouTube Playlist ID</Label>
                    <Input
                      id="youtube"
                      value={newLevel.youtubeId}
                      onChange={(e) => setNewLevel({ ...newLevel, youtubeId: e.target.value })}
                      className="mt-2"
                      data-testid="input-youtube-id"
                    />
                  </div>

                  <Button onClick={handleAddLevel} data-testid="button-add-level">
                    Add Level
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Last Activity</th>
                        <th className="text-left py-3 px-4">Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b" data-testid={`row-user-${user.id}`}>
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.lastActivity}</td>
                          <td className="py-3 px-4">{user.streak} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
