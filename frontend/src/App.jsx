import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DetectorPage from './components/DetectorPage';
import ResearchTopicsPage from './components/ResearchTopicsPage';
import AddTopicPage from './components/AddTopicPage';
import AboutPage from './components/AboutPage';
import TopicDetailModal from './components/TopicDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('detector');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTopicForModal, setSelectedTopicForModal] = useState(null);
  const [preloadedTopicForDetector, setPreloadedTopicForDetector] = useState(null);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUseTopicForComparison = (topic) => {
    setPreloadedTopicForDetector(topic);
    setActiveTab('detector');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Fixed/Sticky Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeTab === 'detector' && (
          <DetectorPage
            onSelectTopicForModal={setSelectedTopicForModal}
            preloadedTopic={preloadedTopicForDetector}
          />
        )}

        {activeTab === 'topics' && (
          <ResearchTopicsPage
            onSelectTopicForModal={setSelectedTopicForModal}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'add-topic' && (
          <AddTopicPage
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Topic Detail Modal */}
      {selectedTopicForModal && (
        <TopicDetailModal
          topic={selectedTopicForModal}
          onClose={() => setSelectedTopicForModal(null)}
          onUseForComparison={handleUseTopicForComparison}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
