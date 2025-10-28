import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Activity, TrendingUp, Calendar, Flame, Database, CheckCircle, XCircle } from 'lucide-react';
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
          title: 'Éxito',
          description: data.message,
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Error al sembrar la base de datos',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
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
        <Database className="mr-2 h-4 w-4" />
        {loading ? 'Sembrando...' : 'Sembrar Base de Datos'}
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
  const { session } = useAuth();

  // Fetch admin analytics (with authentication)
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
    enabled: !!session,
  });

  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return d.toLocaleDateString('es-ES');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-admin-title">
            {t('admin.title')}
          </h1>

          {/* Platform Stats Overview */}
          {!isLoading && analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.platformStats.totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.platformStats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.platformStats.totalUsers > 0
                      ? `${Math.round((analytics.platformStats.activeUsers / analytics.platformStats.totalUsers) * 100)}% del total`
                      : '0%'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actividades Completadas</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.platformStats.totalCompletions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Promedio por Usuario</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.platformStats.avgCompletionsPerUser}</div>
                  <p className="text-xs text-muted-foreground">actividades</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users" data-testid="tab-users">
                Usuarios y Actividad
              </TabsTrigger>
              <TabsTrigger value="database" data-testid="tab-database">
                Base de Datos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad de Usuarios</CardTitle>
                  <CardDescription>
                    Todos los usuarios registrados y sus estadísticas de aprendizaje
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Cargando datos...</p>
                    </div>
                  ) : analytics && analytics.users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">Usuario</th>
                            <th className="text-left py-3 px-4 font-semibold">Racha</th>
                            <th className="text-left py-3 px-4 font-semibold">Actividades</th>
                            <th className="text-left py-3 px-4 font-semibold">Última Actividad</th>
                            <th className="text-left py-3 px-4 font-semibold">Registrado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.users.map((user: any) => (
                            <tr key={user.id} className="border-b hover-elevate" data-testid={`row-user-${user.id}`}>
                              <td className="py-3 px-4">
                                <div className="font-medium">{user.displayName}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {user.id.substring(0, 8)}...
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Flame className="h-4 w-4 text-orange-500" />
                                  <span className="font-semibold text-orange-500">
                                    {user.streak} días
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold">{user.totalActivities}</span>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {formatDate(user.lastActivity)}
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString('es-ES')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No hay usuarios registrados todavía</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sembrar Base de Datos</h2>
                <p className="text-muted-foreground mb-6">
                  Usa esto para agregar el curso de ejemplo a la base de datos de producción.
                </p>
                
                <DatabaseSeedSection />
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
