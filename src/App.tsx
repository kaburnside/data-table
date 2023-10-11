
import './App.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserDataTable } from "./features/data-table/components/UserDataTable"
import { Login } from './features/authentication/components/Login';
import { AuthProvider } from './Providers/AuthProvider';
import { useAuth } from './hooks/auth';

const client = new QueryClient();

function App() {

  return (
    <div className="App">
      <QueryClientProvider client={client}>
        <AuthProvider>
          <div className="login-container">
            <Login />
            <UserDisplay />
          </div>
          <UserDataTable />
        </AuthProvider>
      </QueryClientProvider>

    </div>
  );
}

const UserDisplay = () => {
  const { user } = useAuth();
  return user ? <span>{user.firstName} {user.lastName}</span> : null;
}

export default App;
