export const mockData = {
    cities: [
      { id: 1, name: 'Kathmandu', region: 'Central' },
      { id: 2, name: 'Pokhara', region: 'Western' },
      { id: 3, name: 'Chitwan', region: 'Central' },
      { id: 4, name: 'Dharan', region: 'Eastern' },
      { id: 5, name: 'Butwal', region: 'Western' },
    ],
    
    seasons: ['Monsoon', 'Summer', 'Winter'],
    
    diseases: {
      'Seasonal Flu': {
        category: 'Viral Infections',
        description: 'Seasonal flu is a common viral respiratory illness that can cause high fever, severe headache, muscle aches, sore throat, and fatigue. It is highly contagious.',
        symptoms: [
          'High fever (3+ 38°C/100°F) and chills',
          'Severe headache and muscle aches',
          'Sore throat, cough, and fatigue',
          'Nasal congestion and runny nose'
        ],
        preventiveMeasures: [
          'Get a seasonal flu shot annually',
          'Wash hands frequently with soap and water',
          'Avoid touching your face',
          'Cover your mouth and nose when coughing or sneezing'
        ],
        treatmentGuidelines: [
          'Rest and stay hydrated',
          'Take over-the-counter medication to relieve symptoms',
          'Avoid aspirin and ibuprofen unless prescribed',
          'Seek medical advice immediately if symptoms worsen'
        ]
      }
    },
    
    quickActions: [
      { id: 1, title: 'Active Diseases', icon: 'activity' },
      { id: 2, title: 'Prevention Tips', icon: 'shield' },
      { id: 3, title: 'Treatment Guidelines', icon: 'medical' }
    ]
  };
  
  
  