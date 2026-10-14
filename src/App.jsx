import React, { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import AttendanceSection from './components/AttendanceSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import Footer from './components/Footer.jsx';
import CategoryRegisterPage from './components/CategoryRegisterPage.jsx';
import { RouterProvider, useRouter } from './router.jsx';

function MainAppContent() {
  const { category, isHome } = useRouter();

  useEffect(() => {
    if (isHome) {
      document.title = 'InfoBrains Open Day | Welcome';
    } else if (category) {
      document.title = `${category.name} | InfoBrains Open Day`;
    }
  }, [isHome, category]);

  return (
    <div className="site-shell">
      <Navbar />
      {category ? (
        <CategoryRegisterPage key={category.id} category={category} />
      ) : (
        <main>
          <Hero />
          <AttendanceSection />
          <AboutSection />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <MainAppContent />
    </RouterProvider>
  );
}
