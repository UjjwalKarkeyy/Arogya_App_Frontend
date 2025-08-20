import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface QuickAction {
  id: number;
  title: string;
  icon: string;
}

interface QuickActionGridProps {
  actions: QuickAction[];
  onActionPress: (action: QuickAction) => void;
}

const getIconName = (iconType: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    activity: 'pulse',
    shield: 'shield-checkmark',
    location: 'location',
    medical: 'medkit'
  };
  return iconMap[iconType] || 'help-circle';
};

export default function QuickActionGrid({ actions, onActionPress }: QuickActionGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              actions.length === 3 && index === 2 ? styles.centeredButton : null
            ]}
            onPress={() => onActionPress(action)}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={getIconName(action.icon)} 
                size={28} 
                color={Colors.primary} 
              />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionButton: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  centeredButton: {
    width: '48%',
    alignSelf: 'center',
    marginLeft: '26%',
    marginTop: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
});
