export const categories = [
  {
    id: 'web',
    name: 'Web Development',
    shortName: 'Web',
    color: '#1d4ed8', // Dark Blue
    accentColor: '#3b82f6',
    bgTint: 'rgba(29, 78, 216, 0.16)',
    glowColor: 'rgba(29, 78, 216, 0.45)',
    icon: 'Code2',
    route: '/web',
    tagline: 'Architect high-performance web systems and immersive digital apps.',
    description: 'Learn modern web engineering, scalable full-stack architectures, and responsive UI design.',
    subTracks: [
      'Modern Frontend (React, Next.js, TypeScript)',
      'Scalable Backend & APIs (Node.js, Express, PostgreSQL)',
      'Full-Stack Architecture & Cloud Deployment',
      'Other',
    ],
    highlights: [
      'Component-driven UI & State Management',
      'Secure REST & GraphQL APIs',
      'Performance Optimization & Modern Dev Tooling',
    ],
    tools: ['React', 'TypeScript', 'Node.js', 'Vite', 'PostgreSQL', 'Tailwind/CSS'],
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    shortName: 'Mobile',
    color: '#9333ea', // Purple
    accentColor: '#c084fc',
    bgTint: 'rgba(147, 51, 234, 0.16)',
    glowColor: 'rgba(147, 51, 234, 0.45)',
    icon: 'Smartphone',
    route: '/mobile',
    tagline: 'Engineer fluid mobile experiences for iOS and Android devices.',
    description: 'Build native and cross-platform mobile apps with smooth interactions, offline sync, and real-time data.',
    subTracks: [
      'Cross-Platform Apps with Flutter & Dart',
      'React Native & Mobile Systems',
      'Native Android & Modern App Architecture',
      'Other',
    ],
    highlights: [
      'Responsive Touch Gestures & Micro-interactions',
      'Local Storage, SQLite & Device Hardware APIs',
      'App Store Readiness & Production Workflows',
    ],
    tools: ['Flutter', 'Dart', 'React Native', 'Kotlin', 'Firebase', 'Android Studio'],
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    shortName: 'AI',
    color: '#ea580c', // Orange
    accentColor: '#fb923c',
    bgTint: 'rgba(234, 88, 12, 0.16)',
    glowColor: 'rgba(234, 88, 12, 0.45)',
    icon: 'Brain',
    route: '/ai',
    tagline: 'Harness machine learning models, computer vision, and neural reasoning.',
    description: 'Explore the foundations of predictive modeling, deep learning architectures, and modern generative AI.',
    subTracks: [
      'Machine Learning & Statistical Data Analysis',
      'Deep Learning & Computer Vision (CNNs)',
      'Generative AI, Large Language Models & Prompt Engineering',
      'Other',
    ],
    highlights: [
      'Data Cleansing & Exploratory Visualization',
      'Neural Network Training with PyTorch',
      'Retrieval-Augmented Generation (RAG) Pipelines',
    ],
    tools: ['Python', 'PyTorch', 'Scikit-Learn', 'Pandas', 'Hugging Face', 'OpenCV'],
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    shortName: 'IoT',
    color: '#16a34a', // Green
    accentColor: '#4ade80',
    bgTint: 'rgba(22, 163, 74, 0.16)',
    glowColor: 'rgba(22, 163, 74, 0.45)',
    icon: 'Cpu',
    route: '/iot',
    tagline: 'Bridge hardware, sensors, and cloud communication.',
    description: 'Connect microcontrollers to the physical realm, collect real-time sensor metrics, and build connected devices.',
    subTracks: [
      'Embedded Systems & Microcontroller Basics (Arduino/ESP32)',
      'Wireless Sensor Networks & MQTT Cloud Telemetry',
      'Smart Home & Industrial Automation Prototyping',
      'Other',
    ],
    highlights: [
      'Low-Level C/C++ Firmware Programming',
      'Hardware Circuit Prototyping & Soldering',
      'Cloud Dashboard Integration & Real-Time Alerts',
    ],
    tools: ['ESP32', 'Arduino', 'C/C++', 'Raspberry Pi', 'MQTT', 'FreeRTOS'],
  },
  {
    id: 'media',
    name: 'Media & Creative Tech',
    shortName: 'Media',
    color: '#db2777', // Pink
    accentColor: '#f472b6',
    bgTint: 'rgba(219, 39, 119, 0.16)',
    glowColor: 'rgba(219, 39, 119, 0.45)',
    icon: 'Clapperboard',
    route: '/media',
    tagline: 'Craft bold digital visual storytelling, video, and design assets.',
    description: 'Design striking club graphics, edit dynamic event reels, and produce high-caliber multimedia content.',
    subTracks: [
      'Cinematography & High-Paced Video Editing',
      'Brand Identity, Typography & UI/UX Design',
      '3D Motion Design & Dynamic Graphics',
      'Other',
    ],
    highlights: [
      'Multi-Cam Video Production & Color Grading',
      'Design System Aesthetics in Figma',
      'Audio Design & Dynamic Social Content',
    ],
    tools: ['Premiere Pro', 'After Effects', 'Figma', 'Photoshop', 'Blender', 'DaVinci'],
  },
  {
    id: 'security',
    aliases: ['cybersecurity'],
    name: 'Cybersecurity',
    shortName: 'Security',
    color: '#475569', // Dark Grey / Dark
    accentColor: '#94a3b8',
    bgTint: 'rgba(71, 85, 105, 0.22)',
    glowColor: 'rgba(100, 116, 139, 0.42)',
    icon: 'ShieldCheck',
    route: '/security',
    tagline: 'Investigate defenses, exploit vulnerabilities, and protect digital assets.',
    description: 'Master offensive and defensive cybersecurity fundamentals, capture-the-flag competitions, and system hardening.',
    subTracks: [
      'Ethical Hacking & Web Vulnerability Analysis',
      'Capture The Flag (CTF) Challenges & Cryptography',
      'Network Security & Defensive Forensics',
      'Other',
    ],
    highlights: [
      'Hands-On Penetration Testing Labs',
      'Reverse Engineering & Packet Analysis',
      'Zero-Trust Principles & Defense in Depth',
    ],
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'Nmap', 'Python'],
  },
];

export function getCategoryById(rawId) {
  if (!rawId) return null;
  const clean = rawId.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    categories.find(
      (cat) =>
        cat.id === clean ||
        cat.shortName.toLowerCase() === clean ||
        cat.aliases?.includes(clean),
    ) ?? null
  );
}

