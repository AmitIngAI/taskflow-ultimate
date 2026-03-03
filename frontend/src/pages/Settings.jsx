import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Keyboard,
  CreditCard,
  LogOut,
  Save,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Card, Input, Avatar, Badge } from '../components/common';
import { useAuthStore, useThemeStore } from '../store/useStore';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import ThemeSelector from "../components/theme/ThemeSelector";


const Settings = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskAssigned: true,
    taskCompleted: true,
    mentions: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/login';
    }
  };

  const shortcuts = [
    { keys: ['Ctrl', 'K'], action: 'Open search' },
    { keys: ['Ctrl', 'B'], action: 'Toggle sidebar' },
    { keys: ['Ctrl', 'N'], action: 'New task' },
    { keys: ['Ctrl', 'D'], action: 'Toggle dark mode' },
    { keys: ['Esc'], action: 'Close modal' },
    { keys: ['?'], action: 'Show shortcuts' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}

              <div className="border-t border-gray-200 dark:border-dark-700 my-2" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar
                      src={user?.avatar}
                      fallback={user?.name}
                      size="2xl"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Profile Photo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        Upload
                      </Button>
                      <Button size="sm" variant="ghost">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                  <Input
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="Mumbai, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading} icon={Save}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Notification Channels
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in browser</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Activity Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a task is assigned to you' },
                      { key: 'taskCompleted', label: 'Task Completed', desc: 'When a task you created is completed' },
                      { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings[item.key]}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                          className="w-5 h-5 rounded text-primary-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button icon={Save} onClick={() => toast.success('Preferences saved!')}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Appearance
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Theme
                  </h3>
                  <ThemeSelector />
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all',
                          theme === t
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-dark-700 hover:border-primary-300'
                        )}
                      >
                        <div className={cn(
                          'w-full h-20 rounded-lg mb-3',
                          t === 'light' ? 'bg-white border' : t === 'dark' ? 'bg-dark-800' : 'bg-gradient-to-r from-white to-dark-800'
                        )} />
                        <p className="font-medium capitalize text-gray-900 dark:text-white">
                          {t}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Accent Color
                  </h3>
                  <div className="flex gap-3">
                    {['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-4 border-white dark:border-dark-800 shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Security
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                    </div>
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">2FA is disabled</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Active Sessions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Mumbai, India • Current session</p>
                        </div>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="font-medium text-red-600 mb-4">
                    Danger Zone
                  </h3>
                  <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Permanently delete your account and all data. This action cannot be undone.
                    </p>
                    <Button variant="danger" className="mt-4">Delete Account</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Keyboard Shortcuts
              </h2>

              <div className="space-y-4">
                {shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white">{shortcut.action}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded text-sm font-mono"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Billing & Plans
              </h2>

              <div className="space-y-6">
                {/* Current Plan */}
                <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="bg-white/20 text-white mb-2">Current Plan</Badge>
                      <h3 className="text-2xl font-bold">Pro Plan</h3>
                      <p className="opacity-80 mt-1">$12/month • Billed monthly</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">$12</p>
                      <p className="opacity-80">/month</p>
                    </div>
                  </div>
                </div>

                {/* Usage */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Usage This Month
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Created</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4 GB</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Storage Used</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Payment Method
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost">Change</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;