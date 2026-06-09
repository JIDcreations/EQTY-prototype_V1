import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LessonsScreen from '../screens/LessonsScreen';
import LessonOverviewScreen from '../screens/LessonOverviewScreen';
import LessonStepScreen from '../screens/LessonStepScreen';
import LessonSuccessScreen from '../screens/LessonSuccessScreen';
import LessonResourcesScreen from '../screens/LessonResourcesScreen';
import LessonVideosScreen from '../screens/LessonVideosScreen';
import DeepDiveScreen from '../screens/DeepDiveScreen';
import PremiumScreen from '../screens/PremiumScreen';
import { forSubtleSlide, subtleTransitionSpec } from './transitions';

const Stack = createStackNavigator();

const webCardStyle = {
  flex: 1,
  overflow: 'visible',
};

// Simple opacity cross-fade — used for step-to-step and success transitions
const forFade = ({ current }) => ({
  cardStyle: { ...webCardStyle, opacity: current.progress },
});

const stepTransition = {
  open: { animation: 'timing', config: { duration: 180 } },
  close: { animation: 'timing', config: { duration: 140 } },
};

const overviewTransition = {
  open: { animation: 'timing', config: { duration: 260 } },
  close: { animation: 'timing', config: { duration: 200 } },
};

const successTransition = {
  open: { animation: 'timing', config: { duration: 300 } },
  close: { animation: 'timing', config: { duration: 200 } },
};

const forOverview = ({ current }) => ({
  cardStyle: {
    ...webCardStyle,
    opacity: current.progress,
  },
});

const forWebSubtleSlide = (props) => {
  const transition = forSubtleSlide(props);
  return {
    ...transition,
    cardStyle: {
      ...webCardStyle,
      ...transition.cardStyle,
    },
  };
};

export default function LessonsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: webCardStyle,
        cardStyleInterpolator: forWebSubtleSlide,
        transitionSpec: subtleTransitionSpec,
      }}
    >
      <Stack.Screen name="LessonsHome" component={LessonsScreen} />
      <Stack.Screen name="LessonResources" component={LessonResourcesScreen} />
      <Stack.Screen name="LessonVideos" component={LessonVideosScreen} />
      <Stack.Screen
        name="LessonOverview"
        component={LessonOverviewScreen}
        options={{ cardStyleInterpolator: forOverview, transitionSpec: overviewTransition }}
      />
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
      <Stack.Screen name="DeepDive" component={DeepDiveScreen} />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ cardStyleInterpolator: forFade, transitionSpec: successTransition }}
      />
    </Stack.Navigator>
  );
}
