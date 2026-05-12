import Profile from '../components/Profile';

interface ProfilePageProps {
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

export default function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  return <Profile onNavigate={onNavigate} onLogout={onLogout} />;
}