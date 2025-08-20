import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface SeasonSelectorProps {
  selectedSeason: string;
  onSeasonSelect: (season: string) => void;
  seasons: string[];
}

export default function SeasonSelector({ selectedSeason, onSeasonSelect, seasons }: SeasonSelectorProps) {
  return (
    <View style={styles.container}>
      {seasons.map((season) => (
        <TouchableOpacity
          key={season}
          style={[
            styles.seasonButton,
            selectedSeason === season && styles.selectedSeason
          ]}
          onPress={() => onSeasonSelect(season)}
        >
          <Text style={[
            styles.seasonText,
            selectedSeason === season && styles.selectedSeasonText
          ]}>
            {season}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light,
    borderRadius: 25,
    padding: 4,
    marginVertical: 20,
  },
  seasonButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedSeason: {
    backgroundColor: Colors.accent,
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  selectedSeasonText: {
    color: Colors.surface,
    fontWeight: '600',
  },
});
