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

function DatabaseSeedSection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: '✅ Éxito',
          description: data.message,
        });
      } else {
        toast({
          title: '❌ Error',
          description: data.error || 'Error al sembrar la base de datos',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleSeed}
        disabled={loading}
        className="w-full"
        data-testid="button-seed"
      >
        {loading ? 'Sembrando...' : '🌱 Sembrar Base de Datos'}
      </Button>

      {result && (
        <Card className="p-4 bg-muted">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}

      <div className="text-sm text-muted-foreground space-y-2 mt-4">
        <p><strong>Qué hace esto:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Crea 1 curso: "Fundamentos de Inglés 1"</li>
          <li>Crea 1 lección</li>
          <li>Crea 6 temas diferentes</li>
          <li>Crea 12 actividades (2 por tema: 1 video + 1 Quizlet)</li>
        </ul>
        <p className="mt-3">
          <strong>Nota:</strong> Si los cursos ya existen, no se crearán duplicados.
        </p>
      </div>
    </div>
  );
}

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

          <Tabs defaultValue="database">
            <TabsList className="mb-6">
              <TabsTrigger value="database" data-testid="tab-database">
                Base de Datos
              </TabsTrigger>
              <TabsTrigger value="levels" data-testid="tab-levels">
                {t('admin.levels')}
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                {t('admin.users')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="database">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sembrar Base de Datos</h2>
                <p className="text-muted-foreground mb-6">
                  Usa esto para agregar el curso de ejemplo a la base de datos de producción.
                </p>
                
                <DatabaseSeedSection />
              </Card>
            </TabsContent>

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
