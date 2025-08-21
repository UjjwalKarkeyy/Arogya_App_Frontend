import { Stack } from 'expo-router';
import NewsDetailScreen from '../newsUpdate/NewsDetailScreen';

export default function NewsDetailPage() {
  return (
    <>
      <Stack.Screen options={{ title: 'News Details' }} />
      <NewsDetailScreen />
    </>
  );
}
