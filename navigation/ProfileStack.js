import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsHomeScreen from '../screens/SettingsHomeScreen';
import SettingsAccountScreen from '../screens/SettingsAccountScreen';
import SettingsSecurityScreen from '../screens/SettingsSecurityScreen';
import SettingsPreferencesScreen from '../screens/SettingsPreferencesScreen';
import SettingsAccessibilityScreen from '../screens/SettingsAccessibilityScreen';
import SettingsSupportScreen from '../screens/SettingsSupportScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';
import FAQScreen from '../screens/FAQScreen';
import LoggedOutScreen from '../screens/LoggedOutScreen';
import { forSubtleSlide, subtleTransitionSpec } from './transitions';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forSubtleSlide,
        transitionSpec: subtleTransitionSpec,
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
      <Stack.Screen name="SettingsAccount" component={SettingsAccountScreen} />
      <Stack.Screen name="SettingsSecurity" component={SettingsSecurityScreen} />
      <Stack.Screen name="SettingsPreferences" component={SettingsPreferencesScreen} />
      <Stack.Screen name="SettingsAccessibility" component={SettingsAccessibilityScreen} />
      <Stack.Screen name="SettingsSupport" component={SettingsSupportScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="LoggedOut" component={LoggedOutScreen} />
    </Stack.Navigator>
  );
}
