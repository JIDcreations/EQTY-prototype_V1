import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import OnboardingWhatIsEqtyScreen from '../screens/onboarding/OnboardingWhatIsEqtyScreen';
import OnboardingEntryScreen from '../screens/onboarding/OnboardingEntryScreen';
import OnboardingLoginScreen from '../screens/onboarding/OnboardingLoginScreen';
import OnboardingEmailScreen from '../screens/onboarding/OnboardingEmailScreen';
import OnboardingBasicInfoScreen from '../screens/onboarding/OnboardingBasicInfoScreen';
import OnboardingQuestionsIntroScreen from '../screens/onboarding/OnboardingQuestionsIntroScreen';
import OnboardingQuestionScreen from '../screens/onboarding/OnboardingQuestionScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import { forSubtleSlide, subtleTransitionSpec } from './transitions';

const Stack = createStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyleInterpolator: forSubtleSlide,
        transitionSpec: subtleTransitionSpec,
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="OnboardingWhatIsEqty" component={OnboardingWhatIsEqtyScreen} />
      <Stack.Screen name="OnboardingEntry" component={OnboardingEntryScreen} />
      <Stack.Screen name="OnboardingLogin" component={OnboardingLoginScreen} />
      <Stack.Screen name="OnboardingEmail" component={OnboardingEmailScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="OnboardingBasicInfo" component={OnboardingBasicInfoScreen} />
      <Stack.Screen name="OnboardingQuestionsIntro" component={OnboardingQuestionsIntroScreen} />
      <Stack.Screen
        name="OnboardingQuestionExperience"
        component={OnboardingQuestionScreen}
        initialParams={{
          question: 'What have you already done in terms of investing?',
          field: 'experienceAnswer',
          step: 1,
          total: 3,
          nextRoute: 'OnboardingQuestionKnowledge',
        }}
      />
      <Stack.Screen
        name="OnboardingQuestionKnowledge"
        component={OnboardingQuestionScreen}
        initialParams={{
          question: 'What do you already know about investing today?',
          field: 'knowledgeAnswer',
          step: 2,
          total: 3,
          nextRoute: 'OnboardingQuestionMotivation',
        }}
      />
      <Stack.Screen
        name="OnboardingQuestionMotivation"
        component={OnboardingQuestionScreen}
        initialParams={{
          question: 'Why do you want to start investing?',
          field: 'motivationAnswer',
          step: 3,
          total: 3,
          isLast: true,
        }}
      />
    </Stack.Navigator>
  );
}
