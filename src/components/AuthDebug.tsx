import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AuthDebug() {
  const { isAuthenticated, admin, token, loading, error } = useAuth();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Has Token:</strong> {token ? 'Yes' : 'No'}
          </div>
          {token && (
            <div>
              <strong>Token Preview:</strong> {token.substring(0, 20)}...
            </div>
          )}
          {admin && (
            <div>
              <strong>Admin Email:</strong> {admin.email}
            </div>
          )}
          {error && (
            <div className="text-red-500">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
