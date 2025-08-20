import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CategoryCard({ icon, name, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {icon}
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // You can add a subtle background or shadow
  },
  name: {
    marginTop: 8,
    textAlign: 'center',
  },
});