import React, { useEffect, useState } from 'react';
import './index.css';
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  useLocation
} from
  'react-router-dom';
import {
  School,
  Home,
  Globe,
  Building,
  Database,
  Search,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Palette
} from
  'lucide-react';
import { modules } from './data/navigationData';
import { SecondaryNav } from './components/SecondaryNav';
import { Sidebar } from './components/Sidebar';
import { DynamicPage } from './components/DynamicPage';
import { SubModule, FavoriteItem } from './types/navigation';
import { LoginPage } from './pages/LoginPage';
import { HeaderDropdown } from './components/header/HeaderDropdowns';
import { SettingsPage } from './pages/SettingsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SearchExpand } from './components/header/SearchExpand';
import { NotificationPanel } from './components/header/NotificationPanel';
import { HelpSupportPanel } from './components/header/HelpSupportPanel';
import { ThemePanel } from './components/header/ThemePanel';
import { LogoutModal } from './components/header/LogoutModal';
// Helper: find first page ID for a submodule
function getFirstPageId(subModule: SubModule): string {
  if (subModule.sidebarConfig && subModule.sidebarConfig.length > 0) {
    return subModule.sidebarConfig[0].items[0]?.id || subModule.id;
  }
  return subModule.id;
}
// Helper: find default path for a module
function getDefaultModulePath(moduleId: string): string {
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod || mod.subModules.length === 0) return `/${moduleId}`;
  const firstSub = mod.subModules[0];
  const firstPage = getFirstPageId(firstSub);
  return `/${moduleId}/${firstSub.id}/${firstPage}`;
}
// ============================================
// MAIN LAYOUT - renders header + sidebar + content
// ============================================
function MainLayout() {
  const { moduleId, subModuleId, pageId } = useParams<{
    moduleId: string;
    subModuleId: string;
    pageId: string;
  }>();
  const navigate = useNavigate();
  // Panel States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // Dropdown States
  const [medium, setMedium] = useState('English Medium');
  const [branch, setBranch] = useState('Main Campus');
  const [academicYear, setAcademicYear] = useState('AY: 2024-2025');
  // Favorites State
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('eduManagerFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('eduManagerFavorites', JSON.stringify(favorites));
    } catch { }
  }, [favorites]);
  // Derive navigation state from URL
  const activeModule = modules.find((m) => m.id === moduleId);
  const activeSubModule =
    activeModule?.subModules.find((s) => s.id === subModuleId) || null;
  const activeSidebarItemId = pageId || subModuleId || '';
  // Derive screen name
  let activeScreenName = 'Dashboard';
  if (activeSubModule?.sidebarConfig) {
    for (const section of activeSubModule.sidebarConfig) {
      const item = section.items.find((i) => i.id === activeSidebarItemId);
      if (item) {
        activeScreenName = item.label;
        break;
      }
    }
  } else if (activeSubModule) {
    activeScreenName = activeSubModule.label;
  }
  // Handlers
  const handleModuleSelect = (newModuleId: string) => {
    // Navigate to first page of first submodule
    navigate(getDefaultModulePath(newModuleId));
  };
  const handleSubModuleSelect = (subModule: SubModule) => {
    const firstPage = getFirstPageId(subModule);
    navigate(`/${moduleId}/${subModule.id}/${firstPage}`);
  };
  const handleSidebarItemSelect = (itemId: string) => {
    navigate(`/${moduleId}/${subModuleId}/${itemId}`);
  };
  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.sidebarItemId === item.sidebarItemId);
      if (exists) {
        return prev.filter((f) => f.sidebarItemId !== item.sidebarItemId);
      } else {
        return [...prev, item];
      }
    });
  };
  const navigateToFavorite = (item: FavoriteItem) => {
    navigate(`/${item.moduleId}/${item.subModuleId}/${item.sidebarItemId}`);
  };
  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/login');
  };
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Primary Header */}
      <header className="relative z-40 flex h-16 shrink-0 items-center justify-between px-6 shadow-sm bg-gradient-to-br from-[#0F4C5C] via-[#1E6091] to-[#168AAD]">
        <div className="flex min-w-[250px] items-center gap-5">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() =>
              navigate(getDefaultModulePath(moduleId || 'admin-tools'))
            }>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm backdrop-blur-sm">
              <School className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-wide text-white">
                EduManager
              </h1>
            </div>
          </div>
          <div className="mx-2 h-8 w-px bg-white/20"></div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-xs text-white/70">

            <button
              onClick={() => navigate(getDefaultModulePath('admin-tools'))}
              className="transition-colors hover:text-white">

              <Home className="h-3 w-3" />
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-3 rounded-full border border-white/5 bg-black/10 px-4 py-1.5">
            <div className="relative">
              <HeaderDropdown
                icon={Globe}
                value={medium}
                options={['English Medium', 'Hindi Medium', 'Marathi Medium']}
                onChange={setMedium} />

            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="relative">
              <HeaderDropdown
                icon={Building}
                value={branch}
                options={['Main Campus', 'City Campus', 'North Campus']}
                onChange={setBranch} />

            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="relative">
              <HeaderDropdown
                value={academicYear}
                options={['AY: 2024-2025', 'AY: 2023-2024', 'AY: 2022-2023']}
                onChange={setAcademicYear}
                textColor="text-cyan-300 hover:text-cyan-200"
                className="font-medium" />

            </div>
          </div>

          <div className="ml-2 hidden lg:flex w-28 flex-col gap-1">
            <div className="flex justify-between text-[10px] font-medium text-white/80">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" /> Storage
              </span>
              <span>75%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-black/20">
              <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-green-400 to-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
            </div>
          </div>

          <div className="mx-1 h-8 w-px bg-white/10 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <SearchExpand />

            <button
              title="Notifications"
              onClick={() => setIsNotificationOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

              <Bell className="h-6 w-6" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#168AAD] bg-red-500"></span>
            </button>

            <div className="hidden md:flex gap-2">
              <button
                title="Settings"
                onClick={() => navigate('/settings')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <Globe className="h-6 w-6" />
              </button>

              <button
                title="Profile"
                onClick={() => navigate('/profile')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <User className="h-6 w-6" />
              </button>

              <button
                title="Help & Support"
                onClick={() => setIsHelpOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <HelpCircle className="h-6 w-6" />
              </button>

              <button
                title="Change Theme"
                onClick={() => setIsThemeOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <Palette className="h-6 w-6" />
              </button>

              <button
                title="Sign Out"
                onClick={() => setIsLogoutModalOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-red-300 transition-all hover:bg-white/10 hover:text-red-200">

                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Panels & Modals */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)} />

      <HelpSupportPanel
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)} />

      <ThemePanel isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout} />


      {/* Main Content Area */}
      <div className="relative flex min-h-0 flex-1">
        <Sidebar
          activeSubModule={activeSubModule}
          activeSidebarItemId={activeSidebarItemId}
          onSidebarItemSelect={handleSidebarItemSelect}
          activeModuleId={moduleId || 'admin-tools'}
          activeModuleLabel={activeModule?.label || ''}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onNavigateFavorite={navigateToFavorite} />


        <div className="flex min-w-0 flex-1 flex-col">
          <SecondaryNav
            activeModuleId={moduleId || 'admin-tools'}
            onModuleSelect={handleModuleSelect}
            onSubModuleSelect={handleSubModuleSelect} />


          <main className="relative flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
            <DynamicPage
              moduleName={activeModule?.label || 'Module'}
              subModuleName={activeSubModule?.label || 'Submodule'}
              screenName={activeScreenName}
              pageId={activeSidebarItemId} />

          </main>
        </div>
      </div>
    </div>);

}

// ============================================
// SETTINGS LAYOUT - header + settings content
// ============================================
function SettingsLayout() {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [medium, setMedium] = useState('English Medium');
  const [branch, setBranch] = useState('Main Campus');
  const [academicYear, setAcademicYear] = useState('AY: 2024-2025');
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      <header className="relative z-40 flex h-16 shrink-0 items-center justify-between px-6 shadow-sm bg-gradient-to-br from-[#0F4C5C] via-[#1E6091] to-[#168AAD]">
        <div className="flex min-w-[250px] items-center gap-5">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate(-1)}>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm backdrop-blur-sm">
              <School className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-wide text-white">
                EduManager
              </h1>
            </div>
          </div>
          <div className="mx-2 h-8 w-px bg-white/20"></div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-xs text-white/70">

            <button
              onClick={() => navigate(-1)}
              className="transition-colors hover:text-white">

              <Home className="h-3 w-3" />
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-3 rounded-full border border-white/5 bg-black/10 px-4 py-1.5">
            <HeaderDropdown
              icon={Globe}
              value={medium}
              options={['English Medium', 'Hindi Medium', 'Marathi Medium']}
              onChange={setMedium} />

            <div className="h-4 w-px bg-white/20"></div>
            <HeaderDropdown
              icon={Building}
              value={branch}
              options={['Main Campus', 'City Campus', 'North Campus']}
              onChange={setBranch} />

            <div className="h-4 w-px bg-white/20"></div>
            <HeaderDropdown
              value={academicYear}
              options={['AY: 2024-2025', 'AY: 2023-2024', 'AY: 2022-2023']}
              onChange={setAcademicYear}
              textColor="text-cyan-300 hover:text-cyan-200"
              className="font-medium" />

          </div>
          <div className="mx-1 h-8 w-px bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-2">
            <SearchExpand />
            <button
              title="Notifications"
              onClick={() => setIsNotificationOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

              <Bell className="h-6 w-6" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#168AAD] bg-red-500"></span>
            </button>
            <div className="hidden md:flex gap-2">
              <button
                title="Settings"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/10">

                <Globe className="h-6 w-6" />
              </button>
              <button
                title="Profile"
                onClick={() => navigate('/profile')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <User className="h-6 w-6" />
              </button>
              <button
                title="Help & Support"
                onClick={() => setIsHelpOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <HelpCircle className="h-6 w-6" />
              </button>
              <button
                title="Change Theme"
                onClick={() => setIsThemeOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <Palette className="h-6 w-6" />
              </button>
              <button
                title="Sign Out"
                onClick={() => setIsLogoutModalOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-red-300 transition-all hover:bg-white/10 hover:text-red-200">

                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)} />

      <HelpSupportPanel
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)} />

      <ThemePanel isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          navigate('/login');
        }} />

      <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
        <SettingsPage onBack={() => navigate(-1)} />
      </div>
    </div>);

}
// ============================================
// PROFILE LAYOUT
// ============================================
function ProfileLayout() {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [medium, setMedium] = useState('English Medium');
  const [branch, setBranch] = useState('Main Campus');
  const [academicYear, setAcademicYear] = useState('AY: 2024-2025');
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      <header className="relative z-40 flex h-16 shrink-0 items-center justify-between px-6 shadow-sm bg-gradient-to-br from-[#0F4C5C] via-[#1E6091] to-[#168AAD]">
        <div className="flex min-w-[250px] items-center gap-5">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate(-1)}>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm backdrop-blur-sm">
              <School className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-wide text-white">
                EduManager
              </h1>
            </div>
          </div>
          <div className="mx-2 h-8 w-px bg-white/20"></div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-xs text-white/70">

            <button
              onClick={() => navigate(-1)}
              className="transition-colors hover:text-white">

              <Home className="h-3 w-3" />
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-3 rounded-full border border-white/5 bg-black/10 px-4 py-1.5">
            <HeaderDropdown
              icon={Globe}
              value={medium}
              options={['English Medium', 'Hindi Medium', 'Marathi Medium']}
              onChange={setMedium} />

            <div className="h-4 w-px bg-white/20"></div>
            <HeaderDropdown
              icon={Building}
              value={branch}
              options={['Main Campus', 'City Campus', 'North Campus']}
              onChange={setBranch} />

            <div className="h-4 w-px bg-white/20"></div>
            <HeaderDropdown
              value={academicYear}
              options={['AY: 2024-2025', 'AY: 2023-2024', 'AY: 2022-2023']}
              onChange={setAcademicYear}
              textColor="text-cyan-300 hover:text-cyan-200"
              className="font-medium" />

          </div>
          <div className="mx-1 h-8 w-px bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-2">
            <SearchExpand />
            <button
              title="Notifications"
              onClick={() => setIsNotificationOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

              <Bell className="h-6 w-6" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#168AAD] bg-red-500"></span>
            </button>
            <div className="hidden md:flex gap-2">
              <button
                title="Settings"
                onClick={() => navigate('/settings')}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <Globe className="h-6 w-6" />
              </button>
              <button
                title="Profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/10">

                <User className="h-6 w-6" />
              </button>
              <button
                title="Help & Support"
                onClick={() => setIsHelpOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <HelpCircle className="h-6 w-6" />
              </button>
              <button
                title="Change Theme"
                onClick={() => setIsThemeOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 hover:text-white">

                <Palette className="h-6 w-6" />
              </button>
              <button
                title="Sign Out"
                onClick={() => setIsLogoutModalOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-red-300 transition-all hover:bg-white/10 hover:text-red-200">

                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)} />

      <HelpSupportPanel
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)} />

      <ThemePanel isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          navigate('/login');
        }} />

      <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
        <UserProfilePage onBack={() => navigate(-1)} />
      </div>
    </div>);

}
// ============================================
// LOGIN WRAPPER
// ============================================
function LoginWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLogin={() => navigate('/student/student-management/student-list')} />);


}
// ============================================
// APP - Route definitions
// ============================================
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/settings" element={<SettingsLayout />} />
      <Route path="/profile" element={<ProfileLayout />} />
      <Route path="/:moduleId/:subModuleId/:pageId" element={<MainLayout />} />
      <Route path="/:moduleId/:subModuleId" element={<MainLayout />} />
      <Route
        path="/"
        element={
          <Navigate to="/student/student-management/student-list" replace />
        } />

      <Route
        path="*"
        element={
          <Navigate to="/student/student-management/student-list" replace />
        } />

    </Routes>);

}