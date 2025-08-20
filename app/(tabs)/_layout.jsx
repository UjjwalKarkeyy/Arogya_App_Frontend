import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

// --- SVG Icons for Tabs ---
const HomeIcon = ({ color }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={28} height={28}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M21 12v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
    </Svg>
);

const ExploreIcon = ({ color }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={28} height={28}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5V21M3.5 12H21" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636L18.364 18.364M5.636 18.364L18.364 5.636" />
    </Svg>
);

const VideosIcon = ({ color }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={28} height={28}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.32-.467.557-.327l5.603 3.112z" />
    </Svg>
);

const NotificationsIcon = ({ color }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={28} height={28}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </Svg>
);

const QRIcon = ({ color }) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={color} width={30} height={30}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 014.5 3.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5zM3.75 15A.75.75 0 014.5 14.25h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5zM14.25 4.5A.75.75 0 0115 3.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5zM16.5 15.75h-1.5v-1.5h1.5v1.5zM19.5 15.75h-1.5v-1.5h1.5v1.5zM16.5 18.75h-1.5v-1.5h1.5v1.5zM19.5 18.75h-1.5v-1.5h1.5v1.5z" />
    </Svg>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { height: 60, paddingBottom: 5 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <ExploreIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: '',
          tabBarIcon: () => (
            <View
              style={{
                backgroundColor: '#00008B', // Dark Blue
                padding: 15,
                borderRadius: 35,
                borderWidth: 5,
                borderColor: 'white', // Matches the app's background
                transform: [{ translateY: -22 }],
                elevation: 4, // Shadow for Android
                shadowColor: '#000', // Shadow for iOS
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }}
            >
              <QRIcon color={'white'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <NotificationsIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          tabBarLabel: 'Videos',
          tabBarIcon: ({ color }) => <VideosIcon color={color}/>,
        }}
      />
    </Tabs>
  );
}