import { Stack } from 'expo-router';

export default function ForumLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Community Forum',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="new" 
        options={{ 
          title: 'New Post',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
