import Profile from '../components/Profile';

interface ProfilePageProps {
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onUpgrade: () => void;
}

export default function ProfilePage({ onNavigate, onLogout, onUpgrade }: ProfilePageProps) {
  return <Profile onNavigate={onNavigate} onLogout={onLogout} onUpgrade={onUpgrade} />;
}