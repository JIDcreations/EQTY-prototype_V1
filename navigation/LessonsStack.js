import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LessonsScreen from '../screens/LessonsScreen';
import LessonOverviewScreen from '../screens/LessonOverviewScreen';
import LessonStepScreen from '../screens/LessonStepScreen';
import LessonSuccessScreen from '../screens/LessonSuccessScreen';
import LessonResourcesScreen from '../screens/LessonResourcesScreen';
import LessonVideosScreen from '../screens/LessonVideosScreen';

const Stack = createStackNavigator();

// Simple opacity cross-fade — used for step-to-step and success transitions
const forFade = ({ current }) => ({
  cardStyle: { opacity: current.progress },
});

const stepTransition = {
  open: { animation: 'timing', config: { duration: 180 } },
  close: { animation: 'timing', config: { duration: 140 } },
};

const successTransition = {
  open: { animation: 'timing', config: { duration: 300 } },
  close: { animation: 'timing', config: { duration: 200 } },
};

export default function LessonsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LessonsHome" component={LessonsScreen} />
      <Stack.Screen name="LessonResources" component={LessonResourcesScreen} />
      <Stack.Screen name="LessonVideos" component={LessonVideosScreen} />
      <Stack.Screen name="LessonOverview" component={LessonOverviewScreen} />
      <Stack.Screen
        name="LessonStep"
        component={LessonStepScreen}
        options={{ cardStyleInterpolator: forFade, transitionSpec: stepTransition }}
      />
      <Stack.Screen
        name="LessonSuccess"
        component={LessonSuccessScreen}
        options={{ cardStyleInterpolator: forFade, transitionSpec: successTransition }}
      />
    </Stack.Navigator>
  );
}
